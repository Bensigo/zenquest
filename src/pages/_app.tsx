/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "@/utils/api";
import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { AnimatePresence } from 'framer-motion';
import customTheme from "@/utils/theme";
import { Analytics } from "@vercel/analytics/react"

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
    <SessionProvider session={session}>
      <ChakraProvider theme={customTheme}>
        <AnimatePresence>
         <Component {...pageProps} />
         </AnimatePresence>
      </ChakraProvider>
     
    </SessionProvider>
    <Analytics />
    </>
  );
};


const AppWithTRPC = api.withTRPC(MyApp);

export default AppWithTRPC;
