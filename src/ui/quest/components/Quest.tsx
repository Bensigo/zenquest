import { api } from "@/utils/api";
import {
  useSteps,
  Image,
  Stepper,
  Text,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Heading,
  Stack,
  StepSeparator,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { BiLock, BiLockOpen } from "react-icons/bi";

type CardProps = {
  title: string;
  description: string;
  activeStep: number;
  path: string;
  imageUrl: string;
  id: string
};

const QuestCard = (props: CardProps) => {
  const router = useRouter();
  const toast = useToast()

  const { mutate, isLoading } = api.activity.startQuestActivity.useMutation();

  const getStep = () => {
    if (props.title === "Affirmations") return 2;
    if (props.title === "Chat") return 3;
    if (props.title === "Activity") return 4;
    if (props.title === "Journaling") return 5;
    return 1;
  };


  const getType = (type: string) => {
    if(type === "Breathing Meditation") return 'DEEP_BREATH'
    if (type === "Affirmations") return 'Affirmation';
    if (type === "Chat") return 'Chat';
    if (type === "Activity") return 'Activity';
    if (type === "Journaling") return 'Journaling';
  }

  const goToTask =  () => {
    const type = getType(props.title)
    if (!type)return;
    mutate(
      { type, id: props.id },
      {
        onSuccess:  () => {
          const goto =  async (path: string) => await router.push(path);
          if (props.title !== "Journaling") {
            const path = router.asPath + props.path;
            void goto(path)
          } else {
            void goto(`${props.path}&questId=${props.id}`)
          }
        },
        onError: (err) => {
            toast({
              description: err.message,
              isClosable: true,
              duration: 3000,
              status: 'error'
            })
        }
      },
    );
  };

  const isActive = getStep() === props.activeStep;
  const isBlurred = !isActive;
  const img = props.imageUrl;
  return (
    <Card
      maxW={{ base: "sm", md: "lg" }}
      direction={{ md: "row", base: "column-reverse" }}
      marginBottom={{ md: 4, base: "80px" }}
      mt={4}
      justifySelf={{ base: "center" }}
     
    >
      <Box flex="1">
        <CardBody>
          <Stack spacing={1}>
            {isActive ? (
              <BiLockOpen size={"18px"} color="#667a62" />
            ) : (
              <BiLock size={"18px"} color="#667a62" />
            )}
            <Heading size="md" color={"sage.500"}>
              {props.title}
            </Heading>
            <Text py="1" color={"sage.400"}>
              {props.description}
            </Text>
          </Stack>
        </CardBody>
        <CardFooter>
          <Button
            isLoading={isLoading}
            onClick={() => void goToTask()}
            variant="solid"
            colorScheme="sage"
            isDisabled={!isActive}
          >
            Start
          </Button>
          {/* <QuestButton /> */}
        </CardFooter>
      </Box>
      <Box
        display="flex"
        maxWidth={{ base: "100%", sm: "150px" }}
        p={5}
        justifySelf={{ base: "center", sm: "flex-start" }}
        maxH={{ base: '120px', md: 'auto'}}
      >
        <Image
          w="100%"
          h="auto"
          maxWidth="100%"
          borderRadius="sm"
          objectFit={{ base: "contain" }}
          src={img}
          alt={props.title}
        />
      </Box>
    </Card>
  );
};

type Step = {
  Component: (props: CardProps) => JSX.Element;
  title: string;
  description: string;
  path: string;
  imageUrl: string;
};
const steps: Step[] = [
  {
    title: "Breathing Meditation",
    description:
      "2 min breathing meditation  for starting your quest for the day.",
    Component: (props: CardProps) => <QuestCard {...props} />,
    path: "/breath",
    imageUrl: "/space/breathing.svg",
  },
  {
    title: "Affirmations",
    description: "Curated affirmations, that matches with your goal.",
    Component: (props: CardProps) => <QuestCard {...props} />,
    path: "/affirmations",
    imageUrl: "/space/affirmation.svg",
  },
  {
    title: "Chat",
    description:
      "Connect with Ada to discuss your goal in a chat session.",
    Component: (props: CardProps) => <QuestCard {...props} />,
    path: "/chat",
    imageUrl: "/space/chat.svg",
  },
  {
    title: "Activity",
    description: "Recommended activities tailored to propel you closer to your goal.",
    Component: (props: CardProps) => <QuestCard {...props} />,
    path: "/activities",
    imageUrl: "/space/activity.svg",
  },
  {
    title: "Journaling",
    description: "Documenting your day is a good pratice of accounatability and reflection.",
    Component: (props: CardProps) => <QuestCard {...props} />,
    path: "/space/journal/new?type=plain&from=quest",
    imageUrl: "/space/journal.svg",
  },
];

export function Quest({ id, step }: { id: string, step: number }) {

  const { activeStep } = useSteps({
    index: step + 1,
    count: steps.length,
  });

  const Component = steps[activeStep - 1]?.Component as (
    props: CardProps
  ) => JSX.Element;

  return (
    <Box py={4}>
      <Stepper
        index={activeStep}
        colorScheme="sage"
        orientation="vertical"
        height="400px"
        gap="0"
      >
        {steps?.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>

            <Box flexShrink="1" py={4}>
              {/* <StepTitle>{step.title}</StepTitle>
              <StepDescription></StepDescription> */}
              {step && (
                <Component
                  activeStep={activeStep}
                  title={step.title}
                  description={step.description}
                  imageUrl={step.imageUrl}
                  path={step.path}
                  id={id}
                />
              )}
            </Box>

            <StepSeparator />
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
