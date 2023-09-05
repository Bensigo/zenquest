import AppLayout from "@/shared-ui/AppLayout"
import { DeepBreathWrapper } from "@/ui/quest/DeepBreathWrapper"
import { type NextPage } from "next/types"



const  Breath: NextPage  = () => {
    return (
        <AppLayout>
            <DeepBreathWrapper />
        </AppLayout>
    )
}

export default Breath