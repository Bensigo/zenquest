
import AppLayout from '@/shared-ui/AppLayout';
import JournalDetailWrapper from '@/ui/dashboard-journal/JournalDetailWrapper';
import { useRouter } from 'next/router'
import React from 'react'


export default function JournalDetail() {
 const router = useRouter()
 const id = router.query.id as string; 

    return (
        <AppLayout>
            <JournalDetailWrapper id={id} />
        </AppLayout>
      )

}
