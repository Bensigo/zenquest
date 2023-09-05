

import { api } from '@/utils/api'
import { Box, Skeleton , Text, Button, Heading, useToast} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import QuestSetup from './components/QuestSetup'
import { Quest } from './components/Quest'
import  differenceInDays  from 'date-fns/differenceInDays'
import { QUEST_NEXT_STEP } from '../space-affrimations/AffirmationWrapper'
import { useRouter } from 'next/router'
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'


export const QuestWrapper = () => {
  const context = api.useContext()
  const router = useRouter()
  const toast = useToast()
  const id =  router.query?.id as string
  const { data: quest, isFetched } = api.quest.get.useQuery({ id })
  const { data: activeStep } = api.activity.getActiveStep.useQuery({ id })

  const { mutate: closeQuest, isLoading: isClosing } = api.quest.closeQuest.useMutation()
  const [startDate, setStartDate] = useState<Date>()
  
  const today = new Date();

  useEffect(() => {
    if (quest){
      setStartDate(quest.createdAt);
    }
  }, [quest, startDate])


  const getNumberOfDays = (start: Date) => differenceInCalendarDays(today, start)
  const totalDays = (start: Date, end: Date) => differenceInDays( end, start)
  const canCompleteQuest = activeStep?.count === 5

  const handleCloseQuest = () => {
    // close current active quest
    if (quest){
      closeQuest({ id: quest.id }, {
        onSuccess: () => {
          const refetch = async () => await context.quest.get.invalidate()
          void refetch()
        },
        onError: (err) => {
          toast({
            description: err.message,
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        }
      });
      localStorage.removeItem(QUEST_NEXT_STEP)
    }
  }

  return (
    <>
   
      <Box height={'100%'}  py={3} mb={5}>
       
        <Skeleton isLoaded={isFetched}>

          <Box py={4}>
        
            <Text color="sage.500" fontWeight={"black"} fontSize={"2xl"}>
             Quest for the day
            </Text>
              { quest && 
             <Text
             color={"gray.600"}
             fontWeight={'semibold'}
             fontSize={'md'}
           >
              Day {getNumberOfDays(quest.createdAt) + 1}  of {totalDays(quest.createdAt, quest.endDate)}. Hurray 🎉 🎉
            </Text>}
          </Box >
          {quest?.isActive && (
          <Box display={'flex'} my={4} width="100%">
             <Button isDisabled={!canCompleteQuest} isLoading={isClosing} onClick={handleCloseQuest}  colorScheme="sage">Complete Current Quest</Button>
          </Box>
        )}
        {quest  && activeStep &&  <Quest id={id} step={activeStep?.count === 5 ? 0: activeStep.count} />}
      </Skeleton> 
      </Box>
   
    </>
  )
}
