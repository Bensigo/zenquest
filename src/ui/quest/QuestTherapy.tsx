import { api } from "@/utils/api";
import { Box, Skeleton, useToast } from "@chakra-ui/react";
import ChatUI from "./components/Chat";
import { useRouter } from "next/router";

const QuestTherapyWrapper = () => {
  const toast = useToast();
  const router = useRouter();

  const questId = router.query.id as string;

  const {
    data: convasation,
    isLoading: loadingConversation,
  } = api.chat.messages.useQuery({ questId }, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError (err: any){
      toast({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        description: err.message,
        isClosable: true,
        duration: 3000,
        status: "error",
      });
    }
  });


  return (
  
      <Box>
        <Skeleton isLoaded={!loadingConversation}>
          <Box width="100%">
            {convasation && (
              <ChatUI
                msgs={convasation.messages}
              />
            )}
          </Box>
        </Skeleton>
      </Box>
  );
};

export default QuestTherapyWrapper;
