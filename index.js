const express = require('express')
const Livedatacron = require('./cronjob/Maincronjob')
const { connectToMongoDB } = require('./db/CoindataDB');

const app=express()
port=3000

app.get('/', async(req, res) => {
    Livedatacron.start()
    const {collection15min, collectionCurrentloss }= await connectToMongoDB()
    const results= await collection15min.find().toArray()
    res.status(200).json(results)
  })

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

