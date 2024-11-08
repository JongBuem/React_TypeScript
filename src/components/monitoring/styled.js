import React from 'react';
import { Accordion } from '@mui/material';
import { styled } from '@mui/material/styles';

export const ContentAccordion = styled((props) => (
  <Accordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  '&:not(:last-child)': {
    borderTop: 0,
  },
  '&:before': {
    display: 'none',
  },
}));
