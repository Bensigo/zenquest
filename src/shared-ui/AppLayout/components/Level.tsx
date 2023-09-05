import { Box, Flex, Text, Icon, Tooltip } from '@chakra-ui/react';
import { FaTrophy, FaMedal } from 'react-icons/fa';

interface LevelDisplayProps {
  score: number;
  level: 'Eden' | 'Alpha' | 'Omega' | 'Titan' | 'Zenith' | 'GodMode';
}

const LevelDisplay: React.FC<LevelDisplayProps> = ({ score, level }) => {
  const levelIcons: { [key: string]: JSX.Element } = {
    Eden: <FaTrophy color='yellow' />,
    Alpha: <FaTrophy color='yellow' />,
    Omega: <FaTrophy color='yellow' />,
    Titan: <FaMedal color='yellow' />,
    Zenith: <FaMedal color='yellow' />,
    GodMode: <FaMedal  color='yellow' />,
  };

  return (
    <Tooltip label={`Level: ${level} - Score: ${score}`} fontSize="sm">
      <Box
        display="flex"
        px={2}
        py={1}
        bg="green.300"
        flexDir={'row'}
        gap={2}
        alignItems={'center'}
        color="white"
        border="2px solid sage"
        borderRadius="lg"
        boxShadow="sm"
        textAlign="center"
      >
        <Icon as={() => levelIcons[level]} boxSize={12} color="yellow" mb={2} />
        <Text fontSize="md" fontWeight="bold">
          {level}
        </Text>
        <Text fontSize="sm" display={{ base: 'none', md: 'inherit' }}>Score: {score}</Text>
      </Box>
    </Tooltip>
  );
};

export default LevelDisplay;
