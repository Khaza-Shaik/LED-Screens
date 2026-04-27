const cron = require('node-cron');
const Schedule = require('../models/Schedule');

// Check every minute
cron.schedule('* * * * *', async () => {
  console.log('Running scheduler...');
  const now = new Date();
  const currentDate = now.toISOString().split('T')[0];
  const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

  try {
    // 1. Start pending/approved videos that should be playing
    const toStart = await Schedule.find({
      date: currentDate,
      startTime: { $lte: currentTime },
      endTime: { $gt: currentTime },
      status: 'approved'
    });

    for (const schedule of toStart) {
      schedule.status = 'playing';
      await schedule.save();
      console.log(`Started schedule ${schedule._id}`);
    }

    // 2. Complete videos that have finished
    const toComplete = await Schedule.find({
      $or: [
        { date: { $lt: currentDate } },
        { date: currentDate, endTime: { $lte: currentTime } }
      ],
      status: 'playing'
    });

    for (const schedule of toComplete) {
      schedule.status = 'completed';
      await schedule.save();
      console.log(`Completed schedule ${schedule._id}`);
    }
  } catch (err) {
    console.error('Scheduler error:', err);
  }
});
