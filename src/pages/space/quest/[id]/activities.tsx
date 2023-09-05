import AppLayout from "@/shared-ui/AppLayout"
import QuestActivityWrapper from "@/ui/quest/QuestActivitiesWrapper"
import { type NextPage } from "next/types"


const  Activities: NextPage  = () => {
    return (
        <AppLayout>
            <QuestActivityWrapper />
        </AppLayout>
    )
}

export default Activities