import { api } from "@/utils/api";
import {
  Box,
  Button,
  Flex,
  Skeleton,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import ListJournal from "./components/ListJournal";
import InfiniteScroll from "react-infinite-scroll-component";
import { useRouter } from "next/router";
import React from "react";

const JournalWrapper = () => {
  const {
    isLoading,
    isFetched,
    data: journals,
    refetch
  } = api.journal.listPaginated.useQuery({ take: 20 });

  const ctx = api.useContext();

  const cardbg = useColorModeValue("sage.100", "gray.700")

  const router = useRouter();


  const goToNewJournal = async (type: "plain" | "therapeutic") => {
    const route = router.route + `/new`;
    await router.push({ query: { type }, pathname: route});
  };


  return (
    <Box py={4}>
      <Box borderRadius={'lg'} px={5} py={6} my={{ base: 4, md: 6 }} justifyContent={'center'}  bg={cardbg} height={'250px'}  alignItems={'center'} display={'flex'}>
        <Text fontSize={{ base: "md", md: "lg" }} fontStyle={"italic"} fontWeight={'semibold'}  color={useColorModeValue('gray.600' , "white")}>
          {/** eslint-disable-next-line react/no-unescaped-entities */}
          &quot; Life has no limitations except the ones you make
          &quot; - Les Brown
        </Text>
      </Box>
      <Button
        mb={{ base: 4, md: 6 }}
        _hover={{ background: "sage.400" }}
        variant={"solid"}
        color="white"
        colorScheme="sage"
        onClick={() => void goToNewJournal("plain")}
      >
        Start Your Reflective Journal
      </Button>

     <Skeleton isLoaded={!isLoading}>
     {isFetched && journals && (
        <InfiniteScroll
          style={{ width: "100%", padding: 0 }}
          loader={isLoading ? <>loading....</>: <></>}
          dataLength={journals.length || 1000}
          next={async () => {
            await ctx.journal.listPaginated.refetch({ take: journals.length + 20 })
          }}
          hasMore={true}
          endMessage={
            <Text align={"center"} color={"primary"} fontSize={"xs"}>
              Yay! You have seen it all
            </Text>
          }
          refreshFunction={async () => {
            await refetch()
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
          <ListJournal journals={journals} />
        </InfiniteScroll>
      )}
  
     </Skeleton>
    </Box>
  );
};

interface CardProps {
  title: string;
  onClick: () => void;
}

const Card: React.FC<CardProps> = ({ title, onClick }) => {
  const cardColor = useColorModeValue("gray.200", "gray.700");
  return (
    <Flex
      p={4}
      bg={cardColor}
      borderWidth="1px"
      borderRadius="md"
      alignItems="center"
      justifyContent="center"
      cursor="pointer"
      onClick={onClick}
      width="150px"
      height="150px"
    >
      <Text fontWeight={'extrabold'}  color={'primary'}>{title}</Text>
    </Flex>
  );
};

export default JournalWrapper;
