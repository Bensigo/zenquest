import {
  Box,
  Button,
  HStack,
  Heading,
  IconButton,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { getDate, format } from "date-fns";
import Note from "./components/Note";
import { useEffect, useRef, useState } from "react";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { BiArrowBack } from "react-icons/bi";

export const JOURNAL_ID_KEY = "journalId"

const NewJournalWrapper: React.FC = () => {

   
  const [showNote, setShowNote] = useState(false);


  const router = useRouter();
  const toast = useToast();

  const [canFinish, setCanFinish] = useState(false)



  const query = router.query;

  const isQuest = (query?.from as string)?.toLowerCase() === 'quest';
 
 

  const {
    mutateAsync: saveJournal,
    isLoading,
    isSuccess: isCreated,
    isError,
  } = api.journal.createOrUpdateJournal.useMutation();

 

  const { data: activity } = api.activity.getActiveDailyActivity.useQuery({ type: 'Journaling'})
  const { isLoading: isCompleteQuestActivityLoading, mutate } = api.activity.completeQuestActivity.useMutation()


  useEffect(() => {
    if (showNote) {
      console.log("finished typing .......");
    }
  }, [showNote]);

  const context = api.useContext()
  const today = new Date();


  const goBack =  () => {
    localStorage.removeItem(JOURNAL_ID_KEY)
    router.back()
  }


  const saveNote = async (note: string) => {
    const id = localStorage.getItem(JOURNAL_ID_KEY);
    if (id) {
      await saveJournal({ note, id });
    } else {

      await saveJournal(
        { note },
        {
          onSuccess: (journal) => {
            if (journal) {
              localStorage.setItem(JOURNAL_ID_KEY, journal.id);
            }
          },
          onError: (err) => {
             toast({
               description: err.message,
               duration: 4000,
               isClosable: true
             })
          }
        }
      );
    }
    // isNoteSaving.current = false
  };

  const handleCompleteQuest = () => {
      if (!isQuest && !canFinish && !activity)return;
      // handle complete quest
      mutate({
        id: activity?.id as string,
      }, {
        onSuccess: () => {
          const questId = router.query.questId as string;
          const resetActiveStep = async () => await context.activity.getActiveStep.reset({ id: questId })
          const backToQuest = async () => await router.push('/space/quest/' + questId)
          void resetActiveStep()
          void backToQuest()
        },
        onError: (err) => {
          toast({
            description: err.message,
            duration: 3000,
            isClosable: true,
            status: 'error'
            
          })
        }
      })
      

      
  }


  return (
    <>
 
      <Box>
       <Box my={3} display={'flex'} justifyContent={'space-between'}>
       <IconButton
          size={'lg'}
          color={'primary'}
          onClick={goBack}
          icon={<BiArrowBack />}
          aria-label={"back-button"}    
        />
          {isQuest  && <Button isLoading={isCompleteQuestActivityLoading} onClick={handleCompleteQuest} isDisabled={!canFinish} colorScheme="sage">Finish 🎉</Button>}
       </Box>
        <HStack spacing={3} alignItems={"end"}>
          <Heading
            color={"sage.500"}
            fontWeight={900}
            as={"h1"}
            fontSize={{ base: "60px", md: "100px" }}
          >
            {getDate(today)}
          </Heading>
          <Text color="sage.500" fontWeight={"bold"} fontSize={"2xl"}>
            {format(today, "MMM")}
          </Text>
        </HStack>
      </Box>
        <Note canFinish={setCanFinish}  isQuest={isQuest}  isSubmiting={isLoading} onSubmit={(val) => void saveNote(val)}  />
      
    </>
  );
};

export default NewJournalWrapper;
