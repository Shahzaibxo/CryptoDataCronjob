const express = require('express')
const Coindatacron = require('./cronjob/Maincronjob')
const { connectToMongoDB } = require('./db/CoindataDB');

const app=express()
port=3000

app.get('/', async(req, res) => {
    Coindatacron.start()
    const {collectionCurrentGain, collectionCurrentloss }= await connectToMongoDB()
    const results= await collectionCurrentGain.find().toArray()
    res.status(200).json(results)
  })

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
