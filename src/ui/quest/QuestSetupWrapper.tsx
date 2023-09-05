import { api } from "@/utils/api";
import { Box, Skeleton, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import AffirmationSetp from "./components/AffirmationStep";


const QuestSetupWrapper = () => {
    const router = useRouter();
    const toast = useToast()
    const id = router.query.id as string;


    const { data: quest, isFetched } = api.quest.get.useQuery({ id })
    const { mutate, isLoading } = api.quest.updatedQuestAffirmation.useMutation()


    const handleSubmit = (categories: string[]) => {
      if (quest){
        mutate({
            categories,
            id: quest.id
           }, {
             onError: (err) => {
                toast({
                    status:'error',
                    description: err.message,
                    duration: 3000,
                    isClosable: true
                })

             },
             onSuccess() {
                 const route = `/space/quest/${id}`
                 const gotoRoute = async () => await router.push(route)
                 void gotoRoute()
             },
           })
      }
    }

    return (
        <>
          <Box py={6}>
          <Skeleton isLoaded={isFetched} >
                {quest && <AffirmationSetp 
                    suggestedAffirmations={quest.suggestedAffirmationCategories}
                    onSubmitAffirmations={handleSubmit}
                    isSavingAffirmation={isLoading}
                />}
            </Skeleton>
          </Box>
        </>
    )
}

export default QuestSetupWrapper;