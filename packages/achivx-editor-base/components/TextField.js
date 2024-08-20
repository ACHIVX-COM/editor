import styled, { css } from "styled-components";
import { presets } from "./system/Text";
import { variant, space, omitProps } from "./system/primitives";

const sizeVariant = variant({
  prop: "size",
  variants: {
    large: {
      p: "7px 12px",
      ...presets({ preset: "Body1" }),
    },
    medium: { p: "4px 12px", ...presets({ preset: "Body2" }) },
    small: { p: "0 8px", ...presets({ preset: "Body2" }) },
  },
});

const colorVariant = variant({
  prop: "variant",
  variants: {
    default: {
      borderColor: "var(--theme-colors-neutral-300)",
      "&:hover, &:focus": {
        borderColor: "var(--theme-colors-blue-300)",
      },
      "&:focus": {
        boxShadow: "0px 0px 4px var(--theme-colors-blue-300)",
      },
      "&:disabled": {
        bg: "var(--theme-colors-neutral-100)",
        borderColor: "var(--theme-colors-neutral-300)",
      },
    },
    warning: {
      borderColor: "var(--theme-colors-yellow-300)",
      "&:focus": {
        boxShadow: "0px 0px 4px var(--theme-colors-yellow-300)",
      },
      "&:disabled": {
        bg: "var(--theme-colors-neutral-100)",
      },
    },
    error: {
      borderColor: "var(--theme-colors-red-500)",
      "&:focus": {
        boxShadow: "0px 0px 4px var(--theme-colors-red-500)",
      },
      "&:disabled": {
        bg: "var(--theme-colors-neutral-100)",
      },
    },
  },
});

const textFieldMixin = css`
  display: inline-block;
  width: 100%;
  border-radius: 2px;
  border: 1px solid;
  outline: none;
`;

export const TextField = styled("input").withConfig(omitProps("width"))`
  ${textFieldMixin}
  ${sizeVariant}
  ${colorVariant}
  ${space}

  ${(props) => props.multiline && "resize: none"};

  &::placeholder {
    color: var(--theme-colors-neutral-400);
  }
`;

TextField.defaultProps = { size: "medium", variant: "default" };

export const SelectInput = styled.select`
  ${textFieldMixin}
  ${sizeVariant}
  ${colorVariant}
  ${space}
`;
SelectInput.defaultProps = { size: "medium", variant: "default" };
