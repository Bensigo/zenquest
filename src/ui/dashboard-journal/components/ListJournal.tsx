/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { api, type RouterOutputs } from "@/utils/api";
import { formatDistanceToNow } from "date-fns";

import {
  Text,
  List,
  ListItem,
  Heading,
  useColorModeValue,
  Box,
  Link,
  IconButton,
  useToast,
  Tag,
  TagLabel
} from "@chakra-ui/react";
import { BiTrash } from "react-icons/bi";

type Journal = RouterOutputs["journal"]["listPaginated"][0];

type ListJournalProps = {
  journals: Journal[];
};

const ListJournal: React.FC<ListJournalProps> = ({ journals }) => {
  if (journals.length == 0) {
    return (
      <Box textAlign={"center"}>
        <Text fontSize={{ base: "sm", md: "md" }}>
          No journal created, let get you started
        </Text>
      </Box>
    );
  }

  return (
    <List py={{ base: 4, md: 6 }} spacing={3} borderRadius={"md"}>
      {journals.length > 0 &&
        journals?.map((journal) => (
          <DailyItem key={journal.id} journal={journal} />
        ))}
    </List>
  );
};

const DailyItem = ({ journal }: { journal: Journal }) => {
  const listItemBorderBottomColor = useColorModeValue("gray.400", "gray.500");
  const toast = useToast()
  const { mutate: deleteJournal, isLoading } =
    api.journal.deleteJournal.useMutation();
    const ctx = api.useContext()

  const handleDeleteJournal = (id: string) => {
    deleteJournal(
      { id },
      {
        onSuccess: () => {
          const invalidate = async () => await ctx.journal.listPaginated.reset()
          void invalidate()
          toast({
            title: 'deleted.',
            status: 'success',
            duration: 4000,
            isClosable: true,
          })
        },
        onError: () => {
          toast({
            title: 'Failed to create',
            description: "Something went wrong",
            status: 'error',
            duration: 4000,
            isClosable: true,
          })
        }
      }
    );
  };

  return (
    <ListItem
      shadow={"sm"}
      width={"100%"}
      alignItems={"end"}
      pt={{ base: 2, md: 4 }}
     
    >
      <Box
        alignItems={"center"}
        width="inherit"
        display={"flex"}
        alignContent={"space-between"}
        pb={{ base: 2, md: 4 }}
      
        borderBottomWidth={0.5}
      >
        <Box
          width={"100%"}
          _hover={{ cursor: "pointer", textDecoration: "none" }}
          as={Link}
          href={`/space/journal/${journal.id}`}
          textDecoration={"none"}
        >
          <Heading as="h5" size={{ base: "sm", md: "sm" }}  color={useColorModeValue("gray.600","white")}>
            {new Date(journal.createdAt).toDateString()} -{" "}
            {journal &&
              (journal.therapy && journal.therapy.length > 0
                ? journal.therapy[0]?.question?.slice(0, 10)
                : journal.note?.slice(0, 10))}
            ....
          
          </Heading>
          <Tag px={4} py={1} my={2} colorScheme="sage" size={'md'} borderRadius='full'>
            <TagLabel fontWeight={"bold"}>{journal.canEdit ? 'Journal': 'Theraputic'}</TagLabel>
          </Tag>
          <Text fontSize={"xs"} colorScheme="gray" fontWeight={"semibold"}>
            {formatDistanceToNow(journal.createdAt, { addSuffix: true })}{" "}
          </Text>
        </Box>
        <IconButton
          icon={<BiTrash />}
          onClick={() => handleDeleteJournal(journal.id)}
          aria-label="delete-daily"
          color="red.400"
          isLoading={isLoading}
        />
      </Box>
    </ListItem>
  );
};

export default ListJournal;
