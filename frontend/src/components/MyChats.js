import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { Avatar, Box, Button, Image, MenuDivider, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getSender } from "../config/ChatLogics";
const MyChats = () => {
	const [loggedUser, setLoggedUser] = useState();
	const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

	const toast = useToast();
    {chats.map((chat)=> console.log('thi is ',chat.users[1].pic))}
	const fetchChats = async () => {
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};

			const { data } = await axios.get("/api/chat", config);
			console.log(data);
			setChats(data);
		} catch (error) {
			toast({
				title: "Error Occured",
				description: "Failed to load the chats",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom-left",
			});
		}
	};

	useEffect(() => {
		setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
		fetchChats();
	},[]);
	return (
		<Box
			display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
			flexDir="column"
			alignItems="center"
			p={3}
			bg={"white"}
			w={{ base: "100%", md: "31%" }}
			borderRadius={"lg"}
			borderWidth={"1px"}
		>
			<Box
				pb={3}
				px={3}
				fontSize={{ base: "28px", md: "30px" }}
				display={"flex"}
				w={"100%"}
				justifyContent={"space-between"}
				alignItems={"center"}
			>
				My Chats
				<Button
					display="flex"
					fontSize={{ base: "17px", md: "10px", lg: "10px" }}
					rightIcon={<AddIcon />}
				>
					New Group Chat
				</Button>
			</Box>
			<Box
				display={"flex"}
				flexDir={"column"}
				p={3}
				bg={"#F8F8F8"}
				w={"100%"}
				h={"100%"}
				borderRadius={"lg"}
				overflowY={"hidden"}
			>
				{chats ? (
					<Stack overflowY="scroll">
						{chats.map((chat) => (
							<Box
								onClick={() => setSelectedChat(chat)}
								cursor="pointer"
								bg={selectedChat === chat ? "#DDA0DD" : ""}
								color={selectedChat === chat ? "black" : "black"}
								px={3}
								py={2}
								borderRadius="lg"
								key={chat._id}
								display={"flex"}
								fontWeight={"500"}
								verticalAlign={"middle"}
							>
								<Avatar
									size="sm"
									cursor="pointer"
									name={chat.name}
									src={chat.users[1].pic} // Access the "pic" field here
									marginRight={"20px"}
								/>
								<Text>
									{!chat.isGroupChat
										? getSender(loggedUser, chat.users)
										: chat.chatName}
								</Text>
							</Box>
						))}
					</Stack>
				) : (
					<ChatLoading />
				)}
			</Box>
		</Box>
	);
};

export default MyChats;
