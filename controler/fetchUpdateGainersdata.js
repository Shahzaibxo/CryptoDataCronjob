const axios = require('axios');
const { connectToMongoDB } = require('../db/CoindataDB');


async function fetchUpdateGainersdata(DataSize) {
    const { collectionCurrentGain } = await connectToMongoDB();
    try {

        const res = await axios.get(`https://www.kucoin.com/_api/market-front/search?currentPage=1&lang=en_US&pageSize=${DataSize}&sortType=ASC&subCategory=increase&tabType=RANKING`)
        const filteredResponse = res.data.data.data.map(eachcoin => ({
            symbolCode: eachcoin.symbolCode,
            symbol: eachcoin.symbol,
            changeinPercentage: parseFloat((eachcoin.changeRate24h * 100).toFixed(2)),
            lastUSDPrice: parseFloat(eachcoin.lastUSDPrice),
            Icon: eachcoin.iconUrl,
            date: new Date(),
            new: false
        }));


        const arrayofolddata = await collectionCurrentGain.find().toArray()

        arrayofolddata.sort((a, b) => b.changeinPercentage - a.changeinPercentage);
        filteredResponse.sort((a, b) => b.changeinPercentage - a.changeinPercentage);



        const oldcoinNames = [];
        const UniqueCoinnames = [];


        arrayofolddata.forEach(obj => {
            oldcoinNames.push(obj.symbol);
            obj.new = false
        }
        );
        await collectionCurrentGain.deleteMany({})

        filteredResponse.forEach(async (obj) => {
            if (!oldcoinNames.includes(obj.symbol)) {
                UniqueCoinnames.push(obj.symbol);
                obj.new = true

            }
            await collectionCurrentGain.insertOne(obj)
        })




       
        console.log("Gain cronjob running")
        return filteredResponse

    } catch (error) {
        console.log("Error:", error).message;
    }
}
module.exports= fetchUpdateGainersdata