import React, { useState } from "react";
import {
	VStack,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
	Button,
	useToast,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import axios from "axios";
const Login = () => {

	
	const [show, setShow] = useState(false);
	const [email, setEmail] = useState();
	const [password, setPassword] = useState();
	const [loading, setLoading] = useState(false);
	const handleClick = () => setShow(!show);
	const toast = useToast();
	const history = useHistory();



	const submitHandler = async () => {
		if (!email || !password) {
			toast({
				title: "Please fill all fields",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "absolute",
			});
			setLoading(false);
			return;
		}

		try {
			const config = {
				headers: {
					"Content-type" : "application/json",
				},
			}

			const { data } = await axios.post(
				"/api/user/login", { email, password }, config
			);
			
			toast({
				title: "Login Successful",
				status: "success",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			localStorage.setItem("userInfo", JSON.stringify(data));
			setLoading(false);
			history.push("/chats");
		} catch (error) {
			toast({
				title: "Error Occured",
				description: error.response.data.message,
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			setLoading(false);
		}
	};

	return (
		<div>
			<VStack spacing="5px" color="black">

				<FormControl id="email" isRequired>
					<FormLabel>Email</FormLabel>
					<Input
						placeholder="singh1@gmail.com"
						onChange={(e) => {
							setEmail(e.target.value);
						}}
						value={email}
					></Input>
				</FormControl>
				<FormControl id="password" isRequired>
					<FormLabel>Password</FormLabel>
					<InputGroup>
						<Input
							type={show ? "text" : "password"}
							placeholder="Enter Your Password"
							value={password}
							onChange={(e) => {
								setPassword(e.target.value);
							}}
						/>
						<InputRightElement width="4.5rem">
							<Button h="1.75rem" size="sm" onClick={handleClick}>
								{show ? "Hide" : "show"}
							</Button>
						</InputRightElement>
					</InputGroup>
				</FormControl>

				<Button
					colorScheme="purple"
					width="100%"
					style={{ marginTop: 15 }}
					onClick={submitHandler}
					isLoading={loading}
				>
					Sign In
				</Button>
				<Button
					colorScheme="purple"
					width="100%"
					style={{ marginTop: 15 }}
					onClick={() => {
						setEmail("guest@example.com");
						setPassword("123456");
					}}
					isLoading={loading}
				>
					Get User Credintial
				</Button>
			</VStack>
		</div>
	);
};

export default Login;
