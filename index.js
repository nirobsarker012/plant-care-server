const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jea08bc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Collection Point
    const plantColloection = client.db("plantDB").collection("plants");
    // User collection
    const clientCollection = client.db("plantDB").collection("users");
    // /////////create method
    app.post("/plants", async (req, res) => {
      const newPlants = req.body;
      const result = await plantColloection.insertOne(newPlants);
      res.send(result);
    });

    app.get("/plants", async (req, res) => {
      const result = await plantColloection.find().toArray();
      res.send(result);
    });

    app.get("/plants/:id", async (req, res) => {
      const id = req.params.id;

      const plant = await plantColloection.findOne({
        _id: new ObjectId(id),
      });

      res.send(plant);
    });

    // update plantData
    app.put("/plants/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedPlants = req.body;
      const updatedDoc = {
        $set: updatedPlants,
      };
      const result = await plantColloection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    // Add delete method
    app.delete("/plants/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await plantColloection.deleteOne(query);
      res.send(result);
    });

    // user related API
    app.post("/users", async (req, res) => {
      const userProfile = req.body;
      const result = await clientCollection.insertOne(userProfile);
      res.send(result);
    });

    // User find data
    app.get("/users", async (req, res) => {
      const result = await clientCollection.find().toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send(`Plant care server is getting started`);
});

app.listen(port, () => {
  console.log(`Plant app listening on port ${port}`);
});

//
//
