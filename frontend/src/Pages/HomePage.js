import React,{useEffect} from 'react'
import { Box, Container, Text, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import Login from '../components/Authentication/Login';
import Signup from '../components/Authentication/Signup';
import { useHistory } from 'react-router-dom';


function HomePage(){

	const history = useHistory();
	useEffect(() => {
		const user= JSON.parse(localStorage.getItem("userInfo"));
		
		if (user) {
			history.push("/chats");
		}
	}, [history]);

  return (
		<Container maxW="xl" centerContent>
			<Box
				d="flex"
				justifyContent="center"
				textAlign="center"
				w="100%"
				m="40px 0 15px 0"
				borderRadius="lg"
				borderWidth="1px"
				p={3}
				bgColor="#f5f5f5"
			>
				<Text fontSize="3xl" fontFamily="Pacifico" color="black">
					Una-Chat
				</Text>
			</Box>
			<Box
				bg="whtie"
				w="100%"
				p={4}
				borderRadius="lg"
				color="black"
				borderWidth="1px"
			>
				<Tabs variant="soft-rounded" colorScheme="purple" color="green">
					<TabList marginBottom="1em">
						<Tab width="50%">Login </Tab>
						<Tab width="50%">Signup</Tab>
					</TabList>
					<TabPanels>
						<TabPanel>
							<Login />
						</TabPanel>
						<TabPanel>
							<Signup />
						</TabPanel>
					</TabPanels>
				</Tabs>
			</Box>
		</Container>
	);
}

export default HomePage
