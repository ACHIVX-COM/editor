import React, { cloneElement, Children } from "react";
import styled from "styled-components";
import { nanoid } from "nanoid";
import { Text } from "../system/Text";
import { Box } from "../system/Box";
import { variant as variantStyled } from "../system/primitives";
import { fromFinalFormFieldMapper } from "./finalFormFieldMapper";

const messageVariant = variantStyled({
  prop: "variant",
  variants: {
    default: { color: "var(--theme-colors-neutral-500)" },
    warning: { color: "var(--theme-colors-yellow-500)" },
    error: { color: "var(--theme-colors-red-500)" },
  },
});

const Message = styled(Text).attrs({ preset: "Body2" })`
  margin: 0.25rem 0 0;

  ${messageVariant};
`;

export const FieldLayout = ({ variant, message, label, children }) => {
  const inputId = `field-layout-${nanoid()}-input`;

  const filedEl = Children.only(children);

  return (
    <Box width={1}>
      {Boolean(label) && (
        <Text preset="Body2" as="label" htmlFor={inputId}>
          {label}
        </Text>
      )}

      {cloneElement(filedEl, {
        id: inputId,
        variant,
      })}

      {Boolean(message) && <Message variant={variant}>{message}</Message>}
    </Box>
  );
};

FieldLayout.defaultProps = { variant: "default" };

export const FormFieldLayout = ({
  label,
  children,
  input,
  meta,
  t,
  ...rest
}) => {
  const { message, variant } = fromFinalFormFieldMapper({ input, meta, t });
  const inputEl = Children.only(children);

  return (
    <FieldLayout label={label} message={message} variant={variant}>
      {cloneElement(inputEl, { ...input, ...rest })}
    </FieldLayout>
  );
};
