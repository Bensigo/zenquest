import React from 'react';
import { Text } from '@chakra-ui/react';
import { TypeAnimation } from 'react-type-animation';

const AutoTyping = ({ text , onDone }: { text:  string, onDone: () => void }) => {
  return (
    <Text mt={3} color='primary' fontSize={{ base: 'md', md: 'larger'}} fontWeight="bold">
      <TypeAnimation cursor={false}  key={text} sequence={[text, 1000, onDone]} repeat={0} wrapper="span" />
    </Text>
  );
};

export default AutoTyping;
