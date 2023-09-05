import AppLayout from "@/shared-ui/AppLayout";
import { QuestAffrimationWrapper } from "@/ui/quest/QuestAffrimationWrapper";
import { type NextPage } from "next";

export const  Affirmations: NextPage  = () => {
    return (
     <AppLayout >
          <QuestAffrimationWrapper />
     </AppLayout>
    )
  }
  
  export default Affirmations;