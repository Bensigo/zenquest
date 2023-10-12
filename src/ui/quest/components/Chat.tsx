/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Textarea,
  IconButton,
  VStack,
  Text,
  Flex,
  Button,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { BiArrowBack, BiSend } from "react-icons/bi";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { useChat } from "ai/react";
import { ChatScrollAnchor } from "./chatScrollArchor";
import { useEnterSubmit } from "@/shared-hooks/useEnterSubmit";
import { type Message } from "@prisma/client";



interface BackButtonProps {
  onClick: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick }) => (
  <IconButton
    icon={<BiArrowBack />}
    color={"sage.500"}
    aria-label={"back-btn"}
    onClick={onClick}
  />
);

interface CompleteButtonProps {
  onClick: () => void;
}

const CompleteButton: React.FC<CompleteButtonProps> = ({ onClick }) => (
  <Button variant={"solid"} colorScheme="sage" onClick={onClick}>
    Complete
  </Button>
);

interface ChatMessageProps {
  message: any;
  index: number;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, index }) => (
  <Box
    key={index}
    bg="purple.500"
    color="white"
    p={4}
    borderRadius="md"
    boxShadow="xs"
    _odd={{ bg: "gray.600", color: "white" }}
  >
    <Box fontSize={"sm"} as="span">
      {message.sender === "user" ? "You" : "Ada"}
    </Box>
    <Text>{message.content}</Text>
  </Box>
);

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => Promise<void>;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ value, onChange, onSubmit, isLoading }) => {

  const { formRef, onKeyDown } = useEnterSubmit();
 return  <form
    ref={formRef}
    onSubmit={(e) => {
      e.preventDefault();
      void onSubmit();
    }}
  >
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
        value={value}
        flex="1"
        tabIndex={0}
        rows={1}
        onKeyDown={onKeyDown}
        mr={2}
        variant={"filled"}
        color={useColorModeValue("gray.700", "ActiveCaption")}
        onChange={(e) => onChange(e.target.value)}
        placeholder={"Type your message..."}
        resize="none"
        borderRadius="md"
        _disabled={{ opacity: 0.8 }}
      />
      <IconButton
        icon={<BiSend />}
        type="submit"
        colorScheme="sage"
        aria-label="Send"
        isDisabled={isLoading}
        borderRadius="md"
      />
    </Flex>
  </form>
};

interface ChatUIProps {
  msgs: Message[];
}

const ChatUI: React.FC<ChatUIProps> = ({ msgs }) => {
  const router = useRouter();
  const context = api.useContext();
 
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const toast = useToast();
  const { data: activity } = api.activity.getActiveDailyActivity.useQuery({
    type: "Chat",
  });

  const { mutate } = api.activity.completeQuestActivity.useMutation();
  const [isTyping, setIsTyping] = useState(false)

  const { messages, append, isLoading, input, setInput} = useChat({
    api: `/api/v2/chat`,
    body: {
      sessionId: msgs[0]?.sessionId,
    },
    initialMessages: msgs.map((msg) => ({
      role: msg.sender as "function" | "system" | "user" | "assistant",
      content: msg.content,
      createdAt: msg.createdAt,
      id: msgs[0]?.sessionId as string,
    })),
    onResponse(res) {
      setIsTyping(true)
      if (res.status === 401) {
        toast({
          description: res.statusText,
          isClosable: true,
          duration: 3000,
          status: "error",
        });
      }
    },
    onError(err) {
      toast({
        description: err.message,
        isClosable: true,
        duration: 3000,
        status: "error",
      });
    },
    onFinish(){
      setIsTyping(false)
    }
  });

  const goBack = () => {
    router.back();
  };

  const handleSendMessage = async () => {
    const msg = input.trim();
    setInput("");
    await append({
      id: msgs[0]?.sessionId as string,
      content: msg,
      createdAt: new Date(),
      role: "user"
    });
  };

  const handleCompleteSession = () => {
    if (activity) {
      const sessionId = msgs[0]?.sessionId;
      mutate(
        {
          id: activity?.id,
          chatSessionId: sessionId,
        },
        {
          onSuccess: () => {
            const questId = router.query.id as string;
            const refetch = async () =>
              await context.activity.getActiveStep.reset({ id: questId });
            const toQuest = async () =>
              await router.push("/space/quest/" + questId);
            void refetch();
            void toQuest();
          },
          onError: (err) => {
            toast({
              description: err.message,
              isClosable: true,
              duration: 3000,
              status: "error",
            });
          },
        }
      );
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <Box
      width="100%"
      position="relative"
      h="100vh"
      px={{ md: 10, base: "none" }}
      display="flex"
      flexDirection="column"
      bg="inherit"
    >
      <Box px={3}>
        <Box
          mt={3}
          py={4}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <BackButton onClick={() => void goBack()} />
          <CompleteButton onClick={handleCompleteSession} />
        </Box>

    
       
      </Box>

   
          {/* Chat Messages */}
          <VStack
          flex="1"
          spacing={4}
          align="stretch"
          overflowY="auto"
          borderRadius="md"
          pt={10}
          maxH="calc(100vh - 170px)"
        >
          {messages.map((message, index) => (
            <ChatMessage message={message} index={index} key={index} />
          ))}
            <ChatScrollAnchor trackVisibility={ isTyping} />
        </VStack>
       
      

      {/* Chat Input and Send Button */}
      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={handleSendMessage}
        isLoading={isLoading}
      />
     
    </Box>
  );
};

export default React.memo(ChatUI);
