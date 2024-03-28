const axios = require('axios');
const { connectToMongoDB } = require('../db/CoindataDB');


async function fetchUpdateGainersdata(DataSize) {
    const { collectionCurrentGain, collection15min } = await connectToMongoDB();
    try {

        const res = await axios.get(`https://www.kucoin.com/_api/market-front/search?currentPage=1&lang=en_US&pageSize=${DataSize}&sortType=ASC&subCategory=increase&tabType=RANKING`)
        const filteredResponse = res.data.data.data.map(eachcoin => ({
            symbolCode: eachcoin.symbolCode,
            symbol: eachcoin.symbol,
            changeinPercentage: parseFloat((eachcoin.changeRate24h * 100).toFixed(2)),
            lastUSDPrice: parseFloat(eachcoin.lastUSDPrice),
            Icon: eachcoin.iconUrl,
            date: new Date(),
            new: false,
            display: true
        }));


        const arrayofolddata = await collectionCurrentGain.find().toArray()
        const arrayofolddatafrom15min = await collection15min.find().toArray()

        arrayofolddata.sort((a, b) => b.changeinPercentage - a.changeinPercentage);
        arrayofolddatafrom15min.sort((a, b) => b.changeinPercentage - a.changeinPercentage);
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

            arrayofolddatafrom15min.forEach(async (obj) => {
                min15oldcoinnames.push(obj.symbol)
                if (obj1.changeinPercentage > obj.changeinPercentage && adjusted === false && !min15oldcoinnames.includes(obj1)) {
                    adjusted = true
                    
                    await collection15min.insertOne(obj1)

                }

                if (obj1.symbol === obj.symbol && adjusted === true) {
                    await collection15min.deleteOne(obj._id)
                }
               


            }) // foreach for 15min data

            await collectionCurrentGain.insertOne(obj1)
        }) // foreach for real time update data


        console.log("Gain cronjob running")
        return filteredResponse

    } catch (error) {
        console.log("Error:", error).message;
    }
}
module.exports = fetchUpdateGainersdata