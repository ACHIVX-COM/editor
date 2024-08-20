import styled from "styled-components";
import {
  color,
  background,
  flexbox,
  layout,
  grid,
  position,
  border,
  space,
  shadow,
  compose,
  omitProps,
} from "./primitives";

const box = compose(
  color,
  background,
  border,
  flexbox,
  grid,
  layout,
  position,
  space,
  shadow,
);

export const Box = styled("div").withConfig(omitProps(box))`
  ${box};
`;

export const Flex = styled(Box).attrs((props) => ({
  display: props.inline ? "inline-flex" : "flex",
}))``;

export const Grid = styled(Box).attrs((props) => ({
  display: props.inline ? "inline-grid" : "grid",
}))``;
