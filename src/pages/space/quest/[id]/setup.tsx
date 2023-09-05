import AppLayout from "@/shared-ui/AppLayout";
import QuestSetupWrapper from "@/ui/quest/QuestSetupWrapper";
import { type NextPage } from "next";


const  QuestSetup: NextPage  = () => {
    return (
     <AppLayout >
         <QuestSetupWrapper /> 
     </AppLayout>
    )
  }
  
  export default QuestSetup;