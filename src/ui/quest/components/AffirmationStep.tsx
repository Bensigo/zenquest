import { Box, Button, Flex, FormControl, Input } from "@chakra-ui/react";
import { useState } from 'react'
const AffirmationSetp = ({ suggestedAffirmations, onSubmitAffirmations, isSavingAffirmation }: { suggestedAffirmations: string[], onSubmitAffirmations: (vals: string[]) => void, isSavingAffirmation: boolean}) => {

    const [affirmations, setAffirmations] = useState<string[]>(suggestedAffirmations)

  
    const handleInputChange = (index: number, value: string) => {
      const newAffirmations = [...affirmations];
      newAffirmations[index] = value;
      setAffirmations(newAffirmations);
    };

  
  
    const handleSubmit = () => {
        if (affirmations.length === 3 && affirmations ){
            onSubmitAffirmations(affirmations);
        }
    
    };
  
    return (
      
      <Box p={4}>
          <Box
          bg="blue.100"
          p={3}
          borderRadius="md"
          borderLeftWidth={3}
          borderLeftColor="blue.400"
          fontSize="sm"
          fontStyle="italic"
          color="blue.600"
          mt={2}
        >
          Note: you can edit the suggested categories for your affirmations to match your goals before saving it.
        </Box>
     
        <Flex flexDir="column">
          {affirmations?.map((affirmation, index) => (
            <FormControl key={index} mt={4}>
              <Input
                value={affirmation}
                onChange={(e) => handleInputChange(index, e.target.value)}
              />
            </FormControl>
          ))}
          <Button isLoading={isSavingAffirmation}  disabled={ affirmations && affirmations?.length <= 6} mt={4} colorScheme="sage" onClick={handleSubmit}>
            Submit
          </Button>
        </Flex>
  
      </Box>
    );
  };

  export default AffirmationSetp