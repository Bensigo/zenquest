import ZenQuestCard from "@/shared-ui/ZenQuestCard";
import { api } from "@/utils/api";
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  Grid,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import differenceInDays from "date-fns/differenceInDays";
import { useRouter } from "next/router";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

type Filter = "all" | "active" | "inactive";

const Filter = ({
  selectedFilter,
  onChange,
}: {
  selectedFilter: Filter;
  onChange: (val: Filter) => void;
}) => {
  return (
    <Box p={4}>
      <ButtonGroup isAttached variant="solid">
        <Button
          colorScheme={selectedFilter === "all" ? "sage" : "gray"}
          onClick={() => onChange("all")}
        >
          All
        </Button>
        <Button
          colorScheme={selectedFilter === "active" ? "sage" : "gray"}
          onClick={() => onChange("active")}
        >
          Active
        </Button>
        <Button
          colorScheme={selectedFilter === "inactive" ? "sage" : "gray"}
          onClick={() => onChange("inactive")}
        >
          Inactive
        </Button>
      </ButtonGroup>
    </Box>
  );
};

const QuestHomeWrapper = () => {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const ctx = api.useContext()
  const {
    data: quests,
    isLoading,
    refetch,
    isFetched,
  } = api.quest.list.useQuery({
    take: 20,
    filter: selectedFilter,
  });

  const goToNewQuestPage = async () => {
    await router.push("/space/quest/new");
  };

  const handleFilterChange = async (value: "all" | "active" | "inactive") => {
    setSelectedFilter(value);
    await refetch();
  };

  const gotoQUestDetail = async (id: string) => {
    await router.push("/space/quest/" + id);
  };
  const today = new Date();

  const getNumberOfDays = (start: Date) =>
    differenceInCalendarDays(today, start);
  const totalDays = (start: Date, end: Date) => differenceInDays(end, start);

  return (
    <Box>
      <Box my={{ base: 10, md: 4 }} display={"flex"} justifyContent={"end"}>
        <Button onClick={() => void goToNewQuestPage()} colorScheme="sage">
          Create new Quest
        </Button>
      </Box>
      <Filter
        onChange={(val) => void handleFilterChange(val)}
        selectedFilter={selectedFilter}
      />
      <Skeleton isLoaded={isFetched} height={'50vh'}>
        {/* <Flex flexWrap={"wrap"} gridGap={6}> */}
          {quests && quests.length > 0 ? (
            <InfiniteScroll
              style={{ width: "100%", padding: 'None' }}
              loader={isLoading ? <>loading....</> : <></>}
              dataLength={quests.length} 
              next={async () => {
               await  ctx.quest.list.refetch({ take: quests.length + 20, filter: selectedFilter })
              }}
              hasMore={true}
              endMessage={
                <Text align={"center"} color={"primary"} fontSize={"xs"}>
                  Yay! You have seen it all
                </Text>
              }
              // below props only if you need pull down functionality
              refreshFunction={() => {
                const refresh = async () =>  await refetch();
                void refresh()
              }}
              pullDownToRefresh
              pullDownToRefreshThreshold={50}
              pullDownToRefreshContent={
                <Text align={"center"} color={"primary"} fontSize={"xs"}>
                  &#8595; Pull down to refresh
                </Text>
              }
              releaseToRefreshContent={
                <Text align={"center"} color={"primary"} fontSize={"xs"}>
                  &#8593; Release to refresh
                </Text>
              }
            >
              {quests.map((quest) => (
                <ZenQuestCard
                  currentDay={() => getNumberOfDays(quest.createdAt)}
                  totalDays={() => totalDays(quest.createdAt, quest.endDate)}
                  key={quest.id}
                  isActive={quest.isActive}
                  description={quest.goal?.name}
                  btnText="View"
                  onClick={() => void gotoQUestDetail(quest.id)}
                />
              ))}
            </InfiniteScroll>
          ) : (
            <Center width={"100%"}>
              <Text fontWeight={"semibold"} color={"gray.600"}>
                No quest found
              </Text>
            </Center>
          )}
        {/* </Flex> */}
      </Skeleton>
    </Box>
  );
};

export default QuestHomeWrapper;
