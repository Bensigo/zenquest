import React, { useEffect, useState } from 'react';
import {
  ChakraProvider,
  Box,
  Flex,
  Text,
  Button,
  IconButton,
  Heading,
} from '@chakra-ui/react';
import { FaSmile, FaMeh, FaFrown, FaSadTear } from 'react-icons/fa';
import { api } from '@/utils/api';
import RecommendedActivities from '../dashboard-home/components/Recommendations';
import cookie from 'js-cookie'
import { useRouter } from 'next/router';



enum Mood {
  verySad = 'Very Sad',
  sad = 'Sad',
  neutral = 'Neutral',
  happy = 'Happy'
}

const moodOptions = [
  { icon: FaSadTear, label: Mood.verySad },
  { icon: FaFrown, label: Mood.sad },
  { icon: FaMeh, label: Mood.neutral },
  { icon: FaSmile, label: Mood.happy },
];

const QuestActivityWrapper = () => {
  const [selectedMood, setSelectedMood] = useState<Mood>();
  const [showMoodCard, setShowMoodCard] = useState(true)
  const [score, setScore] = useState<number>()

  const { mutate: createMood, isLoading } = api.metric.createMoodMetric.useMutation()

  useEffect(() => {
    const moodScore = cookie.get("MoodScore")
    if (moodScore){
      const score = Number(moodScore);
      setScore(score)
      setShowMoodCard(false)
    }
  }, [])

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood);  
    const moodScore = getMoodScore(mood)
    cookie.set("MoodScore", moodScore.toString(), { expires: 1 })
  };

  const handleSumbitMood = () => {
    if (selectedMood){
      const moodScore = getMoodScore(selectedMood)
      createMood({
        score: moodScore,
        mood: selectedMood,
      }, {
        onSuccess: ({ score }) => {
          setShowMoodCard(false)
          setScore(score)
        }
      })
    }
  
  }

  const getMoodScore = (mood: Mood) => {
    const moodValues = Object.values(Mood);
    const scoreRange = 10;
    const scorePerMood = scoreRange / (moodValues.length - 1); // Divide by (number of moods - 1) to distribute scores evenly
   
    if (moodValues.includes(mood)) {
      const moodIndex = moodValues.indexOf(mood);
      return Math.round(moodIndex * scorePerMood);
    } else {
      throw new Error('Invalid mood value');
    }
  }

  return (
     <Box>

        {showMoodCard && (
          <Flex flexDir="column" align="center" justify="center" minHeight="100vh">
          <Box p={6} shadow="sm" borderRadius="md" bg="white" maxW={'500px'} width={'100%'}>
            <Text fontSize="xl" fontWeight="bold" color="primary" mb={4}>
              How are you feeling today?
            </Text>
            <Flex justify={'center'} gap={3} width={'100%'}>
              {moodOptions.map((mood) => (
                <IconButton
                  key={mood.label}
                  size={'lg'}
                  icon={<mood.icon  color='orange'/>}
                  aria-label={mood.label}
                  onClick={() => handleMoodSelect(mood.label)}
                  colorScheme={selectedMood === mood.label ? 'sage' : 'gray'}
                />
              ))}
            </Flex>
            {selectedMood && (
              <Text color='sage.400'  mt={4} fontSize="lg">
                You selected: {selectedMood}
              </Text>
            )}
          </Box>
          <Box mt={3} display={'flex'} >
            <Button onClick={handleSumbitMood} isLoading={isLoading} isDisabled={!selectedMood} colorScheme='sage' >Get Activity</Button>
          </Box>
        </Flex>
        )}
        <Heading
          color={"primary"}
          as="h4"
          size={{ base: "lg", md: "xl" }}
          mt={2}
        >
          Activities
        </Heading>
        {score && <RecommendedActivities moodScore={score} />}
     </Box>
  );
};


export default QuestActivityWrapper


