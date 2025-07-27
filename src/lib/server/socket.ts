import { Server as SocketIOServer } from 'socket.io';
import type { Server } from 'http';
import { db } from './database.js';
import { randomBytes } from 'crypto';

let io: SocketIOServer;

export interface Player {
  id: string;
  nickname: string;
  score: number;
  sessionId: string;
}

export interface GameSession {
  id: string;
  name: string;
  players: Player[];
  status: 'waiting' | 'answering' | 'voting' | 'results' | 'finished';
  currentQuestionId: number | null;
  currentAnswers: Array<{ playerId: string; answer: string; votes: number }>;
  timeRemaining: number;
}

const sessions = new Map<string, GameSession>();

export function initializeSocketIO(server: Server) {
  io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Create or join session
    socket.on('create-session', (sessionName: string, callback) => {
      const sessionId = generateSessionId();
      const session: GameSession = {
        id: sessionId,
        name: sessionName,
        players: [],
        status: 'waiting',
        currentQuestionId: null,
        currentAnswers: [],
        timeRemaining: 0
      };
      
      sessions.set(sessionId, session);
      
      // Save to database
      const stmt = db.prepare('INSERT INTO hackbox_sessions (id, name) VALUES (?, ?)');
      stmt.run(sessionId, sessionName);
      
      callback({ success: true, sessionId });
    });

    socket.on('join-session', (data: { sessionId: string; nickname: string }, callback) => {
      const session = sessions.get(data.sessionId);
      if (!session) {
        callback({ success: false, error: 'Session not found' });
        return;
      }

      // Check if nickname is already taken
      if (session.players.some(p => p.nickname === data.nickname)) {
        callback({ success: false, error: 'Nickname already taken' });
        return;
      }

      const player: Player = {
        id: socket.id,
        nickname: data.nickname,
        score: 0,
        sessionId: data.sessionId
      };

      session.players.push(player);
      socket.join(data.sessionId);

      // Save player to database
      const stmt = db.prepare('INSERT INTO hackbox_players (id, session_id, nickname) VALUES (?, ?, ?)');
      stmt.run(socket.id, data.sessionId, data.nickname);

      callback({ success: true, player });
      
      // Broadcast updated player list
      io.to(data.sessionId).emit('players-updated', session.players);
    });

    socket.on('start-game', (sessionId: string) => {
      const session = sessions.get(sessionId);
      if (!session || session.players.length < 2) return;

      // Get first question
      const question = db.prepare('SELECT * FROM hackbox_questions ORDER BY RANDOM() LIMIT 1').get() as { id: number; question: string };
      
      session.status = 'answering';
      session.currentQuestionId = question.id;
      session.timeRemaining = 60; // 60 seconds to answer

      io.to(sessionId).emit('game-started', {
        question: question.question,
        timeRemaining: session.timeRemaining
      });

      // Start timer
      startTimer(sessionId, 'answering');
    });

    socket.on('submit-answer', (data: { sessionId: string; answer: string }) => {
      const session = sessions.get(data.sessionId);
      if (!session || session.status !== 'answering') return;

      const player = session.players.find(p => p.id === socket.id);
      if (!player) return;

      // Save answer to database
      const stmt = db.prepare('INSERT INTO hackbox_answers (player_id, question_id, answer) VALUES (?, ?, ?)');
      stmt.run(socket.id, session.currentQuestionId, data.answer);

      // Add to current answers
      session.currentAnswers.push({
        playerId: socket.id,
        answer: data.answer,
        votes: 0
      });

      // Check if all players have answered
      if (session.currentAnswers.length === session.players.length) {
        startVotingPhase(data.sessionId);
      }
    });

    socket.on('submit-vote', (data: { sessionId: string; answerId: string }) => {
      const session = sessions.get(data.sessionId);
      if (!session || session.status !== 'voting') return;

      const answer = session.currentAnswers.find(a => a.playerId === data.answerId);
      if (answer && answer.playerId !== socket.id) { // Can't vote for your own answer
        answer.votes++;
      }

      // Update vote count in database
      const stmt = db.prepare('UPDATE hackbox_answers SET votes = votes + 1 WHERE player_id = ? AND question_id = ?');
      stmt.run(data.answerId, session.currentQuestionId);
    });

    socket.on('get-session', (sessionId: string, callback) => {
      const session = sessions.get(sessionId);
      if (session) {
        callback({ success: true, session });
      } else {
        callback({ success: false, error: 'Session not found' });
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      
      // Remove player from all sessions
      for (const [sessionId, session] of sessions.entries()) {
        const playerIndex = session.players.findIndex(p => p.id === socket.id);
        if (playerIndex !== -1) {
          session.players.splice(playerIndex, 1);
          io.to(sessionId).emit('players-updated', session.players);
          
          // If no players left, clean up session
          if (session.players.length === 0) {
            sessions.delete(sessionId);
          }
        }
      }
    });
  });

  return io;
}

function generateSessionId(): string {
  return randomBytes(3).toString('hex').toUpperCase();
}

function startTimer(sessionId: string, phase: 'answering' | 'voting') {
  const session = sessions.get(sessionId);
  if (!session) return;

  const duration = phase === 'answering' ? 60 : 30; // 60s for answering, 30s for voting
  session.timeRemaining = duration;

  const timer = setInterval(() => {
    session.timeRemaining--;
    io.to(sessionId).emit('timer-update', session.timeRemaining);

    if (session.timeRemaining <= 0) {
      clearInterval(timer);
      
      if (phase === 'answering') {
        startVotingPhase(sessionId);
      } else if (phase === 'voting') {
        showResults(sessionId);
      }
    }
  }, 1000);
}

function startVotingPhase(sessionId: string) {
  const session = sessions.get(sessionId);
  if (!session) return;

  session.status = 'voting';
  session.timeRemaining = 30;

  // Shuffle answers for voting
  const shuffledAnswers = [...session.currentAnswers].sort(() => Math.random() - 0.5);

  io.to(sessionId).emit('voting-phase', {
    answers: shuffledAnswers.map(a => ({ id: a.playerId, answer: a.answer })),
    timeRemaining: session.timeRemaining
  });

  startTimer(sessionId, 'voting');
}

function showResults(sessionId: string) {
  const session = sessions.get(sessionId);
  if (!session) return;

  session.status = 'results';

  // Calculate scores
  for (const answer of session.currentAnswers) {
    const player = session.players.find(p => p.id === answer.playerId);
    if (player) {
      player.score += answer.votes * 100; // 100 points per vote
      
      // Update score in database
      const stmt = db.prepare('UPDATE hackbox_players SET score = ? WHERE id = ?');
      stmt.run(player.score, player.id);
    }
  }

  // Get player nicknames for results
  const results = session.currentAnswers.map(answer => {
    const player = session.players.find(p => p.id === answer.playerId);
    return {
      nickname: player?.nickname || 'Unknown',
      answer: answer.answer,
      votes: answer.votes
    };
  }).sort((a, b) => b.votes - a.votes);

  io.to(sessionId).emit('results', {
    results,
    leaderboard: session.players.sort((a, b) => b.score - a.score)
  });

  // Reset for next question after 10 seconds
  setTimeout(() => {
    const nextQuestion = db.prepare('SELECT * FROM hackbox_questions WHERE id != ? ORDER BY RANDOM() LIMIT 1')
      .get(session.currentQuestionId) as { id: number; question: string } | undefined;

    if (nextQuestion) {
      session.currentQuestionId = nextQuestion.id;
      session.currentAnswers = [];
      session.status = 'answering';
      session.timeRemaining = 60;

      io.to(sessionId).emit('next-question', {
        question: nextQuestion.question,
        timeRemaining: session.timeRemaining
      });

      startTimer(sessionId, 'answering');
    } else {
      session.status = 'finished';
      io.to(sessionId).emit('game-finished', {
        finalLeaderboard: session.players.sort((a, b) => b.score - a.score)
      });
    }
  }, 10000);
}

// Poll update broadcast function
export function broadcastPollUpdate(pollData: any) {
  if (io) {
    io.emit('poll-update', pollData);
  }
}

export { io };
