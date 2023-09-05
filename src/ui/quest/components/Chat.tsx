import { Box, Textarea, IconButton, VStack, Text, Flex, Spinner, Button, useToast } from "@chakra-ui/react";
import { BiSend } from "react-icons/bi";
import { useEffect, useState } from "react";
import { type Message } from "@prisma/client";
import { useRouter } from "next/router";
import { QUEST_NEXT_STEP } from "@/ui/space-affrimations/AffirmationWrapper";
import { api } from "@/utils/api";

const ChatUI = ({
  msgs,
  onSendMsg,
  user,
  isLoading,
}: {
  msgs: Message[];
  onSendMsg: (msg: string) => void;
  user: any;
  isLoading: boolean;
}) => {
  const router = useRouter();
  const context = api.useContext()
  const [messageInput, setMessageInput] = useState<string>('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [isAdaTyping, setIsAdaTyping] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds

  const toast = useToast();
  const { data: activity } = api.activity.getActiveDailyActivity.useQuery({ type: 'Chat'})
  const { isLoading: isCompleteQuestActivityLoading, mutate } = api.activity.completeQuestActivity.useMutation()

  const handleSendMessage = async () => {
    if (messageInput.trim() !== '') {
      setMessageInput('');
      setIsInputDisabled(true); // Disable input while sending
      setIsAdaTyping(true); // Ada is typing
      onSendMsg(messageInput);
      setIsAdaTyping(false); // Ada finished typing
      setIsInputDisabled(false); // Enable input
    }
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
      display="flex"
      flexDirection="column"
    >
      <Box py={4} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>

     
      {/* Timer */}
      <Text alignSelf="center" my={2} color="red.400">
        Time Remaining: {formatTime(timeRemaining)}
      </Text>
      <Button  variant={'solid'} colorScheme="sage" onClick={handleSessionExpired}>Complete</Button>
      </Box>

      {/* Chat Messages */}
      <VStack
        flex="1"
        p={4}
        spacing={4}
        align="stretch"
        overflowY="auto"
        bgGradient="linear(to-b, sage.50, white)"
        boxShadow="md"
        borderRadius="md"
        px={6}
        py={20}
        maxH="calc(100vh - 120px)"
      >
        {msgs.map((message, index) => (
          <Box
            key={index}
            bg="white"
            p={4}
            borderRadius="md"
            boxShadow="md"
            _odd={{ bg: "gray.100" }}
          >
            <Box  fontSize={'sm'} as='span'>{message.sender === 'user'? user.name : 'Ada'}</Box>
             <Text> {message.content}</Text>
          </Box>
        ))}
        {/* Ada is Typing */}
        {isAdaTyping && (
          <Box  bg="white" p={4} borderRadius="md" boxShadow="md" _odd={{ bg: "gray.100" }}>
            <Text fontSize={'sm'} as='span'>Ada is typing...</Text>
            <Spinner size="xs" ml={2} />
          </Box>
        )}
      </VStack>

      {/* Chat Input and Send Button */}
      <Flex
        my={6}
        p={4}
        bg="white"
        position="absolute"
        bottom="0"
        alignItems="center"
        left="0"
        width="100%"
        boxShadow="md"
        borderTopWidth="1px"
      >
        <Textarea
          value={messageInput}
          flex="1"
          mr={2}
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
          colorScheme="blue"
          aria-label="Send"
          onClick={() => void handleSendMessage()}
          isDisabled={isInputDisabled}
          borderRadius="md"
        />
      </Flex>

      {/* Session Expired Button */}
      {isInputDisabled && (
        <Button
          position="absolute"
          bottom="0"
          isLoading={isCompleteQuestActivityLoading}
          left="50%"
          transform="translateX(-50%)"
          mb={4}
          colorScheme="sage"
          onClick={handleSessionExpired}
        >
          Complete
        </Button>
      )}
    </Box>
  );
};


export default ChatUI;
