import React from "react";
import styled, { keyframes } from "styled-components";
import { Flex } from "./system/Box";
import { system } from "./system/primitives";

const circleMixin = system({
  stroke: {
    property: "stroke",
    scale: "colors",
  },
  fill: {
    property: "fill",
    scale: "colors",
  },
});

const Content = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
`;

const Circle = styled("div").attrs({
  as: "circle",
})`
  ${circleMixin};

  transform-origin: 50%;
  transform: rotate(-90deg);
`;

const RadialProgress = (props) => {
  const {
    fill,
    radius,
    shadow,
    thickness: strokeWidth,
    progressSlot,
    children,
  } = props;

  return (
    <Flex width={radius * 2} mx="auto" position="relative">
      <svg
        width={radius * 2}
        height={radius * 2}
        filter={shadow ? "drop-shadow(0 1px 2px rgba(0,0,0,0.15))" : null}
      >
        <Circle
          stroke={fill}
          fill="none"
          strokeWidth={strokeWidth}
          r={radius - strokeWidth}
          cx={radius}
          cy={radius}
        />
        {progressSlot}
      </svg>
      <Content>{children || null}</Content>
    </Flex>
  );
};

const rotation = keyframes`
  from {
    transform: rotate(-90deg);
  }
  to {
    transform: rotate(270deg);
  }
`;

const AnimatedCircle = styled(Circle).attrs({
  as: "circle",
})`
  transform-origin: 50%;
  animation: ${rotation} 1s linear infinite;
`;

export const RadialIndeterminate = (props) => {
  const {
    fill,
    shadow,
    bg,
    progressFill,
    radius,
    thickness: strokeWidth,
    children,
  } = props;

  const circumference = (radius - strokeWidth) * 2 * Math.PI;

  return (
    <RadialProgress
      fill={fill}
      radius={radius}
      shadow={shadow}
      thickness={strokeWidth}
      progressSlot={
        <AnimatedCircle
          stroke={progressFill}
          fill={bg}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={0.4 * circumference}
          r={radius - strokeWidth}
          cx={radius}
          cy={radius}
        />
      }
    >
      {children || null}
    </RadialProgress>
  );
};

RadialIndeterminate.defaultProps = {
  thickness: 4,
  radius: 40,
  fill: "neutral-200",
  bg: "transparent",
  progressFill: "primary-600",
};

export const RadialDeterminate = (props) => {
  const {
    fill,
    shadow,
    bg,
    progressFill,
    progress,
    radius,
    thickness: strokeWidth,
    children,
  } = props;

  const circumference = (radius - strokeWidth) * 2 * Math.PI;
  const offset = circumference - progress * circumference;

  return (
    <RadialProgress
      fill={fill}
      shadow={shadow}
      radius={radius}
      thickness={strokeWidth}
      progressSlot={
        <Circle
          fill={bg}
          stroke={progressFill}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          r={radius - strokeWidth}
          cx={radius}
          cy={radius}
        />
      }
    >
      {children}
    </RadialProgress>
  );
};

RadialDeterminate.defaultProps = {
  thickness: 4,
  progress: 0,
  radius: 40,
  fill: "neutral-200",
  bg: "transparent",
  progressFill: "primary-600",
};
