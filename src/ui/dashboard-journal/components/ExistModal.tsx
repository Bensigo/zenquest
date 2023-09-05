import React from 'react'


import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@chakra-ui/react";

interface ModalComponentProps {
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean
}

const ExistModal: React.FC<ModalComponentProps> = ({ onConfirm, onCancel, isOpen }) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm Navigation</ModalHeader>
        <ModalBody>
          Are you sure you want to leave this page?
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={onConfirm}>
            Confirm
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};



export default ExistModal