import Hero from "@/shared-ui/Hero";
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  Stack,
  Image,
  HStack,
  Center,
  Container,
  VStack,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/react";
import { signIn } from "next-auth/react";

type ValueType = { imageSrc: string;  description: string };

const howItWorks: ValueType[] = [
  {
    imageSrc: "/space/quest.svg",
    description: "Create a quest by setting your personal goals."
  },
  {

    imageSrc: "/space/goal.svg",
    description: "Add deadlines to your goals with calendar integration"
  },
  {

    imageSrc: "/space/archiever.svg",
    description: "Enjoy daily meditation for calm and focus."
  },
  {

    imageSrc: "/space/archiever.svg",
    description:  "Receive tailored affirmations for a positive mindset."
  },
  {

    imageSrc: "/space/archiever.svg",
    description:  "Chat with Ada about your goal, your AI personal assistance"
  },
  {

    imageSrc: "/space/archiever.svg",
    description:  "AI suggests activities aligned with your goals."
  },
  {

    imageSrc: "/space/archiever.svg",
    description:  "Reflect on your journey with the daily reflective journal."
  },
  
];

type Features = {
  imageSrc: string;
  title: string;
};

const features: Features[] = [
  {
    imageSrc: "/space/quest.svg",
    title: "Set personalized goals that matter to you.",
  },
  {
    imageSrc: "/space/meditation.svg",
    title: "Daily meditation sessions for inner peace and focus.",
  },
  {
    imageSrc: "/space/affirmation.svg",
    title: "Empowering affirmations tailored to your goals.",
  },
  {
    imageSrc: "/space/chat.svg",
    title: "Chat with Ada, your AI assitant to guide you toward your goal.",
  },
  {
    imageSrc: "/space/activity.svg",
    title: "AI-curated quests that lead you toward success.",
  },
  {
    imageSrc: "/space/journal.svg",
    title: "Reflective journaling to track your journey.",
  },
];

type FAQ =  { question: string, answer: string}
const faqData: FAQ [] = [
  {
    question: "What is a Quest?",
    answer: "A planned action or task created as a step toward achieving a specific goal.",
  },
  {
    question: "How do I create a quest and set my goals?",
    answer: `Creating a quest is easy! Just go to the "Quest" section, click "Create Quest," and follow the prompts to set your goals`
  },
  {
    question: "Is my journaling private?",
    answer: "Yes, your journal entries are completely private and secure. Only you can access and view your journal"
  },
  {
    question: "Is my data secure?",
    answer: "Yes, your data is secure, your personal information is handled with the utmost care and security"
  },
  {
     question: "How does the AI suggest activities aligned with my goals?",
     answer: "Our AI analyzes your goals and preferences to recommend activities that best support your personal growth journey."
  }
]

export const HomeWrapper = () => {
  return (
    <Box pt={{ base: 8, md: 12 }}  >
      <Hero
        title="Your Personal Growth Journey Begins Here"
        subtitle="Set goals, embrace daily quest with meditation, affirmations, and AI support. Your part to personal growth start now."
        onClick={() => void signIn()}
        ctaText="Start Your Growth Journey"
        image=""
      />
       <Box position={'relative'}  w={'100%'} boxShadow={'sm'}  mt={12} bgImg={{ md : "/space/heroImage.svg", base: "/space/heroMobile.svg"}}  height={'90vh'}>
          {/* <Image alt='hero'   src={}  rounded="1rem" shadow="2xl" /> */}
        </Box>

       <Box px={{ base: 2, md: 8}}>

       <Center my={4}>
        <Heading
          fontSize={{ md: "3xl", base: "xl" }}
          color={"sage.500"}
          fontWeight={"extrabold"}
          id="#features"
        >
          Key Features
        </Heading>
      </Center>
      <SimpleGrid
        columns={[1, 3, 3]}
        px={'20%'}
        py={2}
        spacing={"10px"}
        justifyItems="center"
        alignItems="center"
      >
        {features.map((feature, i) => (
          <FeaturesCard
            key={i}
            title={feature.title}
            imageSrc={feature.imageSrc}
          />
        ))}
      </SimpleGrid>
       </Box>
      <Box  py={4} px={{ base: 2, md: 10}}>
      <Stack mt={8} spacing={4} as={Container} maxW={'3xl'} textAlign={'center'}>
          <Heading
            fontSize={{ md: "3xl", base: "xl" }}
            color={"sage.500"}
            fontWeight={"extrabold"}
            id="#howItWork"
          >
            How ZenQuest Works
          </Heading>
          <Text color={'gray.600'} fontSize={'xl'}>
          Navigating Your Path to Personal Growth
        </Text>
        </Stack>
        <Container maxW={'6xl'} mt={10}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
          {howItWorks.map((data, i) => (
            <HStack key={i} align={'top'}>
              <Box color={'green.400'} px={2}>
                {/* <Icon as={BiCheck} /> */}
                 <Box px={3} py={1} bg={'green.400'} rounded="full" color={'white'}>
                   {i + 1}
                 </Box>
              </Box>
              <VStack align={'start'}>
                {/* <Text fontWeight={600}>{data.title}</Text> */}
                <Text color={'gray.600'} fontSize={{ md: 'lg', base: 'md'}}>{data.description}</Text>
              </VStack>
            </HStack>
          ))}
        </SimpleGrid>
      </Container>
        <Box mt={10}>
        <Heading
              display={"flex"}
              justifyContent={"center"}
              lineHeight={"tall"}
              as="h3"
              size={{ base: "lg", md: "xl" }}
              fontWeight={"extrabold"}
              color={"primary"}
              textAlign={"center"}
              id="#faq"
            >
              {/*  eslint-disable-next-line react/no-unescaped-entities */}
              FAQ'S
              </Heading>
              <Container maxW={'6xl'} mt={10}>
                <AccordionCard data={faqData}  />
               </Container>
        </Box>
      </Box>
      <Box>
      </Box>
   
      
    </Box>
  );
};


type AccordionCard = {
  data: FAQ[]
}

const  AccordionCard = ({ data }: { data: FAQ[] }) => {
  return (
    <Accordion  defaultIndex={[0]} allowMultiple>
      {data?.map(({ question, answer}, i) => (
         <AccordionItem  key={i} >
         <h2>
           <AccordionButton>
             <Box as="span" flex='1' textAlign='left'>
              {question}
             </Box>
             <AccordionIcon />
           </AccordionButton>
         </h2>
         <AccordionPanel pb={4}>
           {answer}
         </AccordionPanel>
       </AccordionItem>
      ))}
    </Accordion>
  )

}


const FeaturesCard = ({ imageSrc, title }: Features) => {
  return (
    <Box
      p={4}
      boxShadow={"sm"}
      borderRadius="md"
      bg={"whiteAlpha.900"}
      height={"280px"}
    >
      <Stack spacing={3} alignItems={"center"}>
        <Image
          src={imageSrc}
          alt={title}
          objectFit="contain"
          height="150px"
          width="120px"
        />
        <Text
          textAlign={"center"}
          fontSize={{ md: "lg", base: "md" }}
          fontWeight={"medium"}
          color={"gray.600"}
        >
          {title}
        </Text>
      </Stack>
    </Box>
  );
};
