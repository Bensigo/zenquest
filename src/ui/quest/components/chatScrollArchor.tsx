import { useAtBottom } from "@/shared-hooks/useAtBottom"
import { Box } from "@chakra-ui/react"
import React from "react"
import { useInView } from "react-intersection-observer"



interface ChatScrollAnchorProps {
    trackVisibility?: boolean
}

export function ChatScrollAnchor({ trackVisibility }: ChatScrollAnchorProps) {
    const isAtBottom = useAtBottom()

    const {ref, entry, inView } = useInView({
        trackVisibility,
        delay: 100,
        rootMargin: '0px 0px -200px 0px'
    })

    React.useEffect(() => {
        if (isAtBottom && trackVisibility && !inView) {
          entry?.target.scrollIntoView({
            block: 'start'
          })
        }
      }, [inView, entry, isAtBottom, trackVisibility])

    return <Box ref={ref} h="1px" w="full" />
}