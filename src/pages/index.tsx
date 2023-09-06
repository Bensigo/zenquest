/* eslint-disable @typescript-eslint/no-unsafe-call */
import { useEffect } from 'react'
import { type NextPage } from "next";
import LandingPageLayout from "@/shared-ui/BaseLayout";
import { HomeWrapper } from "@/ui/Home/HomeWrapper";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';



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
    <LandingPageLayout>
          <HomeWrapper/>
    </LandingPageLayout>
    </>
  );
};

export default Home;

