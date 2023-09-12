/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";
import {
  Box,
  Flex,
  Icon,
  IconButton,
  Text,
  Link,
  useColorModeValue,
} from "@chakra-ui/react";
import { type IconType } from "react-icons";
import { navItems } from "..";
import { useRouter } from "next/router";

const MobileNavItem = ({ icon, label }: { label: string; icon: IconType }) => {
  const router = useRouter();
  const getRoute = (() => {
    const transformPath = label.toLowerCase().replace(" ", "-");
    
    return `/space/${transformPath === 'home'? '': transformPath}`;
  })();
  const isActive = router.route === getRoute
  return (
    <Link
      href={getRoute}
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex direction="column" alignItems="center">
        <IconButton
          bg={isActive? 'green.100': 'inherit'}
          aria-label={label}
          icon={<Icon color={ isActive ? "sage.500": "gray.500"}  as={icon} />}
          variant="ghost"
          rounded="full"
          fontSize="2xl"
        />
        <Text fontSize="xs"  color={ isActive ? "sage.500": "gray.500"} fontWeight="bold" mt={1}>
          {label}
        </Text>
      </Flex>
    </Link>
  );
};

const MobileNavigation = () => {
  return (
    <Box
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      display={{ base: "visible", md: "none" }}
      bg={useColorModeValue("white", "gray.900")}
      boxShadow="md"
      p={2}
      zIndex={100}
    >
      <Flex justifyContent="space-around">
        {navItems.map((item, index) => (
          <MobileNavItem key={index} icon={item.icon} label={item.name} />
        ))}
      </Flex>
    </Box>
  );
};

export default MobileNavigation;
