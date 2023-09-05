import { Box, Button, Skeleton, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { InfoNote } from "./components/InfoNote";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { AffirmationCard } from "../space-affrimations/AffirmationWrapper";

export const QuestAffrimationWrapper = () => {
  const router = useRouter();
  const questId = router.query.id as string;
  const { data, isFetched } = api.quest.get.useQuery({ id: questId });
  const { data: affirmations, isFetched: isAffirmationFetched } = api.affirmation.getQuestAffirmation.useQuery();

  const [hideInfo, setHideInfo] = React.useState(false)
  

 

  useEffect(() => {

    if (isFetched){
        if ((!data) || !data?.isActive) {
          const questId = router.query.id as string
           const goToQuest = async () =>  await router.push('/space/quest/' + questId)
           void goToQuest()
        }
    }
    return () => {
      // handle unmount
    }
  }, );


  return (
   
      <Box pb={5}>
        <Skeleton isLoaded={isFetched}>
        {!hideInfo && <InfoNote>
            <Box my={1} display={'flex'}width={'100%'}  justifyContent={'end'}>
            <Button  colorScheme="sage"  variant={'ghost'} onClick={() => {
                setHideInfo(true)
            }}>x</Button>
            </Box>
            <Text>
            Practice the power of affirmation by repeating your affirmations nine
          times. As you say each affirmation, visualize it becoming a reality in
          your life. Embrace the positive energy it brings and feel it resonate
          within you. Consider incorporating your affirmations into your
          meditation practice, using them as a mantra to deepen your connection
          with your inner self. Let the affirmations empower and guide you on
          your journey to a more fulfilling and positive life.
            </Text>
        </InfoNote>}
        </Skeleton>
        
         <Skeleton  isLoaded={isAffirmationFetched} mt={2}>
            <AffirmationCard isQuest={true} data={affirmations || []} title={'Daily Quest Affrimation'}/>
        </Skeleton>
      </Box>
   
  );
};
