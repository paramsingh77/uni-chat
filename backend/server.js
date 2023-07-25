const epxress = require("express");
const { chats } = require("./data/data.js");
const app = epxress();
const path = require("path");
//getting port from environment variable

require("dotenv").config({
	path: path.resolve("config.env"),
});

//Creating API's

app.get("/", (req, res) => {
    res.send("API is running");
});

app.get('/api/chats', (req, res) => {
    
    res.send(chats);
})


//in this api we are trying to fetch the single chat id for a particular chat.
app.get('/api/chats/:id', (req, res) => {
    
    const singleChatId = chats.find((x) => x._id === req.params.id);
    console.log(singleChatId);
    res.send(singleChatId);
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`)
});
