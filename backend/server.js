const epxress = require("express");
const { chats } = require("./data/data.js");
const app = epxress();
const path = require("path");
const connectDB = require("./config/db.js");
const colors = require("colors");
const userRoutes = require("./routes/userRoutes.js");
const chatRoutes = require("./routes/chatRoutes.js");
const { notFound, errorHandler } = require("./middleware/errorMiddleware.js");
//getting port from environment variable

require("dotenv").config({
	path: path.resolve("config.env"),
});

//Creating API's

connectDB();

app.use(epxress.json());

app.get("/", (req, res) => {
    res.send("API is running");
});

app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes);

//in this api we are trying to fetch the single chat id for a particular chat.
app.get('/api/chats/:id', (req, res) => {
    
    const singleChatId = chats.find((x) => x._id === req.params.id);
    console.log(singleChatId);
    res.send(singleChatId);
})

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`.yellow.bold)
});
