const axios = require('axios');
const { connectToMongoDB } = require('../db/CoindataDB');


async function fetchUpdateLosersdata(DataSize) {
    const { collectionCurrentloss } = await connectToMongoDB();
    try {

        const res = await axios.get(`https://www.kucoin.com/_api/market-front/search?currentPage=1&lang=en_US&pageSize=${DataSize}&sortType=ASC&subCategory=decrease&tabType=RANKING`)
        const filteredResponse = res.data.data.data.map(eachcoin => ({
            symbolCode: eachcoin.symbolCode,
            symbol: eachcoin.symbol,
            changeinPercentage: parseFloat((eachcoin.changeRate24h * 100).toFixed(2)),
            lastUSDPrice: parseFloat(eachcoin.lastUSDPrice),
            Icon: eachcoin.iconUrl,
            date: new Date(),
            new: false
        }));


        const arrayofolddata = await collectionCurrentloss.find().toArray()

        arrayofolddata.sort((a, b) => b.changeinPercentage - a.changeinPercentage);
        filteredResponse.sort((a, b) => b.changeinPercentage - a.changeinPercentage);



        const oldcoinNames = [];
        const UniqueCoinnames = [];


        arrayofolddata.forEach(obj => {
            oldcoinNames.push(obj.symbol);
            obj.new = false
        }
        );
        await collectionCurrentloss.deleteMany({})

        filteredResponse.forEach(async (obj) => {
            if (!oldcoinNames.includes(obj.symbol)) {
                UniqueCoinnames.push(obj.symbol);
                obj.new = true

            }
            await collectionCurrentloss.insertOne(obj)
        })
    
        console.log("Loss cronjob running")


    } catch (error) {
        console.log("Error:", error).message;
    }
}
module.exports= fetchUpdateLosersdata