import AppLayout from "@/shared-ui/AppLayout";
import QuestHomeWrapper from "@/ui/quest/QuestHomeWrapper";
import { type  NextPage } from "next";




const Quest: NextPage = () => {


    return (
        <AppLayout>
          <QuestHomeWrapper />
      </AppLayout>
    )

};

export default Quest