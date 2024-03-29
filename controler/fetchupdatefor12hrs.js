const axios = require('axios');
const { connectToMongoDB } = require('../db/CoindataDB');


async function fetchupdatefor12hrs(DataSize) {
    const { collection12hrGain } = await connectToMongoDB();
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


        await collection12hrGain.deleteMany({
            date: {
                $lt: new Date(Date.now() - 12 * 60 * 60 * 1000)
            }
        });

        const arrayofolddatafrom15min = await collection12hrGain.find().toArray()

        arrayofolddatafrom15min.sort((a, b) => b.changeinPercentage - a.changeinPercentage);
        filteredResponse.sort((a, b) => b.changeinPercentage - a.changeinPercentage);


        filteredResponse.forEach(async (obj1) => {
            let min15oldcoinnames = [];
            let adjusted = false

            const epsilon = 0.00001; 

            function compareFloats(a, b) {
                return a - b > epsilon;
            }
            arrayofolddatafrom15min.forEach(async (obj) => {
                min15oldcoinnames.push(obj.symbol)

                if (compareFloats(obj1.changeinPercentage, obj.changeinPercentage) && adjusted === false) {
                    if (!min15oldcoinnames.includes(obj1.symbol)) {
                        adjusted = true
                        await collection12hrGain.insertOne(obj1)
                    }

                }

                if (obj1.symbol === obj.symbol && adjusted === true) {
                    await collection12hrGain.deleteOne({ _id: obj._id })

                }


            })

        })


        console.log("Gain 12hr cronjob running")


    } catch (error) {
        console.log("Error:", error);
    }

}
module.exports = fetchupdatefor12hrs