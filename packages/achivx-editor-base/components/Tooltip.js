import React from "react";
import styled, { keyframes } from "styled-components";
import Popup from "reactjs-popup";
import { Box } from "./system/Box";

const appear = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.5);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

const TooltipLabel = styled(Box)`
  border: none;
  transform-origin: center top;
  animation: 200ms ${appear} var(--theme-timing-functions-standard);
`;

TooltipLabel.defaultProps = {
  py: "xxl",
  px: "xxs",
  bg: "white",
  color: "neutral-900",
  borderRadius: "4px",
};

const TriggerWrapper = React.forwardRef((props, ref) => {
  return React.cloneElement(props.children, {
    ref,
    onMouseEnter: props.onMouseEnter,
    onMouseLeave: props.onMouseLeave,
  });
});

export const Tooltip = (props) => {
  const { children, label, TriggerComponent = Box, ...other } = props;

  return (
    <Popup
      keepTooltipInside
      position="bottom center"
      trigger={
        <TriggerWrapper>
          <TriggerComponent>{children}</TriggerComponent>
        </TriggerWrapper>
      }
      on="hover"
      arrow={false}
      offsetY={10}
      {...other}
    >
      <TooltipLabel>{label}</TooltipLabel>
    </Popup>
  );
};
