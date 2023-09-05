import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Divider,
  Stack,
} from '@chakra-ui/react';



type PropType = {
  onSave: (preference: string[]) => void,
  preferences: string[]
  isSaving: boolean
}

const defaultPreferences = [
  'Loving my body',
  'Love',
  'Being Thankful',
  'Positive thing',
  'Stress and Anxiety',
  'Happiness',
  'Personal growth',
  'Motivation',
  'courage'
];

export default function ContentPreference(props: PropType) {
  const { onSave, preferences, isSaving } = props;

  const [selectedPreferences, setSelectedPreferences] = useState<string[]>(preferences);

  const handlePreferenceToggle = (preference: string) => {
    setSelectedPreferences((prevSelected) =>
      prevSelected.includes(preference)
        ? prevSelected.filter((item) => item !== preference)
        : [...prevSelected, preference]
    );
  };

  const handleSubmit = () => {
    // Process the selected preferences here (e.g., send to the server)
    onSave(selectedPreferences)
  };

  return (
    <Box maxW="sm" p={4}>
      <FormControl>
        <FormLabel color={'gray.600'}>Select Your Preferences</FormLabel>
        <Stack spacing={[2]} direction={['row']} flexWrap="wrap">
          {defaultPreferences.map((preference) => (
            <Button
              key={preference}
              size="md"
              variant={selectedPreferences.includes(preference) ? 'solid' : 'outline'}
              colorScheme='gray'
              color='primary'
              onClick={() => handlePreferenceToggle(preference)}
            >
              {preference}
            </Button>
          ))}
        </Stack>
      </FormControl>
      <Divider mt={4} />
      <Button isLoading={isSaving} size={'md'} mt={4} color={'white'} bg={'sage.500'} onClick={handleSubmit}>
        Save
      </Button>
    </Box>
  );
}
