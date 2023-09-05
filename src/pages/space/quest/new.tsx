import AppLayout from "@/shared-ui/AppLayout";
import CreateNewQuestWrapper from "@/ui/quest/CreateNewQuestWrapper";
import { type NextPage } from "next";

const NewQuest: NextPage = () => {

    return (
        <AppLayout>
          <CreateNewQuestWrapper />
      </AppLayout>
    )

};

export default NewQuest;