const { MongoClient } = require("mongodb");

const Gaincollection = "gainers";
const Losscollection = "losers";
const Databasename = "coindata";
const min15collection="15minOldData"

const uri = "mongodb://shahziwork:Uj9riYKOLYZ1uLVp@ac-m3eiggb-shard-00-00.fbmqykm.mongodb.net:27017,ac-m3eiggb-shard-00-01.fbmqykm.mongodb.net:27017,ac-m3eiggb-shard-00-02.fbmqykm.mongodb.net:27017/?ssl=true&replicaSet=atlas-tpiip0-shard-0&authSource=admin&retryWrites=true&w=majority&appName=GmailDb";
const client = new MongoClient(uri);

async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        const db = client.db(Databasename);
        const collectionCurrentGain = db.collection(Gaincollection);
        const collectionCurrentloss = db.collection(Losscollection);
        const collection15min=db.collection(min15collection);


        return {collectionCurrentGain, collectionCurrentloss, collection15min };
        
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);

    }
}


module.exports = { connectToMongoDB };
