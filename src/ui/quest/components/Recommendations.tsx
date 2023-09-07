import React from "react";
import {
  Box,
  Text,
  Tag,
  TagLabel,
  Skeleton,
  SimpleGrid,
  Button,
  useToast,
  Heading
} from "@chakra-ui/react";
import { api } from "@/utils/api";
import { useRouter } from "next/router";


function getRandomColor() {
  // Define the hue range that complements sage green (e.g., between 90 and 150)
  const minHue = 90;
  const maxHue = 150;

  // Generate a random hue value within the defined range
  const randomHue = Math.floor(Math.random() * (maxHue - minHue + 1)) + minHue;

  // Convert the hue value to an HSL color string
  const randomColor = `hsl(${randomHue}, 40%, 50%)`; // Adjust saturation and lightness as needed

  return randomColor;
}

const RecommendedActivities = ({ moodScore }: { moodScore: number }) => {

  const router = useRouter()
  const context = api.useContext()
  const toast = useToast();
  const { data: activity } = api.activity.getActiveDailyActivity.useQuery({ type: 'Activity'})
  const { isLoading: isCompleteQuestActivityLoading, mutate } = api.activity.completeQuestActivity.useMutation()
const questId = router.query.id as string 

const { data: recommendedActivities, isLoading, isFetched } =
    api.activity.getActivites.useQuery({ mood: moodScore, questId }, { retryDelay: 1000 });


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
    <Box py={10} mb={8}>
      <Box fontWeight="bold" fontSize="md" color={"gray.600"} mb={4}>
        Recommended Activities for you based on your mood
      </Box>
     
      
      <Box display={'flex'} justifyContent={'end'} my={3}>
      <Skeleton isLoaded={isFetched} >
          <Button isLoading={isCompleteQuestActivityLoading} colorScheme="sage" onClick={onCompleteActivity}>
            Finish 🎉
          </Button>  
        </Skeleton>                 
      </Box>
      <Skeleton isLoaded={isFetched} minH={'200px'}>
        <SimpleGrid  columns={{ base: 1, md: 3 }} spacing={4}>
          
          {recommendedActivities &&
            recommendedActivities?.map((activity, index) => (
              <Box
                key={index}
                border={'sm'}
                shadow={'xs'}
                borderWidth={'0.5px'}
                borderRadius="md"
              >
                {/* <Image
                  src={`https://source.unsplash.com/random/300x300/?${activity.title}`}
                  loading="lazy"
                  alt={activity.title}
                  boxSize={"contain"}
                  maxH={200}
                  width={"100%"}
                /> */}
                <Skeleton isLoaded={isFetched}>
                <Box  borderTopRadius={'sm'} display={'flex'}   py={10} px={4} alignSelf={'center'} background={getRandomColor()}>
                    <Heading width={'100%'} textAlign={'center'} color="white" fontSize={'md'}>{activity.title.includes('Meditation')? 'Meditation' : activity.title }</Heading>

                </Box>
                </Skeleton>
                <Skeleton isLoaded={isFetched}>
                  <Box px={4} pb={4}>
                  <Text color={"gray.600"} mt={2} fontWeight="bold">
                    {activity.title.includes('Meditation')? 'Meditation' : activity.title }
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
                </Skeleton>
              </Box>
            
            ))}
            
        </SimpleGrid>
        </Skeleton>
    </Box>
  );
};


export default RecommendedActivities;
