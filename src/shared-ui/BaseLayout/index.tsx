/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Flex, Box } from "@chakra-ui/react";
import Footer from "./component/Footer";
import Navigation from "./component/Nav";

const LandingPageLayout = (props: any) => {
  return (
    <>
    <Flex 
       direction="column"
       m="0 auto"
       
       {...props}
    >   
    <Box px={{ base: 2 }}>
      <>
      <Navigation />
     <main>
        {props.children}
     </main>
      </>
    </Box>
   
     <footer>
        <Footer />
     </footer>
     </Flex>
    </>
  );
};

export default LandingPageLayout;
