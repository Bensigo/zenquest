/* eslint-disable react/no-unescaped-entities */
import { Heading, Box } from "@chakra-ui/react";
import { InfoNote } from "./InfoNote";



const InfoStep = () => {
    return (
      <Box py={2}>
        <Heading fontWeight={"black"} fontSize={"xl"} color="sage.500">
          Quest Insight
        </Heading>
  
        <InfoNote>
          "Quest" is a transformative month-long ceremony that accelerates goal
          achievement. you set personalized goals and craft empowering
          affirmations. Leveraging cutting-edge technology and mindfulness
          technique, a custom quest is generated for you. This guided journey
          maximizes success through intentional actions, challenges, and
          unwavering support. The ceremony fosters personal growth, resilience,
          and mindfulness. The community aspect provides a powerful network of
          encouragement. Beyond the month, "Quest" ignites a lifelong commitment
          to growth and fulfillment. Experience the profound impact of this
          empowering ceremony, empowering you to fulfill your dreams and live with
          purpose.
        </InfoNote>
      </Box>
    );
  };

  export default InfoStep