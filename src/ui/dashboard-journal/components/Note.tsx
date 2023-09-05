import React, { useRef, useState, type FormEvent, type MutableRefObject } from "react";
import { Box, Textarea, VStack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSession } from "next-auth/react";
import { type Session } from "next-auth";
import debounce from "lodash.debounce";
import useCustomNavigationConfirmation from "@/shared-hooks/useNavigationObserver";

import { JOURNAL_ID_KEY } from "../NewJournalWrapper";

type Note = {
  onSubmit: (data: string) => void;
  isSubmiting: boolean;
  isQuest: boolean;
  note?: string
  canFinish: (v: boolean) => void;
};

const schema = yup.object().shape({
  note: yup.string().required("Note is required").min(1),
});

const Note = ({
  onSubmit,
  isSubmiting,
  isQuest,
  note,
  canFinish,
}: Note) => {
  const session = useSession();
  const { data } = session;
  const { user } = data as Session;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [textareaHeight, setTextareaHeight] = useState<string>("auto");

  const  handleOnUserNavigate = () => {
    localStorage.removeItem(JOURNAL_ID_KEY)
 }

  const ShowExitModal = useCustomNavigationConfirmation({
    shouldPreventNavigation: !!textareaRef.current?.value?.length ?? false,
    onNavigate: handleOnUserNavigate,
  });


  
  const debouncedSaveNote = useRef(
    debounce((val: string) => {
      if (!isSubmiting) {
        onSubmit(val);
      }
    }, 500)
  ).current;

  const handleTextareaChange = () => {
   
    if (textareaRef.current) {
      if(textareaRef.current?.value.length > 10){
        canFinish(true)
      }
      setTextareaHeight("auto");
      const updatedHeight = `${textareaRef.current.scrollHeight}px`;
      setTextareaHeight(updatedHeight);
    }
    const text = textareaRef.current?.value;
    if ( text) {

      debouncedSaveNote(text);
    }
  };

  const { register } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      note: "",
    },
  });

  const name = user && user.name ? user.name : "";
  const firstName = name && name?.split(" ")[0];
  const placeholder = isQuest ? `Hello, ${firstName || ""}, you can start with graditute and what is blocking you from achieving your goal`
    : `Hello, ${firstName || ""}, lets keep it simple, how was your day?`
  



  const handleNoteSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(textareaRef.current?.value as string);
  };
  
  ShowExitModal
  return (
    <Box p={4} width={"100%"} mx="auto">
      
      <VStack spacing={4} align="stretch">
        <form style={{ width: "100%" }} onSubmit={(e) => void handleNoteSubmit(e)}>
          <Textarea
            {...register("note")}
            ref={textareaRef}
            placeholder={placeholder}
            defaultValue={note}
            size="lg"
            aria-multiline
            height={textareaHeight}
            color="primary"
            _placeholder={{
              color: "primary",
            }}
            width={"inherit"}
            
            fontWeight={"bold"}
            border={"none"}
            _focus={{
              border: "none",
              shadow: "none",
            }}
            autoFocus
            onChange={handleTextareaChange}
            sx={{
              "::first-line": {
                fontSize: "1.7rem",
                fontWeight: "bold",
                lineHeight: "2rem",
                marginBottom: "0.5rem",
              },
              overflow: "hidden",
              resize: "none",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              "&::-webkit-scrollbar": {
                width: "0px",
                background: "transparent",
                display: "none",
              },
            }}
          />
        </form>
      </VStack>
    </Box>
  );
};

export default Note;
