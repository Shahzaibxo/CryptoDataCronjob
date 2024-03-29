const cron = require('node-cron');
const fetchUpdateGainersdata = require("../controler/fetchUpdateGainersdata")
const fetchUpdateLosersdata = require("../controler/fetchUpdateLosersdata")
const fetchupdatefor12hrs = require("../controler/fetchupdatefor12hrs")
const fetchupdate12hrsforloss = require("../controler/fetchupdate12hrsforloss")



const Livedatacron = cron.schedule('*/10 * * * * *', async () => {
    console.log('Cron job running after 10 sec');
    fetchUpdateGainersdata(6)
    fetchUpdateLosersdata(6)
});

const hr12datacron = cron.schedule('*/1 * * * *', async () => {
    console.log('Cron job running after  1 min');
    await fetchupdatefor12hrs(6)
    await fetchupdate12hrsforloss(6)
});
// Log a message when the cron job starts
console.log('Cron job scheduled to run after 5 minutes');
module.exports = {Livedatacron, hr12datacron}