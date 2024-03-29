const cron = require('node-cron');
const fetchUpdateGainersdata = require("../controler/fetchUpdateGainersdata")
const fetchUpdateLosersdata = require("../controler/fetchUpdateLosersdata")
const fetchupdatefor15mins = require("../controler/fetchupdatefor15mins")


const Livedatacron = cron.schedule('*/10 * * * * *', async () => {
    console.log('Cron job running after 10 sec');
    fetchUpdateGainersdata(4)
    fetchUpdateLosersdata(4)
});

const hr12datacron = cron.schedule('*/1 * * * *', async () => {
    console.log('Cron job running after  1 min');
    
    await fetchupdatefor15mins(5)
});
// Log a message when the cron job starts
console.log('Cron job scheduled to run after 5 minutes');
module.exports = Livedatacron