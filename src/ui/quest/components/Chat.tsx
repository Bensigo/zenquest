/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { useChat } from "ai/react";
import React from "react";
import { type Message } from "@prisma/client";
import { ChatScrollAnchor } from "./chatScrollArchor";

const ChatUI = ({ msgs }: { msgs: Message[] }) => {
  const router = useRouter();
  const context = api.useContext();
  const [isSendBtnDisabled, setSendDisabled] = useState(false);
  const [input, setInput] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes in seconds



  const toast = useToast();
  const { data: activity } = api.activity.getActiveDailyActivity.useQuery({
    type: "Chat",
  });

  const { mutate } = api.activity.completeQuestActivity.useMutation();

  const { messages, append } = useChat({
    api: `/api/v2/chat`,
    body: {
      sessionId: msgs[0]?.sessionId,
    },
    initialMessages: msgs.map((msg) => ({
      role: msg.sender as any,
      content: msg.content,
      id: msgs[0]?.sessionId as string,
      createdAt: msg.createdAt,
    })),
    onResponse(res) {
      setSendDisabled(false)
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
    onFinish: () => {
      console.log("got here");
      setSendDisabled(false);
    },
  });

  const goBack = () => {
    router.back();
  };

  const handleSendMessage = async () => {
    const msg = input.trim()
    setSendDisabled(true);
    setInput("");
    await append({
      id: msgs[0]?.sessionId,
      content: msg,
      role: "user",
    })
  };

  const handleSessionExpired = () => {
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

    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => prevTime - 1);
    }, 1000);

    if (timeRemaining <= 0) {
      setSendDisabled(true);
      clearInterval(timer);
    }

    return () => {
      clearInterval(timer);
    };
  }, [timeRemaining]);



  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 30 ? "0" : ""}${secs}`;
  };


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
        <Box mt={4}>
          <IconButton
            icon={<BiArrowBack />}
            color={"sage.500"}
            aria-label={"back-btn"}
            onClick={() => void goBack()}
          />
        </Box>
        <Box
          py={4}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          {/* Timer */}
          <Text
            alignSelf="center"
            fontSize={"sm"}
            fontWeight={"bold"}
            color="red.300"
          >
            Time Remaining: {formatTime(timeRemaining)}
          </Text>
          <Button
            variant={"solid"}
            colorScheme="sage"
            onClick={handleSessionExpired}
          >
            Complete
          </Button>
        </Box>

        {/* Chat Messages */}
        <VStack
          flex="1"
          spacing={4}
          align="stretch"
          overflowY="auto"
          borderRadius="md"
          pt={20}
          maxH="calc(100vh - 250px)"
        >
           
          {messages.map((message, index) => (
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
                {message.role === "user" ? "You" : "Ada"}
              </Box>
              <Text> {message.content}</Text>
            </Box>
          ))}
          <ChatScrollAnchor trackVisibility={!isSendBtnDisabled} />
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
          value={input}
          flex="1"
          mr={2}
          variant={"filled"}
          color={useColorModeValue("gray.700", "ActiveCaption")}
          onChange={(e) => setInput(e.target.value)}
          placeholder={"Type your message..."}
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
          isDisabled={isSendBtnDisabled}
          borderRadius="md"
        />
      </Flex>
    </Box>
  );
};

export default React.memo(ChatUI);
