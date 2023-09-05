import { api } from "@/utils/api";
import { Box, Text, Modal, ModalBody, ModalContent, ModalOverlay, Skeleton, useToast, Button } from "@chakra-ui/react";
import { type Goal } from "@prisma/client";
import { useEffect, useState } from "react";
import ChatUI from "./components/Chat";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";



const TherapyFocusModal = ({ isOpen, onClose, goals, onSelect, isSelected }: { isOpen: boolean, isSelected: boolean, onClose: () => void, goals: Goal[], onSelect: (goal: string) => void }) => {
   
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay  />
        <ModalContent>
        <ModalBody display="flex" flexWrap="wrap" flexDir={{ base: 'column', md: 'row' }} justifyContent="center" alignItems="center" h="100%">
            {goals.map((goal, index) => (
              <Box
              key={index}
              as={Button}
              textAlign="center"
              boxShadow="md"
              borderWidth="medium"
              borderRadius="md"
              height="auto"
              borderColor="sage.500"
              isLoading={isSelected}
              color="primary"
              m={2}
              py={2}
              px={4}
              maxW={{ base: "100%", md: "300px" }} // Set a maximum width for the buttons
              transition="all 0.2s"
              _hover={{ bg: "sage.100", color: "white" }}
              _focus={{ outline: "none", boxShadow: "outline" }}
              _active={{ bg: "sage.500" }}
              cursor="pointer"
                onClick={() => void onSelect(goal.name)}
            
              >
                <Text fontWeight={'bold'}      width={'100%'}  wordBreak="break-word">{goal.name}</Text>
              </Box>
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  };

 

const QuestTherapyWrapper = () => {
    const ctx = api.useContext()
    const toast = useToast()
    const router = useRouter()
    const session = useSession()

    const questId = router.query.id as string

    const { data: quest, isFetched, isLoading } = api.quest.get.useQuery({ id: questId })
    const [hasSelectedGoal, setHasSelectedGoal] = useState<boolean>(false)

    const { data: convasation, isLoading: loadingConversation, error } = api.chat.messages.useQuery({ questId })

    const { mutate: sendMsg, isLoading: isSending } = api.chat.sendMessage.useMutation()



    useEffect(() => {
      if (error && error.message){
        toast({
          title: error.message,
          status: 'error',
          isClosable: true,
        })
      }
    }, [error, toast])


    // useEffect(() => {
    //   if (quest && quest?.goal){
    //     const goal = quest?.goal;
    //   mutate({ focus: (goal.name as string)  }, {
    //     onSuccess:  () => {
    //      const getMsgs = async () =>  await ctx.chat.messages.refetch()
    //      void getMsgs();
    //      setHasSelectedGoal(false)
    //     },
    //     onError: (err) => {
    //       toast({
    //         title: err.message,
    //         status: 'error',
    //         isClosable: true,
    //       })
    //     }
    //   })
    // }
    // }, [quest])
   
    useEffect(() => {
       if(!loadingConversation && !convasation){

         setHasSelectedGoal(true)
       }
    }, [loadingConversation, convasation])

    // const handleGoalSelect = (goal: string) => {
     
    //     mutate({ focus: goal }, {
    //       onSuccess:  () => {
    //        const getMsgs = async () =>  await ctx.chat.messages.refetch()
    //        void getMsgs();
    //        setHasSelectedGoal(false)
    //       },
    //       onError: (err) => {
    //         toast({
    //           title: err.message,
    //           status: 'error',
    //           isClosable: true,
    //         })
    //       }
    //     })
       
    // }

    // const handleClose = () => {
    //   // on close
    // }

    const handleSendMsg = (msg: string) => {
      if (convasation){
        sendMsg({ sessionId: convasation?.id  , msg}, {
          onSuccess:  () => {
            const getMsgs = async () =>  await ctx.chat.messages.invalidate()
            void getMsgs();
           },
           onError: (err) => {
            
              toast({
                title: err.message,
                status: 'error',
                isClosable: true,
              })
             

           }
         })
      }
      
    }
     
    return (
       <Skeleton isLoaded={isFetched && !isLoading}>
        <Box>
           
            <Skeleton  isLoaded={!loadingConversation}>
              <Box  width='100%' px={2} >
                {convasation && <ChatUI 
                  isLoading={isSending} 
                  onSendMsg={handleSendMsg} 
                  msgs={convasation?.messages || []}
                  user={session.data?.user}
                  
                />}
              </Box>
            </Skeleton>
          
        </Box>
        </Skeleton> 
    );
}

export default QuestTherapyWrapper;