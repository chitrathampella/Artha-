require("dotenv").config();  // Load .env again just in case
const mongoose = require("mongoose");
const colors = require("colors");

const connectDb = async () => {
    try {
        console.log("Connecting to:", process.env.MONGO_URL);  // Debugging line

        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`Server connected to MongoDB at ${mongoose.connection.host}`.bgCyan.white);
    } catch (error) {
        console.log(`Error: ${error.message}`.bgRed);
        process.exit(1);
    }
};

module.exports = connectDb;
