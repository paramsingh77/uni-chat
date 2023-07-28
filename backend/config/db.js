const { cyan } = require("colors");
const mongoose = require("mongoose");
require("dotenv").config("/config.env")
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
					useNewUrlParser: true,
					useUnifiedTopology: true,
				});
        console.log(`MongoDB Connected : ${conn.connection.host} `);
    } catch (error) {
        console.log(`Error: ${error.message}` .red.bold);
        process.exit();
    }
}

module.exports = connectDB;