import { Box, Button, Text, CloseButton, HStack, Heading, Textarea, VStack } from "@chakra-ui/react";
import { useState } from "react";




const GoalStep = ({
    onSaveGoals,
    isSavingGoals,
  }: {
    onSaveGoals: (goals: string[]) => void;
    isSavingGoals: boolean;
  }) => {
    const [goals, setGoals] = useState<string[]>([]);
    const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  
    const addGoal = () => {
      if (goals.length < 3 && selectedGoal) {
        setGoals((prevGoals) => [selectedGoal?.trim(), ...prevGoals]);
        setSelectedGoal("");
      }
    };
  
    const removeGoal = (index: number) => {
      setGoals((prevGoals) => prevGoals.filter((_, i) => i !== index));
    };
  
    const saveGoals = () => {
      if (goals.length === 0) {
        alert("Please enter at least one goal.");
      } else {
        onSaveGoals(goals);
      }
    };
  
    // const handleChangeGoal = (index: number, value: string) => {
    //   setGoals((prevGoals) => {
    //     const newGoals = [...prevGoals];
    //     newGoals[index] = value;
    //     return newGoals;
    //   });
    // };
  
    const handleClickGoal = (index: number) => {
      const goal = goals[index] as string
      setSelectedGoal(goal);
    };
  
    return (
      <Box py={2}>
        <Heading fontWeight={"black"} fontSize={"xl"} color="sage.500">
          Quest Goal setup 
        </Heading>
  
        <Box
          bg="sage.50"
          p={3}
          mb={3}
          borderRadius="md"
          borderLeftWidth={3}
          borderLeftColor="sage.500"
          fontSize="sm"
          fontStyle="italic"
          color="sage.400"
          mt={2}
        >
          Note: Writing your goals is an effective way to turn your aspirations
          into reality. By applying the SMART technique (Specific, Measurable,
          Achievable, Relevant, Time-bound), you can create clear and attainable
          objectives. Happy goal-setting!
        </Box>
        <VStack spacing={4}>
          <Textarea
            placeholder="Edit selected goal..."
            value={selectedGoal || ""}
            isDisabled={goals.length === 3}
            onChange={(e) => setSelectedGoal(e.target.value)}
          />
          {goals?.map((goal, index) => (
            <Box key={index} w="100%" display="flex" alignItems="center">
              <Box
                flex="1"
                onClick={() => handleClickGoal(index)}
                cursor="pointer"
                display={"flex"}
                dir="column"
                alignItems={"center"}
                p={4}
                width={"100%"}
                border="1px solid #ddd"
                borderRadius="md"
                bg={selectedGoal === goals[index] ? "green.100" : "transparent"}
              >
                <Text width={"100%"}>{goal}</Text>
                <Box width={"100"} display={"flex"} justifySelf={"enc"}>
                  <CloseButton
                    color={"red.300"}
                    justifySelf={"end"}
                    onClick={() => removeGoal(index)}
                    ml={2}
                  />
                </Box>
              </Box>
            </Box>
          ))}
        </VStack>
        <HStack spacing={3} mt={5} justifyContent={"end"}>
          <Button colorScheme="sage" onClick={addGoal} mr={2}>
            Add Goal
          </Button>
          <Button
            isDisabled={goals.length <= 2}
            colorScheme="sage"
            onClick={saveGoals}
            isLoading={isSavingGoals}
          >
            Submit
          </Button>
        </HStack>
      </Box>
    );
  };

  export default GoalStep;