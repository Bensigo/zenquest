import { api } from "@/utils/api";
import {
  Box,
  Skeleton,
  Text,
  Card,
  Button,
  Image,
  useToast,
  IconButton,
  Stack,
  Heading,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Quest } from "./components/Quest";
import differenceInDays from "date-fns/differenceInDays";
import { QUEST_NEXT_STEP } from "../space-affrimations/AffirmationWrapper";
import { useRouter } from "next/router";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import { BiArrowBack } from "react-icons/bi";

export const QuestWrapper = () => {
  const context = api.useContext();
  const router = useRouter();
  const toast = useToast();
  const id = router.query?.id as string;
  const { data: quest, isFetched, isLoading } = api.quest.get.useQuery({ id });
  const { data: activeStep } = api.activity.getActiveStep.useQuery({ id });

  const { mutate: closeQuest, isLoading: isClosing } =
    api.quest.closeQuest.useMutation();
  const [startDate, setStartDate] = useState<Date>();

  const today = new Date();

  useEffect(() => {
    if (quest) {
      setStartDate(quest.createdAt);
    }
  }, [quest, startDate]);

  const getNumberOfDays = (start: Date) =>
    differenceInCalendarDays(today, start);
  const totalDays = (start: Date, end: Date) => differenceInDays(end, start);
  const canCompleteQuest = activeStep?.count === 5;

  const handleCloseQuest = () => {
    // close current active quest
    if (quest) {
      closeQuest(
        { id: quest.id },
        {
          onSuccess: () => {
            const refetch = async () => await context.quest.get.invalidate();
            void refetch();
            void (async () => await router.push(`/space/quest`))()
          },
          onError: (err) => {
            toast({
              description: err.message,
              status: "error",
              duration: 9000,
              isClosable: true,
            });
          },
        }
      );
      localStorage.removeItem(QUEST_NEXT_STEP);
    }
  };

  const goBack = () => {
    router.back()
  }

  return (
    <>
      <Box height={"100%"} py={3} mb={5}>
        <Skeleton isLoaded={isFetched} height={'70vh'}>
          <Box py={4}>
            <Box mt={4} mb={3}>
              <IconButton
                icon={<BiArrowBack />}
                size={"md"}
                color={"sage.500"}
                aria-label={"back-btn"}
                onClick={goBack}
              ></IconButton>
            </Box>
            <Text color="sage.500" fontWeight={"black"} fontSize={"2xl"}>
              Quest for the day
            </Text>
            {quest && (
              <Text color={"gray.600"} fontWeight={"semibold"} fontSize={"md"}>
                Day {getNumberOfDays(quest.createdAt) + 1} of{" "}
                {totalDays(quest.createdAt, quest.endDate)}. Hurray 🎉 🎉
              </Text>
            )}
          </Box>
          {quest?.isActive && activeStep && activeStep.count < 5 && (
            <Box display={"flex"} my={4} width="100%">
              <Button
                isDisabled={!canCompleteQuest}
                isLoading={isClosing}
                onClick={handleCloseQuest}
                colorScheme="sage"
              >
                Complete Current Quest
              </Button>
            </Box>
          )}
          {  quest && activeStep && activeStep.count === 5 && <DailyQuestCompleted />}
          {  quest && activeStep && activeStep.count < 5 &&
            <Quest
              id={id}
              step={activeStep?.count === 5 ? 0 : activeStep.count}
            />
           }
        </Skeleton>
      </Box>
    </>
  );
};



const DailyQuestCompleted = () => {
  return (
    <Card
      py={8}
      px={4}
      maxW={{ base: "sm", md: "lg" }}
      direction={{ md: "row", base: "column-reverse" }}
      marginBottom={{ md: 4, base: "80px" }}
      mt={4}
      justifySelf={{ base: "center" }}
     
    >
     <Box flex={1}>
     <Stack>
          
          <Heading size="md" color={"sage.500"}>
              Finished for the day 🎉
            </Heading>
            <Text py="1" color={"sage.400"}>
            Well done! Another day, another triumph.
             Take a moment to relish in your achievements.
            {/* eslint-disable-next-line react/no-unescaped-entities */}
             You're making progress, one day at a time!
            </Text>
      </Stack>
     </Box>
      
      <Box
        display="flex"
        maxWidth={{ base: "100%", sm: "150px" }}
        p={5}
        justifySelf={{ base: "center", sm: "flex-start" }}
        maxH={{ base: '120px', md: 'auto'}}
      >
        <Image
          w="100%"
          h="auto"
          maxWidth="100%"
          borderRadius="sm"
          objectFit={{ base: "contain" }}
          alt="complete-task" src="/space/finish.svg"
        />
      </Box>
      </Card>
  )
}