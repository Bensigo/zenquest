import { Box, CircularProgress, CircularProgressLabel, Text } from '@chakra-ui/react';

const MoodProgressBar = ({ val }: { val: number}) => {
  let color;
  if (val < 4) {
    color = 'red.400';
  } else if (val < 7) {
    color = 'yellow.400';
  } else {
    color = 'green.400';
  }

  return (
    <Box position="relative" >
    <CircularProgress
      value={(val / 10) * 100}
      color={color}
      size='200px'
      padding={{ base: 2, md: 3}}
      thickness={4}
    >
      <CircularProgressLabel fontSize={"md"} fontWeight="bold">
        {(val).toFixed(2)}
        <Text fontSize={'sm'} >Avg Mood</Text>
      </CircularProgressLabel>
    </CircularProgress>
  </Box>
  );
};

export default MoodProgressBar;
