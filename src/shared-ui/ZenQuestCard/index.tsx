'use client'

import { api } from '@/utils/api';
import {
  Box,
  Heading,
  Text,
  Flex,
  HStack,
  Badge,
  useColorModeValue,
  IconButton,
} from '@chakra-ui/react'
import { BiTrash } from 'react-icons/bi';
import { BsArrowUpRight } from 'react-icons/bs'


type ZenQuestCardProps = {
   title?: string;
   description?: string,
   isActive: boolean; 
   btnText?: string
   selectedFilter:  "all" | "active" | "inactive"
   img?: string,
   id: string,
   onClick: () => void;
   currentDay: () => number 
   totalDays: () => number
}

export default function ZenQuestCard(props: ZenQuestCardProps) {

  const { mutate, isLoading } = api.quest.delete.useMutation()
 
  const handleDelete =  () => {
    mutate({ id: props.id }, {
      onSuccess: () => {
        const ctx = api.useContext()
       const invalidateListQuest = async() => await ctx.quest.list.reset({
          filter: props.selectedFilter,
          take: 20
        })
        void invalidateListQuest()
        // refresh 
      }
    })
  }
  return (

      <Box
        w="inherit"
        rounded={'sm'} 
        overflow={'hidden'}
        bg={useColorModeValue("inherit", "gray.700")}
        boxShadow={'xs'}>
        
        <Box p={4}>
          
         <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
         <Heading mb={2}  color={useColorModeValue("sage.500", "white")} fontSize={{ base: "md", lg: 'lg'}} noOfLines={1}>
         {props.description}
          </Heading>
          <IconButton size='md' isLoading={isLoading} onClick={handleDelete} aria-label='delete-quest' icon={<BiTrash />} color='red.400' />
         </Box>
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