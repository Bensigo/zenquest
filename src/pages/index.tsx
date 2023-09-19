/* eslint-disable @typescript-eslint/no-unsafe-call */
import { useEffect } from 'react'
import { type NextPage } from "next";
import LandingPageLayout from "@/shared-ui/BaseLayout";
import { HomeWrapper } from "@/ui/Home/HomeWrapper";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import SEO from '@/shared-ui/SEO';



const Home: NextPage = () => {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const { status } = useSession()
  const router = useRouter()


  useEffect(() => {
    if (status === 'authenticated'){
      const goToDasboard = async () => {
        await router.push('/space/journal')
      }
      void goToDasboard();
    }
   return () => {
    //
   }

  }, [status, router])
     
  return (
    <>
      <SEO
        title="ZenQuest - Your personal growth journey begins here. "
        description="Set goals and embrace daily quests with meditation, affirmations, and AI support. Your journey to personal growth starts now."
        keywords="mindfulness,personal development,limitless living ,mental well-being, note-taking app, Goal getting, affirmations, mindfulness exercises, Bio-Hacking,personal development, manifestation"
      />
    <LandingPageLayout>
          <HomeWrapper/>
    </LandingPageLayout>
    </>
  );
};

export default Home;

