var cron = require('node-cron');
var express = require('express');
var app = express();
var routes = require('./routes/cryptoRoutes');

app.use('/', routes.router);

app.listen(3000, () => {
    console.log('Server is up and running on port 3000');
});

var task = cron.schedule('0 */2 * * *', () => {
    console.log('Running a task every two hours');
    // Fetch data from the API
    // Save data to the database
    routes.fetchData();
},{
    scheduled: true,
    timezone: "Asia/Kolkata"
});

task.start();