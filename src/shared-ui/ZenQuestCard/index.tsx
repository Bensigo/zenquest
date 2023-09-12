'use client'

import {
  Box,
  Heading,
  Text,
  Flex,
  HStack,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react'
import { BsArrowUpRight } from 'react-icons/bs'


type ZenQuestCardProps = {
   title?: string;
   description?: string,
   isActive: boolean; 
   btnText?: string
   img?: string,
   onClick: () => void;
   currentDay: () => number 
   totalDays: () => number
}

export default function ZenQuestCard(props: ZenQuestCardProps) {
 
 
  return (

      <Box
        w="inherit"
        rounded={'sm'} 
        overflow={'hidden'}
        bg={useColorModeValue("inherit", "gray.700")}
        boxShadow={'xs'}>
        
        <Box p={4}>
          
          <Heading mb={2}  color={useColorModeValue("sage.500", "white")} fontSize={{ base: "md", lg: 'lg'}} noOfLines={1}>
         {props.description}
          </Heading>
          {/* <Text fontWeight={'semibold'} color={useColorModeValue("inherit", "white")} noOfLines={2}>
            {props.description}
          </Text> */}
          <Badge colorScheme={ props.isActive ?'green': 'gray'} mt={2} p={2} rounded={'md'}>
            Day {props.currentDay() + 1} of {props.totalDays()}
          </Badge>
        </Box>
       
        <HStack >
          <Flex
            p={4}
            alignItems="center"
            justifyContent={'space-between'}
            roundedBottom={'sm'}
            cursor={'pointer'}
            onClick={props.onClick}
            w="full">
            <Text fontSize={'md'} fontWeight={'bold'} color={useColorModeValue("sage.400", "white")} >
             {props.btnText}
            </Text>
            <BsArrowUpRight color='#738678' fontWeight={"bold"} />
          </Flex>
         
        </HStack>
      </Box>

  )
}