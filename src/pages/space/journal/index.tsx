/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import AppLayout from "@/shared-ui/AppLayout";
import { type NextPage } from "next";
import JournalWrapper from "@/ui/dashboard-journal/JournalWrapper";

const Journal: NextPage = () => {
  return (
    <AppLayout>
      <JournalWrapper />
    </AppLayout>
  );
};

export default Journal;
