import { Box, Text, Icon, Tooltip } from '@chakra-ui/react';
import { FaTrophy, FaMedal } from 'react-icons/fa';

interface LevelDisplayProps {
  score: number;
  level: 'Eden' | 'Alpha' | 'Omega' | 'Titan' | 'Zenith' | 'GodMode';
}

const LevelDisplay: React.FC<LevelDisplayProps> = ({ score, level }) => {
  const levelIcons: { [key: string]: JSX.Element } = {
    Eden: <FaTrophy color='gold' />,
    Alpha: <FaTrophy color='gold' />,
    Omega: <FaTrophy color='gold' />,
    Titan: <FaMedal color='gold' />,
    Zenith: <FaMedal color='gold' />,
    GodMode: <FaMedal  color='gold' />,
  };

  return (
    <Tooltip label={`Level: ${level} - Score: ${score}`} fontSize="sm">
      <Box
        display="flex"
        px={2}
        py={1}
    
        zIndex={-100}
        flexDir={'row'}
        gap={2}
        alignItems={'center'}
  
        textAlign="center"
      >
        <Icon as={() => levelIcons[level]} boxSize={12}  mb={2} />
        <Text fontSize="md" fontWeight="bold" color={'sage.400'}>
          {level}
        </Text>
        <Text color={'sage.400'} fontSize="sm" display={{ base: 'none', md: 'inherit' }}>Score: {score}</Text>
      </Box>
    </Tooltip>
  );
};

export default LevelDisplay;
