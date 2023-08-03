import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import {
	Box,
	FormControl,
	IconButton,
	Input,
	Spinner,
	Text,
	useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./Authentication/miscellaneous/ProfileModal";
import UpdateGroupChatModel from "./Authentication/miscellaneous/UpdateGroupChatModel";
import axios from "axios";
import "./styles.css";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import  Lottie from 'react-lottie';
import animationData from "../animations/typing.json";
const ENDPOINT = "http://localhost:2001";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(false);
	const [newMessage, setNewMessage] = useState("");
	const [socketConnected, setSocketConnected] = useState(false)
	const [typing, setTyping] = useState(false);
	const [isTyping, setIsTyping] = useState(false);
	const toast = useToast();
	const { user, selectedChat, setSelectedChat , notification , setNotification } = ChatState();


	const defaultOptions = {
		loop: true,
		autoplay: true,
		animationData: animationData,
		renderSettings: {
			preserveAspectRatio: "xMidYMid slice",
		},
	}

	const sendMessage = async (event) => {  
		if (event.key === "Enter" && newMessage) {
			socket.emit('stop typing',selectedChat._id);
			try {
				const config = {
					headers: {
						"Content-type": "application/json",
						Authorization: `Bearer ${user.token}`,
					},
				};

				const { data } = await axios.post(
					"/api/message",
					{
						content: newMessage,
						chatId: selectedChat._id,
					},
					config
				);

				console.log(`this ok`, data);
				setNewMessage("");
				socket.emit("newMessage", data);
				setMessages([...messages, data]);
			} catch (error) {
				toast({
					title: "Error Ocurred!",
					description: "Failed to send the the Message",
					status: "error",
					duration: 5000,
					isClosable: true,
					position: "bottom",
				});
			}
		}
	};


	const fetchMessages = async () => {
		if (!selectedChat) return;
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};
			setLoading(true);
			const { data } = await axios.get(
				`/api/message/${selectedChat._id}`,
				config
			);
			console.log("here are logged messages", messages);
			setMessages(data);
			setLoading(false);
			socket.emit("joinChat", selectedChat._id);

		} catch (error) {
			toast({
				title: "Error Occured",
				description: "Failed to load the Messages",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
		}
	};

		useEffect(() => {
			socket = io(ENDPOINT);
			socket.emit("setup", user);
			socket.on("connected", () => setSocketConnected(true));
			socket.on('typing', () => setIsTyping(true));
			socket.on('stop typing', () => setIsTyping(false));
		}, []);

	useEffect(() => {
		fetchMessages();
		selectedChatCompare = selectedChat;
	}, [selectedChat]);


	useEffect(() => {
		socket.on("message recieved", (newMessageRecieved) => {
			if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
				//give notification
				if (!notification.includes(newMessageRecieved)) {
					setNotification([newMessageRecieved, ...notification]);
					setFetchAgain(!fetchAgain);
				}
			} else {
				setMessages([...messages, newMessageRecieved]);
			}
		});
	})
	

const typingHandler = (e) => {
	setNewMessage(e.target.value);

	if (!socketConnected) return;

	if (!typing) {
		setTyping(true);
		socket.emit("typing", selectedChat._id);
	}
	let lastTypingTime = new Date().getTime();
	var timerLength = 3000;
	setTimeout(() => {
		var timeNow = new Date().getTime();
		var timeDiff = timeNow - lastTypingTime;
		console.log(timeDiff);
		if (timeDiff >= timerLength && typing) {
			socket.emit("stop typing", selectedChat._id);
			setTyping(false);
			console.log('work done');
		}
	}, timerLength);
};


	

	return (
		<>
			{selectedChat ? (
				<>
					<Text
						fontSize={{ base: "28px", md: "30px" }}
						pb={3}
						px={2}
						w={"100%"}
						display={"flex"}
						justifyContent={{ base: "space-between" }}
						alignItems={"center"}
					>
						<IconButton
							display={{ base: "flex", md: "none" }}
							icon={<ArrowBackIcon />}
							onClick={() => setSelectedChat("")}
						/>
						{!selectedChat.isGroupChat ? (
							<>
								{getSender(user, selectedChat.users)}
								<ProfileModal user={getSenderFull(user, selectedChat.users)} />
							</>
						) : (
							<>
								{selectedChat.chatName.toUpperCase()}
								<UpdateGroupChatModel
									fetchAgain={fetchAgain}
									setFetchAgain={setFetchAgain}
									fetchMessages={fetchMessages}
								/>
							</>
						)}
					</Text>
					<Box
						display={"flex"}
						flexDir={"column"}
						justifyContent={"flex-end"}
						p={3}
						bg={"#EEEEEE"}
						w={"100%"}
						h={"100%"}
						borderRadius={"lg"}
						overflowY={"hidden"}
					>
						{loading ? (
							<Spinner
								size="xl"
								w={20}
								h={20}
								alignSelf="center"
								margin="auto"
							/>
						) : (
							<div className="messages">
								<ScrollableChat messages={messages} />
							</div>
						)}

						<FormControl onKeyDown={sendMessage} isRequired mt={3}>
							{isTyping ? (
								<div>
									<Lottie
										options={defaultOptions}
										width={70}
										style={{ marginBottom: 15, marginLeft: 0 }}
									/>
								</div>
							) : (
								<></>
							)}
							<Input
								variant="filled"
								bg={"#E0E0E0"}
								placeholder="Type Your Message"
								value={newMessage}
								onChange={typingHandler}
								fontSize={"13px"}
							/>
						</FormControl>
					</Box>
				</>
			) : (
				<Box
					display="flex"
					alignItems="center"
					justifyContent={"center"}
					h={"100%"}
				>
					<Text fontSize={"3xl"} pb={3}>
						Click On the Friend to Start Chatting
					</Text>
				</Box>
			)}
		</>
	);
};

export default SingleChat;
