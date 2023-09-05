import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  Button,
  Box,
  Stepper,
  useSteps,
  Step,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepStatus,
  StepDescription,
  StepTitle,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { api } from "@/utils/api";
import AffirmationStep from "./AffirmationStep";
import InfoStep from "./InfoStep";
import GoalStep from "./GoalStep";

type PropType = {
  isOpen: boolean;
  onClose?: () => void;
  onConfirm?: (goals: string[]) => void;
};



 type StepProp = { 
  suggestedAffirmations: string[],
  onSubmit: (vals: string[]) => void,
  onSaveGoals: (goals: string[]) => void;
  isSavingGoals: boolean;
  onSubmitAffirmations: (val: string[]) => void
  isSavingAffirmation: boolean;
}


const steps = [
  {
    title: "Info",
    description: "Quest insight",
    component: () => <InfoStep />,
  },
  {
    title: "Goals",
    description: "Wish to achieve",
    component: (props: StepProp) => <GoalStep {...props} />,
  },
  {
    title: "Affirmation",
    description: "daily Affrimation",
    component: (props: StepProp) => <AffirmationStep {...props} />,
  },
];

const QuestSetup = ({ isOpen }: PropType) => {
  const ctx = api.useContext();
  const toast = useToast()

  const hasReadQuest = !!localStorage.getItem("hasReadQuest");

  const { mutate: saveAffirmationCategories, isLoading: isSavingQuestAffirmation } = api.quest.updatedQuestAffirmation.useMutation()


  const { mutate, isLoading: isSavingGoals } =
    api.quest.createGoals.useMutation();


  const { data: quest, isFetching, isLoading: isLoadingActiveQuest } =
    api.quest.getActiveQuest.useQuery();

  const getIndex = () => {
    if (quest?.suggestedAffirmationCategories) return 3;
    if (hasReadQuest) return 2;
    return 1;
  };

  const { activeStep, setActiveStep } = useSteps({
    index: getIndex(),
    count: steps.length,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const StepBody = steps[activeStep - 1]?.component  as (props: any) => JSX.Element;

  const handleSaveGoals = (goals: string[]) => {
    mutate(
      {
        goals,
      },{
        onSuccess: ()  => {
          setActiveStep((val) => val + 1);
        },
        onError: (err) => {
          toast({
            description: err.message,
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        }
      }
    );
    
  };

  const handleSaveAffrirmations = (categories: string[]) => {
    saveAffirmationCategories({
      categories
    },{
      onSuccess: () => {
        const fetch = async() => ctx.quest.getActiveQuest.refetch()
       void fetch();
      }
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={() => {
      //
    }}>
      <ModalOverlay />
      <ModalContent p={{ base: 4, md: 8 }}>
        <Stepper index={activeStep} colorScheme="sage">
          {steps.map((step, index) => (
            <Step key={index}>
              <StepIndicator>
                <StepStatus
                  complete={<StepIcon />}
                  incomplete={<StepNumber />}
                  active={<StepNumber />}
                />
              </StepIndicator>

              <Box flexShrink="0">
                <StepTitle style={{ fontSize: 14 }}>{step.title}</StepTitle>
                <StepDescription style={{ fontSize: 12 }}>
                  {step.description}
                </StepDescription>
              </Box>
            </Step>
          ))}
        </Stepper>
        <Box mt={3}>
          <StepBody
            onSaveGoals={handleSaveGoals}
            isSavingGoals={isLoadingActiveQuest || isSavingGoals} 
            suggestedAffirmations={quest?.suggestedAffirmationCategories || []}
            onSubmitAffirmations={handleSaveAffrirmations}
            isSavingAffirmations={isSavingQuestAffirmation}
          />
        </Box>
        {activeStep === 1 && (
          <ModalFooter>
            <HStack spacing={3}>
              <Button
                colorScheme="sage"
                onClick={() => {
                  localStorage.setItem("hasReadQuest", "true");
                  setActiveStep((prev) => prev + 1);
                }}
              >
                Next
              </Button>
            </HStack>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};

export default QuestSetup;
