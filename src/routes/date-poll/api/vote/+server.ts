import { json } from '@sveltejs/kit';
import { db } from '$lib/server/database.js';
import { broadcastPollUpdate } from '$lib/server/socket.js';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { voterId, level, targetId } = await request.json();

    if (!voterId || !level || !targetId) {
      return json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Start transaction
    const transaction = db.transaction(() => {
      // Check if user already voted for this item
      const existingVote = db.prepare(`
        SELECT id FROM poll_votes 
        WHERE voter_id = ? AND level = ? AND target_id = ?
      `).get(voterId, level, targetId);

      if (existingVote) {
        return { alreadyVoted: true };
      }

      // Record the vote
      const insertVote = db.prepare(`
        INSERT INTO poll_votes (voter_id, level, target_id) 
        VALUES (?, ?, ?)
      `);
      insertVote.run(voterId, level, targetId);

      // Update vote count based on level
      switch (level) {
        case 'year':
          // Ensure year exists
          const insertYear = db.prepare('INSERT OR IGNORE INTO poll_year (year, vote_count) VALUES (?, 0)');
          insertYear.run(targetId);
          
          const updateYear = db.prepare('UPDATE poll_year SET vote_count = vote_count + 1 WHERE year = ?');
          updateYear.run(targetId);
          break;

        case 'month':
          // Extract year and month from targetId (format: YYYYMM)
          const yearMonth = targetId.toString();
          const year = parseInt(yearMonth.substring(0, 4));
          const month = parseInt(yearMonth.substring(4, 6));
          
          // Ensure month exists
          const insertMonth = db.prepare('INSERT OR IGNORE INTO poll_month (year, month, vote_count) VALUES (?, ?, 0)');
          insertMonth.run(year, month);
          
          const updateMonth = db.prepare('UPDATE poll_month SET vote_count = vote_count + 1 WHERE year = ? AND month = ?');
          updateMonth.run(year, month);
          break;

        case 'week':
          // Extract year, month, week from targetId (format: YYYYMMWW)
          const yearMonthWeek = targetId.toString();
          const weekYear = parseInt(yearMonthWeek.substring(0, 4));
          const weekMonth = parseInt(yearMonthWeek.substring(4, 6));
          const week = parseInt(yearMonthWeek.substring(6, 8));
          
          // Calculate week dates
          const startDate = new Date(weekYear, weekMonth - 1, (week - 1) * 7 + 1);
          const endDate = new Date(weekYear, weekMonth - 1, Math.min(week * 7, new Date(weekYear, weekMonth, 0).getDate()));
          
          // Ensure week exists
          const insertWeek = db.prepare(`
            INSERT OR IGNORE INTO poll_week (year, month, week, start_date, end_date, vote_count) 
            VALUES (?, ?, ?, ?, ?, 0)
          `);
          insertWeek.run(weekYear, weekMonth, week, startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]);
          
          const updateWeek = db.prepare('UPDATE poll_week SET vote_count = vote_count + 1 WHERE year = ? AND month = ? AND week = ?');
          updateWeek.run(weekYear, weekMonth, week);
          break;

        case 'day':
          // Extract year, month, day from targetId (format: YYYYMMDD)
          const yearMonthDay = targetId.toString();
          const dayYear = parseInt(yearMonthDay.substring(0, 4));
          const dayMonth = parseInt(yearMonthDay.substring(4, 6));
          const day = parseInt(yearMonthDay.substring(6, 8));
          
          // Calculate which week this day belongs to
          const dayWeek = Math.ceil(day / 7);
          const dayDate = `${dayYear}-${dayMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
          
          // Ensure day exists
          const insertDay = db.prepare(`
            INSERT OR IGNORE INTO poll_day (year, month, week, day, date, vote_count) 
            VALUES (?, ?, ?, ?, ?, 0)
          `);
          insertDay.run(dayYear, dayMonth, dayWeek, day, dayDate);
          
          const updateDay = db.prepare('UPDATE poll_day SET vote_count = vote_count + 1 WHERE date = ?');
          updateDay.run(dayDate);
          break;

        default:
          throw new Error('Invalid vote level');
      }

      return { success: true };
    });

    const result = transaction();

    if (result.alreadyVoted) {
      return json({ error: 'Already voted for this item' }, { status: 400 });
    }

    // Get updated data
    const years = db.prepare('SELECT * FROM poll_year ORDER BY year').all();
    const months = db.prepare('SELECT * FROM poll_month ORDER BY year, month').all();
    const weeks = db.prepare('SELECT * FROM poll_week ORDER BY year, month, week').all();
    const days = db.prepare('SELECT * FROM poll_day ORDER BY year, month, day').all();

    // Broadcast update via WebSocket
    const pollData = { years, months, weeks, days };
    broadcastPollUpdate(pollData);

    return json({
      success: true,
      data: pollData
    });

  } catch (error) {
    console.error('Failed to process vote:', error);
    return json({ error: 'Failed to process vote' }, { status: 500 });
  }
};
