

import { Box } from '@chakra-ui/react'
import React from 'react'

export const InfoNote = (props: { children: any}) => {
  const { children, ...rest } = props;
  return (
    <Box
    {...rest}
    bg="sage.50"
    p={3}
    borderRadius="md"
    borderLeftWidth={3}
    borderLeftColor="sage.500"
    fontSize="sm"
    fontStyle="italic"
    color="sage.500"
    mt={2}
  >    {children}
    </Box>
  )
}
