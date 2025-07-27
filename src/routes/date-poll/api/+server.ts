import { json } from '@sveltejs/kit';
import { db } from '$lib/server/database.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  try {
    const years = db.prepare('SELECT * FROM poll_year ORDER BY year').all();
    const months = db.prepare('SELECT * FROM poll_month ORDER BY year, month').all();
    const weeks = db.prepare('SELECT * FROM poll_week ORDER BY year, month, week').all();
    const days = db.prepare('SELECT * FROM poll_day ORDER BY year, month, day').all();

    return json({
      years,
      months,
      weeks,
      days
    });
  } catch (error) {
    console.error('Failed to fetch poll data:', error);
    return json({ error: 'Failed to fetch poll data' }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { type, data } = await request.json();

    switch (type) {
      case 'create_year':
        const insertYear = db.prepare('INSERT OR IGNORE INTO poll_year (year, vote_count) VALUES (?, 0)');
        insertYear.run(data.year);
        break;

      case 'create_month':
        const insertMonth = db.prepare('INSERT OR IGNORE INTO poll_month (year, month, vote_count) VALUES (?, ?, 0)');
        insertMonth.run(data.year, data.month);
        break;

      case 'create_week':
        const insertWeek = db.prepare(`
          INSERT OR IGNORE INTO poll_week (year, month, week, start_date, end_date, vote_count) 
          VALUES (?, ?, ?, ?, ?, 0)
        `);
        insertWeek.run(data.year, data.month, data.week, data.start_date, data.end_date);
        break;

      case 'create_day':
        const insertDay = db.prepare(`
          INSERT OR IGNORE INTO poll_day (year, month, week, day, date, vote_count) 
          VALUES (?, ?, ?, ?, ?, 0)
        `);
        insertDay.run(data.year, data.month, data.week, data.day, data.date);
        break;

      default:
        return json({ error: 'Invalid operation type' }, { status: 400 });
    }

    // Return updated data
    const years = db.prepare('SELECT * FROM poll_year ORDER BY year').all();
    const months = db.prepare('SELECT * FROM poll_month ORDER BY year, month').all();
    const weeks = db.prepare('SELECT * FROM poll_week ORDER BY year, month, week').all();
    const days = db.prepare('SELECT * FROM poll_day ORDER BY year, month, day').all();

    return json({
      success: true,
      data: { years, months, weeks, days }
    });
  } catch (error) {
    console.error('Failed to create poll data:', error);
    return json({ error: 'Failed to create poll data' }, { status: 500 });
  }
};
