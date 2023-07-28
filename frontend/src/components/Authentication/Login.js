
import React, { useState } from "react";
import {
	VStack,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
	Button,
	Show,
} from "@chakra-ui/react";
const Login = () => {
            const [show, setShow] = useState(false);
			const [name, setName] = useState();
			const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const handleClick = () => setShow(!show);
    const submitHandler = () => { };
		

  return (
		<div>
			<VStack spacing="5px" color="black">
				<FormControl id="first-name" isRequired>
					<FormLabel>Name</FormLabel>
					<Input
						placeholder="Enter Your Name"
						onChange={(e) => {
							setName(e.target.value);
						}}
					></Input>
				</FormControl>
				<FormControl id="email" isRequired>
					<FormLabel>Email</FormLabel>
					<Input
						placeholder="singh1@gmail.com"
						onChange={(e) => {
							setEmail(e.target.value);
						}}
					></Input>
				</FormControl>
				<FormControl id="password" isRequired>
					<FormLabel>Password</FormLabel>
					<InputGroup>
						<Input
							type={show ? "text" : "password"}
							placeholder="Enter Your Password"
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
				>
					Sign up
				</Button>
			</VStack>
		</div>
	);
}

export default Login
