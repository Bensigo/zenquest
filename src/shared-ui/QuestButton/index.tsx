import { Button } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const starVariants = {
  orbit: (i: number) => ({
    x: ['0%', '100%', '0%'],
    y: ['0%', '50%', '0%'],
    rotate: [0, 90, 180, 270, 360],
    transition: {
      repeat: Infinity,
      duration: 8 + i * 2,
      ease: 'linear',
    },
  }),
};

const QuestButton: React.FC = () => {
  return (
    <Button position="relative" colorScheme='sage'>
      <motion.div
        className="stars-container"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      >
        {[...Array(10)].map((_, index) => (
          <motion.span
            key={index}
            className="star"
            variants={starVariants.orbit(index)}
            initial="orbit"
            animate="orbit"
          >
            ⭐️
          </motion.span>
        ))}
      </motion.div>
      Click Me!
    </Button>
  );
};

export default QuestButton;
