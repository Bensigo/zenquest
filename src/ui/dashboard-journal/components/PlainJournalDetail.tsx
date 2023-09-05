import { api } from "@/utils/api";
import { Box, Button, HStack, Heading, IconButton, Text } from "@chakra-ui/react";
import { type Journal } from "@prisma/client";
import { getDate, format } from "date-fns";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { BiArrowBack, BiTrash } from "react-icons/bi";
import Note from "./Note";
import { QUEST_NEXT_STEP } from "@/ui/space-affrimations/AffirmationWrapper";

export default function PlainJournalDetail({  journal  }: {  journal: Journal }) {

  const router = useRouter()


  const query = router.query;


  const isQuest = (query?.from as string)?.toLowerCase() === 'quest';
  const isJournalStage = localStorage.getItem(QUEST_NEXT_STEP) === '5'

  const [canFinish, setCanFinish] = useState(false)


  const { mutate: saveJournal, isLoading } = api.journal.createOrUpdateJournal.useMutation()

  const { mutate: deleteDaily, isLoading: isDeleteing } =
  api.journal.deleteJournal.useMutation();

  const goBack = () => {
    router.back();
  };

  


  const handleSaveJournal = (note: string)  => {
        saveJournal({ id: journal.id, note  })
  }

  const note =  (journal ? journal.note : '')as string;
  const date = journal.createdAt;

  const handleDeleteDaily = async (id: string) => {
    deleteDaily({ id });
    await router.push("/space/journal");
  };

  return (
    <>
      <Box>

    {journal && 
    <Box display={"flex"} justifyContent={"space-between"} mt={5}>
       <HStack spacing={3}>
       <IconButton
          size={"lg"}
          aria-label="go-back"
          color={"primary"}
          icon={<BiArrowBack />}
          onClick={goBack}
        ></IconButton>
        <IconButton
          icon={<BiTrash />}
          onClick={() => void  handleDeleteDaily(journal.id)}
          aria-label="delete-daily"
          color="red.400"
          size={"lg"}
          isLoading={isDeleteing}
        />
       </HStack>
       {isQuest && isJournalStage  && <Button isDisabled={!canFinish} colorScheme="sage">Finish 🎉</Button>}

      </Box>}
   
        <HStack spacing={3} alignItems={"end"}>
          <Heading
            color={"sage.500"}
            fontWeight={900}
            as={"h1"}
            fontSize={{ base: "60px", md: "100px" }}
          >
            {getDate(date)}
          </Heading>
          <Text color="sage.500" fontWeight={"bold"} fontSize={"2xl"}>
            {format(date, "MMM")}
          </Text>
        </HStack>
      </Box>
      <Box width={'100%'} height={'inherit'}>
        <Note 
            isSubmiting={isLoading} 
            onSubmit={handleSaveJournal}
            note={note}
            canFinish={setCanFinish}
            isQuest={isQuest}
        />
      </Box>
    </>
  );
}
