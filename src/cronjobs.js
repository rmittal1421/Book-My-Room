var cron = require('cron')

var CronJob = cron.CronJob;
new CronJob('* * * * * *', function () {
    console.log('You will see this message every second');
}).start();