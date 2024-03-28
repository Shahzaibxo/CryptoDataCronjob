const cron = require('node-cron');
const fetchUpdateGainersdata = require("../controler/fetchUpdateGainersdata")
const fetchUpdateLosersdata = require("../controler/fetchUpdateLosersdata")



const Coindatacron = cron.schedule('*/30 * * * * *', async () => {
    console.log('Cron job running after 20 sec');
    const resultofprofit = await fetchUpdateGainersdata(4)
    const resultofloss = await fetchUpdateLosersdata(4)
}, {
    scheduled: false // Do not start immediately
});

// Log a message when the cron job starts
console.log('Cron job scheduled to run after 5 minutes');
module.exports = Coindatacron