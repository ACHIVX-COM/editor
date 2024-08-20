import { compose, system } from "@styled-system/core";
import { background } from "@styled-system/background";
import { border } from "@styled-system/border";
import { color } from "@styled-system/color";
import { flexbox } from "@styled-system/flexbox";
import { grid } from "@styled-system/grid";
import { layout } from "@styled-system/layout";
import { position } from "@styled-system/position";
import { shadow } from "@styled-system/shadow";
import { space } from "@styled-system/space";
import { typography as typographyBase } from "@styled-system/typography";
import { variant } from "@styled-system/variant";

const microdataProps = new Set([
  "itemscope",
  "itemprop",
  "itemid",
  "itemref",
  "itemtype",
]);

const createShouldForwardProp = (props) => {
  const toOmit = new Set(props);

  // https://styled-system.com/guides/build-a-box#css-prop
  toOmit.add("css");

  return (prop) => !toOmit.has(prop) || microdataProps.has(prop);
};

/**
 * Utility to simplify props forwarding for styled components https://styled-components.com/docs/api#shouldforwardprop
 *
 * @param args - Each argument is either a string which represents a prop name to omit, or a result of calling the compose util
 * @returns {{shouldForwardProp: (function(string, function(string): boolean): boolean)}}
 *
 * @example
 * <code>
 *   const omitByNames = omitProps('foo', 'bar');
 *   const omitByMixins = omitProps(
 *     compose(flexbox, grid),
 *     compose(color, background)
 *   );
 *   const omitByAll = omitProps(
 *     compose(flexbox, grid),
 *     compose(color, background),
 *     'foo',
 *     'bar'
 *   );
 *
 *   // all props related to flexbox, grid, color, background and "foo", "bar" ones won't be forwarded to div element
 *   const StyledDiv = styled.div.withConfig(omitByAll)`...`;
 * </code>
 */
const omitProps = (...args) => {
  const allProps = args.flatMap((arg) => {
    if (arg.propNames) {
      return arg.propNames;
    }

    if (typeof arg === "string") {
      return arg;
    }

    return [];
  });

  return {
    shouldForwardProp: createShouldForwardProp(allProps),
  };
};

export const typography = compose(
  typographyBase,
  system({
    textDecoration: true,
    textTransform: true,
    wordBreak: true,
    whiteSpace: true,
  }),
);

const screen = (breakpoint) => (props) => {
  return `@media only screen and ${props.theme.mediaQueries.screen[breakpoint]}`;
};

const pixelRatio = (ratio) => (props) => {
  return `@media ${props.theme.mediaQueries.pixelRatio[ratio]}`;
};

export const displayUp = (breakpoint) => (props) =>
  `@media only screen and (max-width: calc(${props.theme.breakpoints[breakpoint]} - 0.1px)) { display: none }`;

export const displayOnTouchDevice =
  (show = true) =>
  () =>
    `@media (pointer: ${show ? "fine" : "coarse"}) { display: none }`;

export const hideUp = (breakpoint) => (props) =>
  `${screen(breakpoint)(props)} { display: none }`;

export const hideBetween = (fromBreakpoint, toBreakpoint) => (props) =>
  `@media only screen and (max-width: calc(${props.theme.breakpoints[toBreakpoint]} - 0.1px)) and (min-width: calc(${props.theme.breakpoints[fromBreakpoint]} - 0.1px)) { display: none }`;

export {
  background,
  border,
  color,
  shadow,
  compose,
  omitProps,
  space,
  variant,
  layout,
  position,
  grid,
  flexbox,
  system,
  screen,
  pixelRatio,
};
