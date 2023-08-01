import React from "react";
import {Box} from '@chakra-ui/react'
import { ChatState } from "../Context/ChatProvider";
import SideDrawer from "../components/Authentication/miscellaneous/SideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";


const ChatPage = () => {
	
	const { user } = ChatState()


	return (
		<div style={{ width: "100%" }}>
			{user && <SideDrawer />}
			<Box
				display="flex"
				justifyContent="space-between"
				w='100%'
			padding='50px 100px'>
					{user && <MyChats />}
					{user && <ChatBox />}
			</Box>
		</div>);
};

export default ChatPage;
