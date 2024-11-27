import React from "react";
import { Accordion, AccordionProps } from "@mui/material";
import { styled } from "@mui/material/styles";

// AccordionProps를 확장한 타입으로 ContentAccordion 정의
export const ContentAccordion = styled((props: AccordionProps) => (
  <Accordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  "&:not(:last-child)": {
    borderTop: 0,
  },
  "&:before": {
    display: "none",
  },
}));
