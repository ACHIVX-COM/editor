import styled, { css } from "styled-components";
import {
  variant,
  space,
  typography,
  color,
  compose,
  layout,
  omitProps,
} from "./primitives";

export const presets = variant({
  prop: "preset",
  variants: {
    h1: {
      fontWeight: "bold",
      fontSize: "56px",
      lineHeight: "72px",
      letterSpacing: "-0.25px",
    },
    h2: {
      fontWeight: "bold",
      fontSize: "30px",
      lineHeight: "48px",
      letterSpacing: "-0.2px",
    },
    h3: {
      fontWeight: "semibold",
      fontSize: "28px",
      lineHeight: "36px",
      letterSpacing: "0.25px",
    },
    h4: {
      fontWeight: "semibold",
      fontSize: "24px",
      lineHeight: "32px",
    },
    h5: {
      fontWeight: "semibold",
      fontSize: "22px",
      lineHeight: "28px",
    },
    h6: {
      fontWeight: "semibold",
      fontSize: "20px",
      lineHeight: "28px",
      letterSpacing: "-0.2px",
    },
    Body1: {
      fontWeight: "regular",
      fontSize: "16px",
      lineHeight: "24px",
      letterSpacing: "-0.25px",
    },
    Body2: {
      fontWeight: "regular",
      fontSize: "14px",
      lineHeight: "22px",
    },
    Body1Light: {
      fontWeight: "light",
      fontSize: "16px",
      lineHeight: "24px",
      letterSpacing: "-0.5px",
    },
    Body2Light: {
      fontWeight: "light",
      fontSize: "14px",
      lineHeight: "20px",
      letterSpacing: "-0.2px",
    },
    Body1Bold: {
      fontWeight: "bold",
      fontSize: "16px",
      lineHeight: "24px",
      letterSpacing: "-0.7px",
    },
    Body2Bold: {
      fontWeight: "bold",
      fontSize: "14px",
      lineHeight: "22px",
      letterSpacing: "-0.6px",
    },
    Body1Semibold: {
      fontWeight: "semibold",
      fontSize: "16px",
      lineHeight: "24px",
    },
    Body2Semibold: {
      fontWeight: "semibold",
      fontSize: "14px",
      lineHeight: "22px",
      letterSpacing: "-0.4px",
    },
    Caption: {
      fontWeight: "regular",
      fontSize: "12px",
      lineHeight: "16px",
      letterSpacing: "-0.1px",
    },
    CaptionBold: {
      fontWeight: "bold",
      fontSize: "12px",
      lineHeight: "16px",
      letterSpacing: "-0.4px",
    },
    CaptionMedium: {
      fontWeight: "medium",
      fontSize: "12px",
      lineHeight: "16px",
      letterSpacing: "-0.2px",
    },
    CaptionHeavy: {
      fontWeight: "heavy",
      fontSize: "12px",
      lineHeight: "16px",
    },
    Paragraph: {
      fontWeight: "regular",
      fontSize: "20px",
      lineHeight: "28px",
      letterSpacing: "-0.2px",
    },
    ParagraphLight: {
      fontWeight: "light",
      fontSize: "20px",
      lineHeight: "28px",
      letterSpacing: "-0.2px",
    },
  },
});

const truncateMixin = css`
  ${(props) =>
    props.truncate
      ? "text-overflow: ellipsis; overflow: hidden; white-space: nowrap;"
      : ""}
`;

const textMixin = compose(typography, space, color, layout, presets);

export const Text = styled("div").withConfig(omitProps(textMixin))`
  ${textMixin};
  ${truncateMixin};
`;
