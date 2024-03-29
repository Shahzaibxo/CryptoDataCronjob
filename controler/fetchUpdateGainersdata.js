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
        const min15oldcoinnames = [];

        arrayofolddata.forEach(obj => {
            oldcoinNames.push(obj.symbol);
            obj.new = false
        }
        );
        await collectionCurrentGain.deleteMany({})

        filteredResponse.forEach(async(obj1) => {
            let adjusted = false

            if (!oldcoinNames.includes(obj1.symbol)) {
                obj1.new = true
            }

            await collectionCurrentGain.insertOne(obj1)
        }) 

        console.log("Gain cronjob running")
        return filteredResponse

    } catch (error) {
        console.log("Error:", error);
    }
}
module.exports = fetchUpdateGainersdata