import ZenQuestCard from "@/shared-ui/ZenQuestCard";
import { api } from "@/utils/api";
import { Box, Button, ButtonGroup, Center, Flex, Grid, Skeleton, Text } from "@chakra-ui/react"
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import differenceInDays from "date-fns/differenceInDays";
import { useRouter } from "next/router";
import { useState } from "react";


type Filter = 'all'| 'active' | 'inactive'

const Filter = ({ selectedFilter, onChange }: {selectedFilter: Filter, onChange: (val: Filter) => void }) => {
    return (
      <Box p={4} >
        <ButtonGroup isAttached variant="solid">
          <Button
         
            colorScheme={selectedFilter === 'all' ? 'sage' : 'gray'}
            onClick={() => onChange('all')}
          >
            All
          </Button>
          <Button
            colorScheme={selectedFilter === 'active' ? 'sage' : 'gray'}
            onClick={() => onChange('active')}
          >
            Active
          </Button>
          <Button
            colorScheme={selectedFilter === 'inactive' ? 'sage' : 'gray'}
            onClick={() => onChange('inactive')}
          >
            Inactive
          </Button>
        </ButtonGroup>
      </Box>
    );
  };




  const QuestHomeWrapper = () => {
    const router = useRouter()
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const { data: quests, isLoading, refetch, isFetched } = api.quest.list.useQuery({
      take: 20,
      filter: selectedFilter,
    });
  
    const goToNewQuestPage = async () => {
        await router.push('/space/quest/new')
    }
  
    const handleFilterChange = async (value: 'all' | 'active' | 'inactive') => {
      setSelectedFilter(value);
      await refetch();
    };

    const gotoQUestDetail = async (id: string) => {
        await router.push('/space/quest/' + id)
    }
    const today = new Date()

    const getNumberOfDays = (start: Date) => differenceInCalendarDays(today, start)
    const totalDays = (start: Date, end: Date) => differenceInDays( end, start)
  
    return (
      <Box >
        <Box my={{base: 10, md: 4 }} display={'flex'}  justifyContent={'end'} >
          <Button onClick={() => void goToNewQuestPage()} colorScheme="sage">Create new Quest</Button>
        </Box>
        <Filter onChange={(val) => void handleFilterChange(val)} selectedFilter={selectedFilter} />
        <Skeleton isLoaded={isFetched}>
          <Flex flexWrap={'wrap'} gridGap={6} >
            { quests && quests.length > 0 ?
              quests.map((quest, i) => (
                <ZenQuestCard currentDay={() => getNumberOfDays(quest.createdAt)} totalDays={() =>  totalDays(quest.createdAt, quest.endDate)} key={quest.id} description={quest?.goal?.name} btnText="View" onClick={() => gotoQUestDetail(quest.id)}/>
              )): 
              <Center width={'100%'}>
                    <Text  fontWeight={'semibold'} color={'gray.600'}>No quest found</Text>
                </Center>
              }
          </Flex>
        </Skeleton>
      </Box>
    );
  };

export default QuestHomeWrapper;