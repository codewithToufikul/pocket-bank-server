const express = require('express');
const app = express();
const jwt = require("jsonwebtoken");
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();

// middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS}@cluster0.ivo4yuq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  const usersCollections = client.db("pocket-bank").collection("usersCollections");
  try {
    await client.connect();


    // jwt
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "8h",
      });
      res.send({ token });
    });

    app.get('/', (req, res)=>{
        res.send('bank running')
    })

    // registration user api
    app.post('/users', async(req, res)=>{
      const user = req.body
      const result = await usersCollections.insertOne(user)
      res.send(result)
    })
    app.get('/users', async(req, res)=>{
      const result = await usersCollections.find().toArray()
      res.send(result)
    })

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

  }
}
run().catch(console.dir);


app.listen(port,()=>{
    console.log(`bank run in ${port}`);
})