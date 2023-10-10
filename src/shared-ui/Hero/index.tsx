import { Flex, Stack, Heading, Button  } from "@chakra-ui/react";
import { track } from '@vercel/analytics';


type Hero = {
    title: string,
    subtitle:string,
    image: string,
    ctaText: string,
    onClick: () => void,
    onLoginClick: () => void
  };

export default function Hero({
    title,
    subtitle,
    image,
    onClick,
    onLoginClick,
    ctaText,
    ...rest
  }: Hero) {
    return (
      <Flex
        align="center"
        direction={'column'}
        wrap="nowrap"
        mt={14}
        px={{ sm: 4, base: 8 }}
        mb={16}
        {...rest}
      >
       
        <Stack
          spacing={4}
          w={{ base: "100%", md: "40%" }}
          px={4}
          align={"center"}
        >
          <Heading
            as="h1"
            size={{ base: 'xl', md: "2xl"}}
            fontWeight="bold"
            color="primary.800"
            textAlign={'center'}
          >
            {title}
          </Heading>
          <Heading
            as="h2"
            size="md"
            color="gray.600"
            width={'100%'}
            opacity="0.8"
            fontWeight="semibold"
            lineHeight={'tall'}

            fontSize={{ md: 'lg', base: 'md'}}
            textAlign={"center"}
          >
            {subtitle}
          </Heading>
            <Button
              bg="primary"
              _hover={{
                bg: "primary"
              }}
              color={"white"}
              borderRadius="8px"
              onClick={() => {
                track("SigupClicked")
                onClick()

              }}
              py="4"
              px="4"
              lineHeight="1"
              size="md"
            >
              {ctaText}
            </Button>
            <Button
              colorScheme="teal"
              variant={'ghost'}
              borderRadius="8px"
              onClick={() => {
                onLoginClick()
                track("SignClicked")
              }}
              py="4"
              px="8"
              lineHeight="1"
              size="md"
            >
              Sign In
            </Button>
        </Stack>
      </Flex>
    );
  }
  