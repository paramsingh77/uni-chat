const epxress = require("express");
const { chats } = require("./data/data.js");
const app = epxress();
const path = require("path");
const connectDB = require("./config/db.js");
const colors = require("colors");
const userRoutes = require("./routes/userRoutes.js");
const chatRoutes = require("./routes/chatRoutes.js");
const messageRoutes = require("./routes/messageRoutes.js");
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

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

//in this api we are trying to fetch the single chat id for a particular chat.
app.get("/api/chats/:id", (req, res) => {
	const singleChatId = chats.find((x) => x._id === req.params.id);
	console.log(singleChatId);
	res.send(singleChatId);
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
	console.log(`Server is running at ${PORT}`.yellow.bold);
});

const io = require("socket.io")(server, {
	pingTimeout: 60000,
	cors: {
		origin: "http://localhost:3000",
	},
});

io.on("connection", (socket) => {
	console.log(`connected to socket.io`);

	socket.on("setup", (userData) => {
		socket.join(userData._id);
		socket.emit("connected");
	});

	socket.on("joinChat", (room) => {
		socket.join(room);
		console.log("User joined room " + room);
	});


    socket.on('typing', (room) => socket.in(room).emit("typing"));
    socket.on('stopTyping', (room) => socket.in(room).emit("stopTyping"));

	socket.on("newMessage", (newMessageRecieved) => {
		var chat = newMessageRecieved.chat;

		if (!chat.users) {
			return console.log("chat.users not defined");
        }
        
        chat.users.forEach(user => {
            if (user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
	});
});
