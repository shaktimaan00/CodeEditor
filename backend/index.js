const express = require('express');
const app = express();
const mongoose = require('mongoose');

// Define a schema for your data
const dataSchema = new mongoose.Schema({
    username : String,
    language : String,
    stdin : String,
    sourceCode : String,
    codeStatus: String,
    memory: String,
    time: String,
    submittedOn: String
});

// Create a model based on the schema
const Data = mongoose.model('Data', dataSchema);

mongoose.connect('mongodb+srv://anumishra0901:abcd123@cluster0.sesy1tl.mongodb.net/')
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("Error connecting to MongoDB:", err));

const conn = mongoose.connection;
conn.once('open', () => {
    console.log("Connected to MongoDB");
});

app.use(express.json()); // Middleware to parse JSON body

const cors = require('cors');
app.use(cors());

// POST request to add data to the database
app.post('/data', async (req, res) => {
    try {
        const { username, language, stdin, sourceCode, codeStatus, memory, time, submittedOn } = req.body;
        const newData = new Data({ 
            username, 
            language,
            stdin,
            sourceCode,
            codeStatus,
            memory,
            time,
            submittedOn
        });

        await newData.save();
        res.status(201).json({ message: "Data saved successfully", data: newData });
    } catch (err) {
        console.error("Error saving data:", err);
        res.status(500).json({ error: "Failed to save data" });
    }
});

// GET request to retrieve all data from the database
app.get('/data', async (req, res) => {
    try {
        const allData = await Data.find();
        res.status(200).json(allData);
    } catch (err) {
        console.error("Error retrieving data:", err);
        res.status(500).json({ error: "Failed to retrieve data" });
    }
});

app.get('/', async (req, res) => {
    try {
        res.send("Welcome to development server");
    } catch (err) {
        console.error("Error handling GET request:", err);
        res.status(500).send("Internal Server Error");
    }
});

// DELETE request to delete all data from the database
app.delete('/data', async (req, res) => {
    try {
        await Data.deleteMany(); // Delete all documents in the Data collection
        res.status(200).json({ message: "All data deleted successfully" });
    } catch (err) {
        console.error("Error deleting data:", err);
        res.status(500).json({ error: "Failed to delete data" });
    }
});


app.listen(3001, () => console.log("Server started on port 3001"));
