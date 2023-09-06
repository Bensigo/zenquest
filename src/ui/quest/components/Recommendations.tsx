import React from "react";
import {
  Box,
  Image,
  Text,
  Tag,
  TagLabel,
  Skeleton,
  SimpleGrid,
  Button,
  useToast
} from "@chakra-ui/react";
import { api } from "@/utils/api";
import { useRouter } from "next/router";




const RecommendedActivities = ({ moodScore }: { moodScore: number }) => {

  const router = useRouter()
  const context = api.useContext()
  const toast = useToast();
  const { data: activity } = api.activity.getActiveDailyActivity.useQuery({ type: 'Activity'})
  const { isLoading: isCompleteQuestActivityLoading, mutate } = api.activity.completeQuestActivity.useMutation()
const questId = router.query.id as string 
  const { data: recommendedActivities, isLoading, isFetched } =
    api.activity.getActivites.useQuery({ mood: moodScore, questId });


  const onCompleteActivity =() => {

 

    if (activity){
      mutate({
        id: activity.id,
      }, {
        onSuccess: () => {
          const resetActiveStep = async () => context.activity.getActiveStep.reset()
          const toQuest = async () => await router.push('/space/quest/' + questId);
          void resetActiveStep()
          void toQuest()
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
    <Box>
      <Box fontWeight="bold" fontSize="md" color={"gray.600"} mb={4}>
        Recommended Activities for you based on your mood
      </Box>
     
      <Skeleton isLoaded={isFetched}>
      <Box display={'flex'} justifyContent={'end'} my={3}>
        <Button isLoading={isCompleteQuestActivityLoading} colorScheme="sage" onClick={onCompleteActivity}>
          Finish 🎉
        </Button>                   
      </Box>
        <SimpleGrid columns={3} spacing={4}>
          {recommendedActivities &&
            recommendedActivities?.map((activity, index) => (
              <Box
                key={index}
                shadow={"md"}
                p={4}
                borderWidth="1px"
                borderRadius="md"
              >
                <Image
                  src={'/space/yoga.jpg'}
                  alt={activity.title}
                  boxSize={"contain"}
                  maxH={200}
                  width={"100%"}
                />
                <Text color={"gray.600"} mt={2} fontWeight="bold">
                  {activity.title}
                </Text>
                <Tag
                  my={2}
                  bg="sage.100"
                  color="sage.500"
                  size={"md"}
                  borderRadius="full"
                >
                  <TagLabel>{activity.duration}</TagLabel>
                </Tag>
                <Text color={"gray.600"}>{activity.description}</Text>
              </Box>
            ))}
        </SimpleGrid>
      </Skeleton>
    </Box>
  );
};


export default RecommendedActivities;
