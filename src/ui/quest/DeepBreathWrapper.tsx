import { Button, Box, Text, useToast, useColorModeValue, IconButton } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { QUEST_NEXT_STEP } from "../space-affrimations/AffirmationWrapper";
import { api } from "@/utils/api";
import { BiArrowBack } from "react-icons/bi";

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

    const goBack = () => {
      router.back()
    }

    return (
      <Box>
         <Box mt={4} mb={3}>
              <IconButton
                icon={<BiArrowBack />}
                size={"md"}
                color={"sage.500"}
                aria-label={"back-btn"}
                onClick={goBack}
              ></IconButton>
            </Box>
     
      <Box p={6} shadow="sm" borderRadius="md" bg={useColorModeValue("white", "gray.700")}>
        {/* Embedded YouTube Video */}
        <video controls width="100%" height={"auto"}>
        <source 
          
            src="https://res.cloudinary.com/dczlbbkdg/video/upload/v1693824994/breathing-medidtation_gsptl8.mp4"
            type="video/mp4"
             >

        </source>
        </video>
        
        {/* Short Description */}
        <Text mt={4} color={useColorModeValue('sage.400', 'ActiveCaption')} fontSize="xl" fontWeight="semibold">
          Take a Deep Breath
        </Text>
        <Text color={useColorModeValue('sage.400', 'ActiveCaption')}  mt={2}>
          Taking a deep breath can help you relax and reduce stress. Close your eyes, inhale deeply through your nose, hold for a few seconds, and exhale slowly through your mouth. Repeat a few times.
        </Text>
        
        {/* Complete Button */}
        <Button isLoading={isCompleteQuestActivityLoading} onClick={handleComplete} mt={4} colorScheme="sage">
          Complete
        </Button>
      </Box>
      </Box>
    );
  };


  