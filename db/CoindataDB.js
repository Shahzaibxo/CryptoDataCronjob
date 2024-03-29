const { MongoClient } = require("mongodb");
require('dotenv').config()

const Gaincollection = "gainers";
const Losscollection = "losers";
const Databasename = "coindata";
const min15collection="15minOldData"
const min16collection="12hrloss"

const uri = process.env.DB_URI;
const client = new MongoClient(uri);

async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        const db = client.db(Databasename);
        const collectionCurrentGain = db.collection(Gaincollection);
        const collectionCurrentloss = db.collection(Losscollection);
        const collection12hrGain=db.collection(min15collection);
        const collection12hrs=db.collection(min16collection);

        


        return {collectionCurrentGain, collectionCurrentloss, collection12hrGain,collection12hrs };
        
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);

    }
}


module.exports = { connectToMongoDB };
