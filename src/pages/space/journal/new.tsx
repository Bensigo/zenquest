import AppLayout from "@/shared-ui/AppLayout";
import { type NextPage } from "next";
import NewJournalWrapper from "@/ui/dashboard-journal/NewJournalWrapper";

const New: NextPage = () => {
  return (
    <AppLayout>
      <NewJournalWrapper />
    </AppLayout>
  );
};

export default New;
