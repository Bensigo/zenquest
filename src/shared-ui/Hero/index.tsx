import { Flex, Stack, Heading, Button, Image, Box } from "@chakra-ui/react";


type Hero = {
    title: string,
    subtitle:string,
    image: string,
    ctaText: string,
    onClick: () => void
  };

export default function Hero({
    title,
    subtitle,
    image,
    onClick,
    ctaText,
    ...rest
  }: Hero) {
    return (
      <Flex
        align="center"
        justify={{ base: "center", md: "space-around", xl: "space-between" }}
        direction={{ base: "column-reverse", md: "row" }}
        wrap="nowrap"
        minH="70vh"
        mt={3}
        px={{ sm: 4, base: 8 }}
        mb={16}
        {...rest}
      >
        <Stack
          spacing={4}
          w={{ base: "80%", md: "40%" }}
          px={4}
          align={["center", "center", "flex-start", "flex-start"]}
        >
          <Heading
            as="h1"
            size="xl"
            fontWeight="bold"
            color="primary.800"

            textAlign={["center", "center", "left", "left"]}
          >
            {title}
          </Heading>
          <Heading
            as="h2"
            size="md"
            color="gray.600"

            opacity="0.8"
            fontWeight="semibold"
            lineHeight={'tall'}

            fontSize={{ md: 'lg', base: 'md'}}
            textAlign={["center", "center", "left", "left"]}
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
              onClick={onClick}
              py="4"
              px="4"
              lineHeight="1"
              size="md"
            >
              {ctaText}
            </Button>
        </Stack>
        <Box w={{ base: "100%", md: "50%" }} mb={{ base: 12, md: 0 }}>
          <Image alt='hero' src={image}  rounded="1rem" shadow="2xl" />
        </Box>
      </Flex>
    );
  }
  