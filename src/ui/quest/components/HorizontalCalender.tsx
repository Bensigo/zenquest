import { Box, Button, Flex, useColorModeValue, Text, HStack } from '@chakra-ui/react';
import React from 'react';

interface HorizontalCalendarProps {
  startDate: Date;
}

const HorizontalCalendar: React.FC<HorizontalCalendarProps> = ({ startDate }) => {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const highlightColor = useColorModeValue('sage.100', 'sage.800');
  const blurColor = useColorModeValue('gray.300', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'gray.300');

  const renderDays = () => {
    const days = [];

    for (let i = -5; i <= 3; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);

      const dayLabel = daysOfWeek[currentDate.getDay()];
      const date = currentDate.getDate();

      const isToday = new Date().toDateString() === currentDate.toDateString();
      const isFuture = currentDate > new Date();

      days.push(
        <Box
          key={i}
          p={2}
          borderWidth="1px"
          borderColor="gray.200"
          bg={isToday ? highlightColor : isFuture ? blurColor : 'white'}
          borderRadius="50%" // Make the box circular
          width={{  sm: '40px', md: '60px', base: '60px'}}
          height={{  sm: '40px', md: '60px', base: '60px'}}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
        >
          <Text fontSize={{ md: 'sm', sm: 'sm', base: '14px'}} color={'sage.400'} >
            {dayLabel}
          </Text>
          <Text as='span' fontSize={{ md: 'sm', sm: 'sm', base: '14px'}} color={'sage.400'}>
            {date}
          </Text>
        </Box>
      );
    }

    return days;
  };

  return (
    <HStack align="center" spacing={2} overflowX="auto"> {/* Add horizontal scrolling on mobile */}
      {renderDays()}
      <Button colorScheme="sage" fontSize="14px">
        Finish
      </Button>
    </HStack>
  );
};

export default HorizontalCalendar;