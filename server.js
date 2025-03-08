require("dotenv").config(); 

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");  
const connectDb = require("./config/connectDb");


console.log("Checking MONGO_URL:", process.env.MONGO_URL); 


connectDb();

const app = express();


app.use(morgan("dev")); 
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 


app.get("/", (req, res) => {
  res.send("API is running...");
});


app.use("/api/v1/users", require("./routes/userRoute"));  

app.use("/api/transactions", require("./routes/transactionRoutes"));


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.post("/api/transactions/add", async (req, res) => {
  console.log("Received request:", req.body);
  // Process and save transaction
});

