import Hero from "@/shared-ui/Hero";
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  Stack,
  useColorModeValue,
  Image,
  HStack,
  Center,
  IconButton,
} from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { BiBot, BiData } from "react-icons/bi";

type ValueType = { imageSrc: string; title: string; description: string };

const values: ValueType[] = [
  {
    title: "Create a quest",
    imageSrc: "/space/quest.svg",
    description:
      "Embark on your journey! Create a quest and start your path to personal growth and achievement with ZenQuest today.",
  },
  {
    title: "Add a goal",
    imageSrc: "/space/goal.svg",
    description:
      "Define your goals, and let us guide you on the path to turning your dreams into reality.",
  },
  {
    title: "Start Achieving your dreams",
    imageSrc: "/space/archiever.svg",
    description:
      "Ready to bring your dreams to life? Begin your journey of personal growth and achievement with ZenQuest.",
  },
];

type Features = {
  imageSrc: string;
  title: string;
};

const features: Features[] = [
  {
    imageSrc: "/space/breathing.svg",
    title: "Deep Breath",
  },
  {
    imageSrc: "/space/affirmation.svg",
    title: "Daily affirmations",
  },
  {
    imageSrc: "/space/chat.svg",
    title: "Chat with Ada(Ai therapist)",
  },
  {
    imageSrc: "/space/activity.svg",
    title: "AI generated daily activity to help achieve your goal",
  },
  {
    imageSrc: "/space/journal.svg",
    title: "Journal for reflecting",
  },
  {
    imageSrc: "/space/mood-tracking.svg",
    title: "Tracking your mood",
  },
];

export const HomeWrapper = () => {
  return (
    <Box pt={{ base: 8, md: 0 }}>
      <Hero
        title="Become An Achiever"
        subtitle="Embark on a transformative journey with ZenQuest, unlocking your inner power to become an unstoppable achiever. Discover success keys, transcend limits, and embrace boundless possibilities."
        onClick={() => void signIn()}
        ctaText="Start Your Quest"
        image="https://images.pexels.com/photos/4065891/pexels-photo-4065891.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2?auto=compress&cs=tinysrgb&h=650&w=940"
      />

      <Box
        px={4}
        py={{ base: 12 }}
        width="100%"
        display={"flex"}
        justifyContent={"center"}
      >
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
          {values.map((val, i) => (
            <ResponsiveCard
              key={i}
              title={val.title}
              description={val.description}
              imageSrc={val.imageSrc}
            />
          ))}
        </SimpleGrid>
      </Box>

      <Center my={4}>
        <Heading
          fontSize={{ sm: "2xl", lg: "5xl", base: "lg" }}
          color={"sage.500"}
          fontWeight={"extrabold"}
          id="#features"
        >
          Features
        </Heading>
      </Center>
      <Box
        px={4}
        py={{ base: 8 }}
        width="100%"
        display={"flex"}
        justifyContent={"center"}
      >
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
          {features.map((feature, i) => (
            <FeaturesCard
              key={i}
              title={feature.title}
              imageSrc={feature.imageSrc}
            />
          ))}
        </SimpleGrid>
      </Box>
      <Box py={4} px={4}>
        <Center>
          <Box
            bg="green.50"
            gap={3}
            borderRadius={"lg"}
            minH={"300px"}
            mb={12}
            boxShadow={'sm'}
            minW={{ md: "700px", base: "100%" }}
            py={8}
            id="#offer"
          >
            <Heading
              display={"flex"}
              justifyContent={"center"}
              lineHeight={"tall"}
              as="h3"
              size={{ base: "lg", md: "xl" }}
              fontWeight={"extrabold"}
              color={"primary"}
              textAlign={"center"}
            >
              ZenQuest{" "}
              <Text px={2} color={"gray.700"}>
                {" "}
                Offer you
              </Text>
            </Heading>
            <HStack
              py={7}
             justifyContent={'center'}
              alignItems={"center"}
              spacing={4}
              width="100%"
            >
              <IconButton
                size={"lg"}
                bg={'green.200'}
                disabled
                _hover={{ cursor: 'arrow' }}
                aria-label={"data-privacy"}
                icon={<BiData color="green" />}
              />
              <Box>
                <Heading fontSize={'lg'} fontWeight={'bold'}>Data Privacy</Heading>
                <Text
                  lineHeight={"small"}
                  as="h3"
                  size="sm"
                  maxW={{ base: '200px', md: '400px'}}
                  fontWeight={"medium"}
                  color={"gray.500"}
                >
                  At ZenQuest, we take your data privacy seriously. Rest
                  assured, your personal information is handled with the utmost
                  care and security. Your trust means everything to us.
                </Text>
              </Box>
            </HStack>
            <HStack
              py={7}
             justifyContent={'center'}
              alignItems={"center"}
              spacing={4}
              width="100%"
            >
              <IconButton
                size={"lg"}
                bg={'purple.100'}
                disabled
                _hover={{ cursor: 'arrow' }}
                aria-label={"data-privacy"}
                icon={<BiBot color="purple" />}
              />
              <Box>
                <Heading fontSize={'lg'} fontWeight={'bold'}>No Spam</Heading>
                <Text
                  lineHeight={"small"}
                  as="h3"
                  size="sm"
                  maxW={{ base: '200px', md: '400px'}}
                  fontWeight={"medium"}
                  color={"gray.500"}
                >
                 { /* eslint-disable-next-line react/no-unescaped-entities */ }
                  At ZenQuest, we don't sell your data, and we don't spam you.
                </Text>
              </Box>
            </HStack>
          </Box>
        </Center>
      </Box>
    </Box>
  );
};

const ResponsiveCard = ({ imageSrc, title, description }: ValueType) => {
  return (
    <Box
      p={4}
      bg={useColorModeValue("white", "gray.800")}
      width={["100%", "300px"]}
    >
      <HStack align="flex-start" alignItems={"center"} spacing={4} width="100%">
        <Image
          src={imageSrc}
          alt={title}
          objectFit="contain"
          height="150px"
          width="120px"
        />
        <Box>
          <Heading
            lineHeight={"tall"}
            as="h3"
            size="md"
            fontWeight={"extrabold"}
            color={"primary"}
          >
            {title}
          </Heading>
        </Box>
      </HStack>
      <Text color="gray.500" mt={1} fontWeight={"semibold"} lineHeight={"tall"}>
        {description}
      </Text>
    </Box>
  );
};

const FeaturesCard = ({ imageSrc, title }: Features) => {
  return (
    <Box
      p={4}
      boxShadow={'sm'}
      borderRadius="md"
      bg={'blue.100'}
      width={["100%", "400px"]}
    >
      <Stack spacing={3} alignItems={"center"}>
        <Image
          src={imageSrc}
          alt={title}
          objectFit="contain"
          height="150px"
          width="120px"
        />
        <Heading
          as="h3"
          textAlign={"center"}
          fontSize={{ md: "lg", base: "md" }}
          fontWeight={"bold"}
          color={"gray.500"}
        >
          {title}
        </Heading>
      </Stack>
    </Box>
  );
};
