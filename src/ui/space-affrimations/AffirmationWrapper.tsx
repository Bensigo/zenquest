import { api } from '@/utils/api'
import { Container, Button, Box, Text, Skeleton, Flex, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import React, { useState } from 'react'

export const QUEST_NEXT_STEP = 'nextStep'

export function AffirmationCard({ data, title, isQuest }: { data: string[], title?: string, isQuest?: boolean}) {
    const [currentAffirmationIndex, setCurrentAffirmationIndex] = useState(0);
    const router = useRouter();
    const context = api.useContext();
    const [affirmations, setAffirmations ] = useState(data)
    const totalAffirmations = affirmations.length;

    const toast = useToast();
    const { data: activity } = api.activity.getActiveDailyActivity.useQuery({ type: 'Affirmation'})
    const { isLoading: isCompleteQuestActivityLoading, mutate } = api.activity.completeQuestActivity.useMutation()
  
    const handleNext = () => {
      if (currentAffirmationIndex + 1 < totalAffirmations){
        setCurrentAffirmationIndex((prevIndex) => (prevIndex + 1));
      }
      
    };

    const handleCompleteQuestStep = () => {
        if (activity){
          mutate({
            id: activity?.id
          }, {
            onSuccess:  () => {
              const questId = router.query.id as string
              const refetch = async () => await context.activity.getActiveStep.reset({ id: questId })
             const goto = async () => await router.replace('/space/quest/' + questId)
             void refetch()
             void goto()
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
       
    }
  
    const handleBack = () => {
      setCurrentAffirmationIndex((prevIndex) =>
        prevIndex === 0 ? totalAffirmations - 1 : prevIndex - 1
      );
    };
  
    return (
        <Box padding={4} height="100%">
        <Container maxW="100%" centerContent>
          <Flex
            flexDirection="column"
            alignItems="center"
            padding={8}
            minH="500px"
          >
            <Text fontSize={{ base: "2xl", md: "5xl"}} marginTop={4} fontWeight="bold" color='primary' textAlign="center">
             {title? title : ' Daily Affirmation'}
            </Text>
            <Flex flex="1" flexDirection="column" justifyContent="center">
              <Text color='primary' fontSize={{ base: 'xl', md: '2xl'}} marginBottom={8} textAlign="center">
                {affirmations[currentAffirmationIndex]}
              </Text>
            </Flex>
            <Flex justifyContent="center" mb={4}>
              <Button
                mr={2}
                isDisabled={currentAffirmationIndex === 0}
                onClick={handleBack}
                colorScheme='sage'
              >
                Back
              </Button>

               { isQuest && currentAffirmationIndex + 1 === totalAffirmations ? 
                <Button isLoading={isCompleteQuestActivityLoading} colorScheme='sage'  mr={2} onClick={() => void handleCompleteQuestStep()} >Complete Step</Button> :
                <Button colorScheme='sage' ml={2} onClick={handleNext}>
                Next
              </Button>
              }
            </Flex>
          </Flex>
        </Container>
      </Box>
    );
}


export const AffirmationWrapper = () => {
  const { data, isFetched } = api.affirmation.getDailyAffirmations.useQuery()


  return (
    <Box>
        <Skeleton isLoaded={isFetched}>
           <AffirmationCard  data={data || []}  />
        </Skeleton>
    </Box>
  )
}
