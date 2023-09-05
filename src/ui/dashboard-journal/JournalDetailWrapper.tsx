/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {  api } from "@/utils/api";
import {
  Box,
  Card,
  IconButton,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  List,
  ListItem,
  Skeleton,
} from "@chakra-ui/react";
import { type Therapy } from "@prisma/client";
import { useRouter } from "next/router";
import React from "react";
import { BiArrowBack, BiTrash } from "react-icons/bi";
import PlainJournalDetail from "./components/PlainJournalDetail";





const getMoodScoreColor = (score: number) => {
  score = score * 10
  if (score <= 4) {
    return "red.500";
  } else if (score <= 7) {
    return "yellow.600";
  } else {
    return "green.500";
  }
};

const ListItemComponent = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
  sentimentScore: number;
}) => {
  return (
    <ListItem borderBottom={"1"} py={2} borderBottomWidth={1}>
      <Box mb={2}>
        <Text fontWeight="bold">{question}</Text>
      </Box>
      <Text>{answer}</Text>
    </ListItem>
  );
};

export default function JournalDetailWrapper({ id }: { id: string }) {
  const router = useRouter();
  const { data, isLoading } = api.journal.getJournal.useQuery({ id });
  const { mutate: deleteDaily, isLoading: isDeleteing } =
    api.journal.deleteJournal.useMutation();



  if (!data && !isLoading) {
    return router.push("/404");
  }

  const goBack = () => {
    return router.back();
  };

  const handleDeleteDaily = async (id: string) => {
    deleteDaily({ id });
    await router.push("/space/journal");
  };

  if (data?.canEdit){
    return (
      <PlainJournalDetail journal={data} />
    )
  }

  const { therapy } = data || {};


  
  return (
    <>
      <Skeleton isLoaded={!isLoading}>
      {data && <Box display={"flex"} justifyContent={"space-between"} mt={5}>
        <IconButton
          size={"lg"}
          aria-label="go-back"
          icon={<BiArrowBack />}
          onClick={goBack}
        ></IconButton>
        <IconButton
          icon={<BiTrash />}
          onClick={() => void  handleDeleteDaily(data.id)}
          aria-label="delete-daily"
          color="red.400"
          size={"lg"}
          isLoading={isDeleteing}
        />
      </Box>}

      <Box mt={5}>
        <Card shadow={"sm"} px={3} py={2} maxW={{ base: 150, md: 250 }}>
          {data && data.userMood && (
            <Stat>
              <StatLabel>Mood Score</StatLabel>
              <StatNumber color={getMoodScoreColor(data?.userMood)}>
                {data?.userMood * 10}
              </StatNumber>
              <StatHelpText color={"gray.500"}>
                the score is a rate of 1-10
              </StatHelpText>
            </Stat>
          )}
        </Card>
      </Box>
      <List mt={4} spacing={4}>
        {!!data && therapy &&
          therapy.length &&
          therapy.map((t: Therapy, i: number) => (
            <ListItemComponent
              sentimentScore={data?.userMood * 10}
              key={i}
              question={t.question}
              answer={t.answer}
            />
          ))}
      </List>
      </Skeleton>
    </>
  );
}
