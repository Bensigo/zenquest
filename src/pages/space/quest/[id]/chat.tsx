import AppLayout from "@/shared-ui/AppLayout";
import QuestTherapyWrapper from "@/ui/quest/QuestTherapy";
import { type NextPage } from "next";


 const  Chat: NextPage  = () => {
    return (
        <>
            <AppLayout>
                <QuestTherapyWrapper />
            </AppLayout>
        </>
    )
 }

 export default Chat;


