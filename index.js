const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const cors = require('cors')
const app = express();
const port = process.env.PORT || 3000;


//middleware
app.use(cors());
app.use(express.json())


//user: simpleDBUser
//pass: simpleDB2025
const uri = "mongodb+srv://simpleDBUser:simpleDB2025@clusterofrazu.6jqzkwj.mongodb.net/?retryWrites=true&w=majority&appName=clusterOfRazu";


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();


        const database = client.db('usersDB');
        const usersCollection = database.collection('users');

        // Read
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find();
            const resutl = await cursor.toArray();
            res.send(resutl)
        })

        // Find one

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await usersCollection.findOne(query);
            res.send(result)
        })

        // Create
        app.post('/users', async (req, res) => {
            console.log('Data in the server', req.body);
            const newUser = req.body;
            const resutl = await usersCollection.insertOne(newUser);
            res.send(resutl);
        });


        // Update
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const user = req.body;

            const updatedDoc = {
                $set: {
                    name: user.name,
                    email: user.email
                }
            }

            const options = { upsert: true };

            console.log(user);
            const result = await usersCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })


        // Deleta
        app.delete('/users/:id', async (req, res) => {
            console.log(req.params);
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await usersCollection.deleteOne(query);
            res.send(result);
        })



        // // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();node
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('simple crud server running');
});

app.listen(port, () => {
    console.log(`Simple CRUD server running on port${port}`);
})

