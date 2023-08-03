import { useDisclosure } from "@chakra-ui/hooks";
import {
	Box,
	Button,
	FormControl,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../../Context/ChatProvider";
import Chance from "chance";
import axios from "axios";
import UserListItem from "../../UserAvatar/UserListItem";
import UserBadgeItem from "../../UserAvatar/UserBadgeItem";
const GroupChatModal = ({ children }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [groupChatName, setGroupChatName] = useState();
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [search, setSearch] = useState("");
	const [searchResult, setSearchResult] = useState([]);
	const [loading, setLoading] = useState(false);

	const toast = useToast();

	const { user, chats, setChats } = ChatState();

	const chance = new Chance();

	// Generate an array of 5 random fantasy-style group names
	const groupNames = Array.from({ length: 5 }, () => chance.name());

	const handleSearch = async (query) => {
		setSearch(query);
		if (!query) {
			return;
		}
		try {
			setLoading(true);

			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};
			const { data } = await axios.get(`/api/user?search=${search}`, config);
			console.log(data);

			setLoading(false);
			setSearchResult(data);
		} catch (error) {
			toast({
				title: "Error Occured",
				description: "Failed to Load the Chats",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom-left",
			});
		}
	};

	const handleDelete = (delUser) => {
		setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
	};

	const handleGroup = (userToAdd) => {
		if (selectedUsers.includes(userToAdd)) {
			toast({
				title: "User Already Added",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: " top ",
			});
			return;
		}
		setSelectedUsers([...selectedUsers, userToAdd]);
	};

	const handleSubmit = async () => {
		if (!groupChatName || !selectedUsers) {
			toast({
				title: "Please Fill all the fields",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "top",
			});
			return;
		}

		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};

			const { data } = await axios.post(
				"/api/chat/group",
				{
					name: groupChatName,
					users: JSON.stringify(selectedUsers.map((u) => u._id)),
					pic: "https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fpic&psig=AOvVaw0deeB_d5mDuexy-qHbB9mA&ust=1690999443034000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCIin8_qFvIADFQAAAAAdAAAAABAE",
				},
				config
			);
            setChats([data, ...chats]);
            onClose();
            toast({
                title: 'New Group Chat Created',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position : 'bottom',
            })
        } catch (error) {
            toast({
                title: "Failed to Create the Chat!",
                description: error.response.data,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
        }
	};

	// useEffect(() => groupNames);
	return (
		<>
			<span onClick={onOpen}>{children}</span>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader
						fontSize={"25px"}
						display={"flex"}
						justifyContent={"center"}
					>
						Create Group Chat
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody display={"flex"} flexDir={"column"} alignItems={"center"}>
						<FormControl>
							<Input
								placeholder={`Set Group Name: eg: ${groupNames[0]}`}
								mb={3}
								onChange={(e) => setGroupChatName(e.target.value)}
							/>
						</FormControl>
						<FormControl>
							<Input
								placeholder="Add Your friends"
								mb={1}
								onChange={(e) => handleSearch(e.target.value)}
							/>
						</FormControl>
						<Box width={"100%"} display={"flex"} flexWrap={"wrap"}>
							{selectedUsers.map((u) => (
								<UserBadgeItem
									key={user._id}
									user={u}
									handleFunction={() => handleDelete(u)}
								/>
							))}
						</Box>

						{loading ? (
							<div>loading</div>
						) : (
							searchResult
								?.slice(0, 4)
								.map((user) => (
									<UserListItem
										key={user._id}
										user={user}
										handleFunction={() => handleGroup(user)}
									></UserListItem>
								))
						)}
					</ModalBody>

					<ModalFooter>
						<Button colorScheme="purple" mr={3} onClick={handleSubmit}>
							Create Chat
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default GroupChatModal;
