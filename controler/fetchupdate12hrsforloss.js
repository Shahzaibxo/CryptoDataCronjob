const axios = require('axios');
const { connectToMongoDB } = require('../db/CoindataDB');


async function fetchupdate12hrsforloss(DataSize) {
    const { collection12hrs } = await connectToMongoDB();
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


        await collection12hrs.deleteMany({
            date: {
                $lt: new Date(Date.now() - 12 * 60 * 60 * 1000)
            }
        });

        const arrayofolddatafrom15min = await collection12hrs.find().toArray()

        arrayofolddatafrom15min.sort((a, b) => a.changeinPercentage - b.changeinPercentage);
        filteredResponse.sort((a, b) => a.changeinPercentage - b.changeinPercentage);


        filteredResponse.forEach(async (obj1) => {
            let min15oldcoinnames = [];
            let adjusted = false

            
            arrayofolddatafrom15min.forEach(async (obj) => {
                min15oldcoinnames.push(obj.symbol)

                if (obj1.changeinPercentage<obj.changeinPercentage && adjusted === false) {
                    if (!min15oldcoinnames.includes(obj1.symbol)) {
                        adjusted = true
                        obj1.new=true
                        await collection12hrs.insertOne(obj1)
                    }

                }

                if (obj1.symbol === obj.symbol && adjusted === true) {
                    await collection12hrs.deleteOne({ _id: obj._id })

                }


            }) 

        }) 


        console.log("loss 12hr cronjob running")


    } catch (error) {
        console.log("Error:", error);
    }

}
module.exports = fetchupdate12hrsforloss