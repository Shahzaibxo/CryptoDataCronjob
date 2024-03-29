const axios = require('axios');
const { connectToMongoDB } = require('../db/CoindataDB');


async function fetchupdatefor15mins(DataSize) {
    const { collection15min } = await connectToMongoDB();
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


        await collection15min.deleteMany({
            date: {
                $lt: new Date(Date.now() - 12 * 60 * 60 * 1000)
            }
        });

        const arrayofolddatafrom15min = await collection15min.find().toArray()

        arrayofolddatafrom15min.sort((a, b) => b.changeinPercentage - a.changeinPercentage);
        filteredResponse.sort((a, b) => b.changeinPercentage - a.changeinPercentage);


        filteredResponse.forEach(async (obj1) => {
            let min15oldcoinnames = [];
            let adjusted = false

            const epsilon = 0.00001; // Set a small value for comparison

            function compareFloats(a, b) {
                return a - b > epsilon;
            }
            arrayofolddatafrom15min.forEach(async (obj) => {
                min15oldcoinnames.push(obj.symbol)

                if (compareFloats(obj1.changeinPercentage, obj.changeinPercentage) && adjusted === false) {
                    if (!min15oldcoinnames.includes(obj1.symbol)) {
                        adjusted = true
                        await collection15min.insertOne(obj1)
                    }

                }

                if (obj1.symbol === obj.symbol && adjusted === true) {
                    await collection15min.deleteOne({ _id: obj._id })

                }


                // console.log(obj)
            }) // foreach for 15min data

        }) // foreach for real time update data


        console.log("Gain cronjob running")


    } catch (error) {
        console.log("Error:", error);
    }

}
module.exports = fetchupdatefor15mins