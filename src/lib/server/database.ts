import Database from 'better-sqlite3';
import { dev } from '$app/environment';

const db = new Database(dev ? 'hackbox.db' : 'hackbox.db', { verbose: console.log });

// Create hackbox_questions table
db.exec(`
  CREATE TABLE IF NOT EXISTS hackbox_questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    category TEXT DEFAULT 'wedding'
  )
`);

// Create hackbox_sessions table
db.exec(`
  CREATE TABLE IF NOT EXISTS hackbox_sessions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'waiting',
    current_question_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create hackbox_players table
db.exec(`
  CREATE TABLE IF NOT EXISTS hackbox_players (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    nickname TEXT NOT NULL,
    score INTEGER DEFAULT 0,
    FOREIGN KEY (session_id) REFERENCES hackbox_sessions (id)
  )
`);

// Create hackbox_answers table
db.exec(`
  CREATE TABLE IF NOT EXISTS hackbox_answers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id TEXT NOT NULL,
    question_id INTEGER NOT NULL,
    answer TEXT NOT NULL,
    votes INTEGER DEFAULT 0,
    FOREIGN KEY (player_id) REFERENCES hackbox_players (id),
    FOREIGN KEY (question_id) REFERENCES hackbox_questions (id)
  )
`);

// Seed wedding-themed questions
const questions = [
  "The worst thing about weddings is ____",
  "The couple's first fight will be about ____",
  "At the reception, the bride will definitely ____",
  "The groom's biggest fear about marriage is ____",
  "The most embarrassing thing that could happen during the ceremony is ____",
  "The couple's honeymoon will be ruined by ____",
  "The wedding cake should have been shaped like ____"
];

const insertQuestion = db.prepare('INSERT OR IGNORE INTO hackbox_questions (question, category) VALUES (?, ?)');
const seedQuestions = db.transaction(() => {
  for (const question of questions) {
    insertQuestion.run(question, 'wedding');
  }
});

// Only seed if table is empty
const count = db.prepare('SELECT COUNT(*) as count FROM hackbox_questions').get() as { count: number };
if (count.count === 0) {
  seedQuestions();
}

// Create date poll tables
db.exec(`
  CREATE TABLE IF NOT EXISTS poll_year (
    id INTEGER PRIMARY KEY,
    year INTEGER NOT NULL UNIQUE,
    vote_count INTEGER DEFAULT 0
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS poll_month (
    id INTEGER PRIMARY KEY,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    vote_count INTEGER DEFAULT 0,
    UNIQUE(year, month)
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS poll_week (
    id INTEGER PRIMARY KEY,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    week INTEGER NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    vote_count INTEGER DEFAULT 0,
    UNIQUE(year, month, week)
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS poll_day (
    id INTEGER PRIMARY KEY,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    week INTEGER NOT NULL,
    day INTEGER NOT NULL,
    date TEXT NOT NULL UNIQUE,
    vote_count INTEGER DEFAULT 0
  )
`);

// Create poll votes tracking table
db.exec(`
  CREATE TABLE IF NOT EXISTS poll_votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    voter_id TEXT NOT NULL,
    level TEXT NOT NULL, -- 'year', 'month', 'week', 'day'
    target_id INTEGER NOT NULL,
    voted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(voter_id, level, target_id)
  )
`);

export { db };
