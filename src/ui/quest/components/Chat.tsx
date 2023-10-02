import { Box, Textarea, IconButton, VStack, Text, Flex, Spinner, Button, useToast, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { BiArrowBack, BiSend } from "react-icons/bi";
import { useEffect, useRef, useState } from "react";
import { type Message } from "@prisma/client";
import { useRouter } from "next/router";
import { api } from "@/utils/api";

const ChatUI = ({
  msgs,
  onSendMsg,
  user,
  isLoading,
}: {
  msgs: Message[];
  onSendMsg: (msg: string) => void;
  user?: { [key: string]: any };
  isLoading: boolean;
}) => {
  const router = useRouter();
  // Create a ref for the chat container
  const chatContainerRef = useRef<any>(null);
  const context = api.useContext()
  const [messageInput, setMessageInput] = useState<string>('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds

  const toast = useToast();
  const { data: activity } = api.activity.getActiveDailyActivity.useQuery({ type: 'Chat'})
  const {  mutate } = api.activity.completeQuestActivity.useMutation()


  const goBack =  () => {
    router.back()
  }
  const handleSendMessage =  () => {
    if (messageInput.trim() !== '') {
      setMessageInput('');
      setIsInputDisabled(true); // Disable input while sending
      onSendMsg(messageInput);
      setIsInputDisabled(false); // Enable input
    }

      // Scroll to the bottom of the chat container
     
  };

  const handleSessionExpired = () => {
    if (activity){
      const sessionId = msgs[0]?.sessionId;
      mutate({
        id: activity?.id,
        chatSessionId: sessionId,
      }, {
        onSuccess: () => {
          const questId = router.query.id as string;
          const refetch = async () => await context.activity.getActiveStep.reset({ id: questId })
          const toQuest = async () => await router.push('/space/quest/' + questId);
          void refetch()
          void toQuest()
        },
        onError: (err) => {
            toast({
              description: err.message,
              isClosable: true,
              duration: 3000,
              status: 'error'
            })
        }
      })
    }
  
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }

  }, [msgs])

  useEffect(() => {
    if (isLoading) {
      // If loading, disable input
      setIsInputDisabled(true);
    
    } else {
      setIsInputDisabled(false);
     
    }

    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => prevTime - 1);
    }, 1000);

    if (timeRemaining <= 0) {
      setIsInputDisabled(true);
      clearInterval(timer);
    }

    return () => {
      clearInterval(timer);
    };
  }, [timeRemaining, isLoading]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <Box
      width="100%"
      position="relative"
      h="100vh"
      px={{md: 10, base: 'none'}}
      display="flex"
      flexDirection="column"
     bg="inherit"

    >
      <Box px={3}>
      <Box mt={4}   >
      <IconButton  icon={<BiArrowBack />} color={'sage.500'} aria-label={"back-btn"} onClick={() => void goBack()}/>
      </Box>
      <Box  py={4} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>

     
      {/* Timer */}
      <Text alignSelf="center" fontSize={'sm'}  fontWeight={'bold'} color="red.300">
        Time Remaining: {formatTime(timeRemaining)}
      </Text>
      <Button  variant={'solid'} colorScheme="sage" onClick={handleSessionExpired}>Complete</Button>
      </Box>
      

      {/* Chat Messages */}
      <VStack
        flex="1"
        spacing={4}
        align="stretch"
        overflowY="auto"
  
        borderRadius="md"
        
        py={20}
        maxH="calc(100vh - 250px)"
        ref={chatContainerRef}
      >
        {msgs.map((message, index) => (
          <Box
            key={index}
            bg="purple.500"
            color="white"
            p={4}
            borderRadius="md"
            boxShadow="xs"
            _odd={{ bg: "gray.600", color: 'white' }}
          >
             <Box  fontSize={'sm'} as='span'>{message.sender === 'user'? 'You': 'Ada'}</Box>
             <Text> {message.content}</Text>
          </Box>
        ))}
        {/* Ada is Typing */}
        {isLoading && (
          <Box  bg="inherit" p={4} borderRadius="md" boxShadow="xs" _odd={{ bg: "gray.600", color: 'white' }}>
            <Text fontSize={'sm'} as='span'>Ada is typing...</Text>
          </Box>
        )}
      </VStack>
      </Box>

      {/* Chat Input and Send Button */}
      <Flex
        p={4}
        bg={useColorModeValue("whiteAlpha.400", "inherit")}
        bottom="0"
        alignItems="center"
        width="100%"
        borderWidth="1px"
        position="fixed" 
        left="0" 
        right="0"
      >
        <Textarea
          value={messageInput}
          flex="1"
          mr={2}
          variant={'filled'}
          _focus={{ border: 'none'}}
          color="gray.700"
          disabled={isInputDisabled}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder={
            isInputDisabled ? 'Chat disabled' : 'Type your message...'
          }
          rows={2}
          resize="none"
          borderRadius="md"
          _disabled={{ opacity: 0.8 }}
        />
        <IconButton
          icon={<BiSend />}
          colorScheme="sage"
          aria-label="Send"
          onClick={() => void handleSendMessage()}
          isDisabled={isInputDisabled}
          borderRadius="md"
        />
      </Flex>
    </Box>
  );
};


export default ChatUI;
