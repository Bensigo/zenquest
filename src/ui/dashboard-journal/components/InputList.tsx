import React, { useState } from "react";
import {
  Box,
  Input,
  Button,
  UnorderedList,
  ListItem,
  Heading,
} from "@chakra-ui/react";

export type InputList = {
  title: string;
  onAdd: (input: string) => void;
  onChange: (input: string) => void;
  items: string[];
  input: string;
  placeholder: string;
};

const InputList: React.FC<InputList> = ({
  placeholder,
  title,
  onAdd,
  onChange,
  items: inputs,
  input,
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <Box maxW="400px" m="auto">
      <Heading
        my={2}
        color="primary"
        as={"h4"}
        fontSize={{ base: "sm", md: "md" }}
      >
        {title}
      </Heading>
      <Box display={"flex"} dir="row" gap={2} alignItems={"center"}>
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder={placeholder}
          color={'primary'}
          onKeyUp={(e) => {
            if (e.key.toLowerCase() === 'enter'){
                onAdd(input);
            }
          }}
          border={0}
          shadow={0}
          _placeholder={{
            color: "primary",
          }}
          _focus={{
            border: "none",
            shadow: "none"
          }}
        />
        <Button  bg="primary" onClick={() => void onAdd(input)}>
          Add
        </Button>
      </Box>

      {/* Display the list of inputs */}
      <UnorderedList mt={4}>
        {inputs.map((input, index) => (
          <ListItem color='primary' key={index}>{input}</ListItem>
        ))}
      </UnorderedList>
    </Box>
  );
};

export default InputList;
