import { Button, Box, Text, useToast, useColorModeValue } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { QUEST_NEXT_STEP } from "../space-affrimations/AffirmationWrapper";
import { api } from "@/utils/api";

export const DeepBreathWrapper = () => {
    const router = useRouter()
    const context = api.useContext()
    const toast = useToast();
    const { data: activity } = api.activity.getActiveDailyActivity.useQuery({ type: 'DEEP_BREATH'})
    const { isLoading: isCompleteQuestActivityLoading, mutate } = api.activity.completeQuestActivity.useMutation()
  


    const handleComplete = () => {
       if (activity){
        mutate({
          id: activity.id,
        }, {
          onSuccess: () => {
            // localStorage.setItem(QUEST_NEXT_STEP, '2')
           
            const questId = router.query.id as string
            const refetch = async () => await context.activity.getActiveStep.reset({ id: questId })
            const backToQuest = async () => await router.push('/space/quest/' + questId)
            void refetch()
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
      
    }

    return (
      <Box p={6} shadow="sm" borderRadius="md" bg={useColorModeValue("white", "gray.700")}>
        {/* Embedded YouTube Video */}
        <iframe 
            width="100%" 
            height="350"
            src="https://res.cloudinary.com/dczlbbkdg/video/upload/v1693824994/breathing-medidtation_gsptl8.mp4"
            title="Deep Breath Meditation"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
             >

        </iframe>
        
        {/* Short Description */}
        <Text mt={4} color={'sage.400'} fontSize="xl" fontWeight="semibold">
          Take a Deep Breath
        </Text>
        <Text color={'sage.400'}  mt={2}>
          Taking a deep breath can help you relax and reduce stress. Close your eyes, inhale deeply through your nose, hold for a few seconds, and exhale slowly through your mouth. Repeat a few times.
        </Text>
        
        {/* Complete Button */}
        <Button isLoading={isCompleteQuestActivityLoading} onClick={handleComplete} mt={4} colorScheme="sage">
          Complete
        </Button>
      </Box>
    );
  };


  