import { ViewIcon } from "@chakra-ui/icons";
import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure ,Text} from "@chakra-ui/react";
import { color } from "framer-motion";
import React from "react";

const ProfileModal = ({ user, children }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

  return (
		<>
			{children ? (
				<span onClick={onOpen}>{children}</span>
			) : (
				<IconButton
					display={{ base: "flex" }}
					icon={<ViewIcon />}
					onClick={onOpen}
				/>
			)}

			<Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay />
				<ModalContent h="410px">
					<ModalHeader
						fontSize="40px"
						display="flex"
						justifyContent="center"
						fontFamily="Garfist"
						fontWeight={200}
						textTransform={"lowercase"}
					>
						{user.name}
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody display="flex" flexDirection="column"
            alignItems="center"
          justifyContent="space-between">
						<Image
							borderRadius="full"
							boxSize="150px"
							src={user.pic}
						  alt={user.name}
						  objectFit={'cover'}
						/>
						<Text
              fontSize={{ base: "28px", md: "20px" }}
              justifyContent="center"
							fontFamily="Garfist">
                Email: {user.email}
						</Text>
					</ModalBody>

					<ModalFooter>
						<Button
							backgroundColor="black"
							color="white"
							mr={3}
							onClick={onClose}
							_hover={{ backgroundColor: "purple", color: "white" }}
						>
							Close
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default ProfileModal;
