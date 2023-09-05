import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, HStack, Center } from '@chakra-ui/react';



function MoodModal({ isOpen, onMoodSelect, onClose }: { onClose: () => void ,isOpen: boolean, onMoodSelect: (mood: number) => Promise<void> }) {
  const handleSelectMood = async (val: number) => {
    await onMoodSelect(val)
  }
  return (
    <>
 
      <Modal isCentered  isOpen={isOpen}  onClose={onClose}>
        <ModalOverlay
        bg='none'
        backdropFilter='auto'
        backdropInvert='80%'
        backdropBlur='2px'
        />
        <ModalContent>
        {/* <ModalCloseButton color={'primary'} /> */}
          <ModalHeader color="primary" mt={6}>On a scale of 1-5 how do you feel today?</ModalHeader>
         
          <ModalBody pb={3}>
            <Center>
            <HStack spacing={2}>
              {[1, 2, 3, 4, 5].map((value) => (
                <Button color="primary" key={value} onClick={() => void handleSelectMood(value)}>
                  {value}
                </Button>
              ))}
            </HStack>
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default MoodModal;
