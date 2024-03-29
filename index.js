const express = require('express')
const { Livedatacron, hr12datacron } = require('./cronjob/Maincronjob')
const { connectToMongoDB } = require('./db/CoindataDB');

const app = express()
port = 3000

app.get('/',(req,res)=>{
  res.status(200).json(testingendpoint)
})
app.get('/coindata', async (req, res) => {
  try{

    Livedatacron.start()
    hr12datacron.start()
    const { collection12hrGain, collectionCurrentloss, collectionCurrentGain, collection12hrs } = await connectToMongoDB()
    const hour12datagain = await collection12hrGain.find().toArray()
    const hour12dataloss = await collection12hrs.find().toArray()
    const livedatagain = await collectionCurrentGain.find().toArray()
    const livedataloss = await collectionCurrentloss.find().toArray()
    
    res.status(200).json({liveLossData:livedataloss, liveGainData:livedatagain, GainDataFor12Hrs:hour12datagain, LossDataFor12Hrs:hour12dataloss})
  }
  catch(error){
    res.status(500).json(error)
  }
})

app.listen(port)

