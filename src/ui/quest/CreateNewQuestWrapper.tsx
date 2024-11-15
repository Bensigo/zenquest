import {
  Box,
  HStack,
  Heading,
  IconButton,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { BiArrowBack, BiCheck, BiX } from "react-icons/bi";
import DatePicker from "react-datepicker";
import { useState } from "react";
import { addDays, format, isSameDay } from "date-fns";
import { formatInTimeZone } from 'date-fns-tz'
import { useRouter } from "next/router";
import { AddToCalendarButton } from "add-to-calendar-button-react";

import { api } from "@/utils/api";
import "react-datepicker/dist/react-datepicker.css";


const CreateNewQuestWrapper = () => {
  const start = addDays(new Date(), 7)
  const [selectedDate, setSelectedDate] = useState(start);
  const [isClose, setClose] = useState(false)
  const [goal, setGoal] = useState("");
  const toast = useToast();
  const router = useRouter();

  const timezone =  Intl.DateTimeFormat(undefined, { timeZoneName: "long"}).resolvedOptions().timeZone;
  const startDate = format(start, 'yyyy-MM-dd');

  const endDate = format(selectedDate, "yyyy-MM-dd")

  const { mutate, isLoading } = api.quest.createGoal.useMutation();

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleSubmit = () => {
    const today = new Date();
    const isSameDate = isSameDay(selectedDate, today);
    if (isSameDate) {
      toast({
        status: "error",
        description: "Invalid date",
        duration: 2000,
        isClosable: true,
      });
    }
    // make a api request and route to final setup
    mutate(
      {
        endDate: selectedDate,
        goal,
      },
      {
        onError: (err) => {
          toast({
            status: "error",
            description: err.message,
            duration: 3000,
            isClosable: true,
          });
        },
        onSuccess: (data) => {
          const route = `/space/quest/${data.id}/setup`;
          const gotoRoute = async () => await router.push(route);
          void gotoRoute();
        },
      }
    );
  };

  const goBack = () => {
    router.back()
  }

  return (
    <Box
      py={{ base: 2, md: 6}}
      mb={{ base: 8, md: 0}}
      height={"100%"}
      display={"flex"}
      flexDir="column"
    >
      <Box mt={4}  mb={3} >
          <IconButton  icon={<BiArrowBack />} size={'md'} color={'sage.500'} aria-label={"back-btn"} onClick={() => void goBack()}>
            Back
          </IconButton>  
      </Box>
      <Heading mb={4} fontWeight={"black"} fontSize={"2xl"} color="primary">
        Quest Goal setup
      </Heading>
      <Box>
       {!isClose && <Box
          bg="blue.100"
          p={6}
          mb={3}
          borderRadius="md"
          borderLeftWidth={3}
          borderLeftColor="blue.500"
          fontSize="sm"
          fontStyle="italic"
          color="blue.700"
          mt={2}
        >
          <Box display={'flex'} width={'100%'} justifyContent={'end'}>
          <IconButton onClick={() => setClose(true)} size={'sm'} aria-label={"close-info"}  color={'blue.400'} icon={<BiX />}  />
          </Box>
          
          Note:<br/> 
          1. Writing your goal is an effective way to turn your aspirations
          into reality. By applying the SMART technique (Specific, Measurable,
          Achievable, Relevant, Time-bound), you can create clear and attainable
          objectives. Happy goal-setting! <br />
          2. Incorporating your quest into your calendar enhances your chances of accomplishing them.

        </Box>}

        <Box>
          <Box display={"flex"} gap={2} flexDir={"column"}>
            <Textarea
              placeholder="write your goal here..."
              bg={"gray.200"}
              value={goal}
              _focus={{ border: 'none'}}
              onChange={(e) => setGoal(e.target.value)}
              h={"100px"}
              variant={"filled"}
            />
            <HStack spacing={3}>
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="MM/dd/yyyy"
                required
                className="chakra-input"
                customInput={
                  <Input
                    boxShadow={"sm"}
                    color="primary"
                    fontWeight={"bold"}
                    maxW={"200px"}
                    bg={"gray.200"}
                    variant={"filled"}
                  />
                }
              />
               
                {goal && <AddToCalendarButton
                   name={goal}
                   options={['Apple','Google']}
                   location="Zenquest"
                   startDate={startDate}
                   endDate={endDate}
                   hideCheckmark
                   label="Add quest to calendar"
                   size={"3|2|1"}
                   buttonStyle="flat"
                   timeZone={timezone}
                ></AddToCalendarButton>}
              
            </HStack>
            <Box width={"100%"} display={"flex"} justifyContent={"end"}>
              <IconButton
                isLoading={isLoading}
                onClick={handleSubmit}
                isDisabled={goal.length <= 3}
                variant={"solid"}
                colorScheme="sage"
                icon={<BiCheck />}
                aria-label="submit"
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateNewQuestWrapper;
