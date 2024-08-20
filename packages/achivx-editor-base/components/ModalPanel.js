import React from "react";
import styled from "styled-components";
import { Flex, Grid } from "@achivx/editor-base/components/system/Box";

const Root = styled(Flex).attrs({
  flexDirection: "column",
  alignItems: { _: "stretch", md: "center" },
  pt: "xxl-7",
  pb: { _: "s", md: "xxl-7" },
  px: { _: "s", md: "xxl-5" },
  justifyContent: { md: "space-between" },
  height: "100%",
  minWidth: { md: "464px" },
})``;

const ContentWrapper = styled(Flex).attrs({
  flexDirection: "column",
  alignItems: "center",
  maxWidth: { md: "560px" },
})``;

const ButtonsWrapper = styled(Grid).attrs({
  gridGap: "xxl-2",
  alignItems: "center",
  width: { _: "100%", md: "65%" },
})`
  & > * {
    width: 100%;
  }
`;

/**
 * Content of a standard modal with few components horizontally aligned
 * by center and one or few buttons at bottom.
 *
 * On small (mobile) screens the button(s) are placed at the bottom of the
 * screen when content isn't large enough to shift them there or lower.
 */
export const ModalPanel = ({ children, buttonsSlot, ...rest }) => (
  <Root {...rest}>
    <ContentWrapper>{children}</ContentWrapper>
    <ButtonsWrapper>{buttonsSlot}</ButtonsWrapper>
  </Root>
);
