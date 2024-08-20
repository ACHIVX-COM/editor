import styled from "styled-components";
import TextareaAutosize from "react-textarea-autosize";
import { Text } from "./system/Text";
import { border } from "./system/primitives";

export const TextInput = styled(Text).attrs((props) => ({
  as: props.multiline ? TextareaAutosize : "input",
}))`
  outline: none;
  box-shadow: none;
  ${border};
  display: inline-block;
  width: 100%;
  font-family: inherit;

  &::placeholder {
    font-size: 16px;
    font-family: inherit;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: -0.25px;
    color: #bfbfbf;
  }

  ${(props) => props.multiline && "resize: none"};
`;

TextInput.defaultProps = {
  border: "1px solid #d9d9d9",
  p: "var(--theme-spacings-xs) var(--theme-spacings-xs)",
};
