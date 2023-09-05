import AppLayout from "@/shared-ui/AppLayout";
import { QuestWrapper } from "@/ui/quest/QuestWrapper";
import { type NextPage } from "next";

const  Quest: NextPage  = () => {
    return (
     <AppLayout >
          <QuestWrapper />
     </AppLayout>
    )
  }
  
  export default Quest;