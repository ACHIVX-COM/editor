import React, { useRef } from "react";
import Popup from "reactjs-popup";
import styled from "styled-components";
import noop from "lodash/noop";
import Transition from "react-transition-group/Transition";
import { Box, Flex } from "./system/Box";
import { Icon, icons } from "./Icon";
import { VisuallyHidden } from "./VisuallyHidden";
import { screen } from "./system/primitives";
import { Text } from "./system/Text";
import { useLockScroll } from "../utils/useLockScroll";

const CloseButtonRoot = styled.button`
  appearance: none;
  display: inline-grid;
  justify-content: center;
  align-items: center;
  grid-column-gap: var(--theme-spacings-xxs);
  grid-auto-flow: column;

  font-family: inherit;
  font-size: 14px;
  line-height: 22px;
  font-weight: 400;

  transition-property: color, border-color, background-color;
  transition-duration: 0.3s;
  transition-timing-function: ease;

  background-color: initial;
  color: var(--theme-colors-neutral-800);
  border: 1px solid #ffffff00;
  &:hover,
  &:focus {
    color: var(--theme-colors-primary-600);
  }
  &:active {
    background-color: var(--theme-colors-neutral-100);
    border-color: var(--theme-colors-neutral-100);
    color: var(--theme-colors-primary-800);
  }

  position: absolute;
  top: var(--theme-spacings-s);
  right: var(--theme-spacings-s);
`;

const ModalRoot = styled(Popup)`
  &-overlay {
    background-color: #21212180;
    overflow-y: overlay;
  }

  &-content {
    width: 100%;
    height: 100%;

    ${screen("md")} {
      width: fit-content;
      height: unset;
    }
  }
`;

const ModalHeaderButtonBase = styled.button`
  appearance: none;
  border: none;
  background: transparent;
  padding: 0;
  margin: 0;
  position: absolute;
  right: ${({ right }) => right};
  left: ${({ left }) => left};
`;

export const ModalHeaderButton = ({
  icon = icons["chevron-left"],
  visuallyHidden = "Close",
  left = "var(--theme-spacings-xxl-2)",
  children,
  ...rest
}) => (
  <ModalHeaderButtonBase {...rest} left={left}>
    {icon && <Icon icon={icon} size="24px" />}
    {children}
    <VisuallyHidden>{visuallyHidden}</VisuallyHidden>
  </ModalHeaderButtonBase>
);

const MobileModalHeaderWrapper = styled(Flex).attrs({
  alignItems: "baseline",
  justifyContent: "center",
  py: "xxl-2",
  px: "s",
  borderBottom: "1px solid",
  borderColor: "neutral-300",
})``;

export const MobileModalHeader = ({ title, onClick, children, ...rest }) => (
  <MobileModalHeaderWrapper {...rest}>
    <ModalHeaderButton onClick={onClick} />
    <Text preset="Body1Bold">{title}</Text>
    {children}
  </MobileModalHeaderWrapper>
);

export const CloseButton = ({ onClick, ...rest }) => {
  return (
    <CloseButtonRoot {...rest} onClick={onClick}>
      <Icon icon={icons.cross} />
      <VisuallyHidden>Close</VisuallyHidden>
    </CloseButtonRoot>
  );
};

const Content = styled(Box).attrs({
  position: { _: "absolute", md: "relative" },
  backgroundColor: "neutral-000",
  padding: 0,
  width: "unset",
  overflowY: "auto",
})`
  inset: 0;
`;

export const Modal = ({
  isOpen,
  children,
  animation,
  onDismiss = noop,
  isClosable = false,
  zIndex,
  ...rest
}) => {
  const duration = 400;
  const modalRef = useRef();

  const [mount] = useLockScroll({ isOpen });

  // do not render on server
  if (!mount) {
    return null;
  }

  if (!animation) {
    return (
      <ModalRoot
        ref={modalRef}
        modal
        nested
        open={isOpen}
        onClose={onDismiss}
        contentStyle={{ zIndex }}
        closeOnDocumentClick={isClosable}
        closeOnEscape={isClosable}
      >
        <Content {...rest}>
          {isClosable ? (
            <CloseButton onClick={() => modalRef.current.close()} />
          ) : null}
          {children}
        </Content>
      </ModalRoot>
    );
  }

  return (
    <Transition
      in={isOpen}
      timeout={{ exit: duration }}
      appear={isOpen}
      mountOnEnter
      unmountOnExit
    >
      {(state) => (
        <ModalRoot
          ref={modalRef}
          modal
          nested
          open={isOpen}
          onClose={onDismiss}
          style={{ zIndex }}
          closeOnDocumentClick={isClosable}
          closeOnEscape={isClosable}
        >
          <Content
            {...rest}
            style={{
              transition: `all ${duration}ms ease-out`,
              ...animation.from,
              ...animation[state],
            }}
          >
            {children}
          </Content>
        </ModalRoot>
      )}
    </Transition>
  );
};

export const animations = {
  SLIDE_LEFT: {
    from: { transform: "translate3d(90%, 0, 0)" },
    entered: { transform: "translate3d(0%, 0, 0)" },
    exiting: { transform: "translate3d(100%, 0, 0)" },
  },
  SLIDE_RIGHT: {
    from: { transform: "translate3d(-90%, 0, 0)" },
    entered: { transform: "translate3d(0%, 0, 0)" },
    exiting: { transform: "translate3d(-100%, 0, 0)" },
  },
  SLIDE_DOWN: {
    from: { transform: "translate3d(0, -90%, 0)" },
    entered: { transform: "translate3d(0, 0%, 0)" },
    exiting: { transform: "translate3d(0, -100%, 0)" },
  },
  SLIDE_UP: {
    from: { transform: "translate3d(0, 90%, 0)" },
    entered: { transform: "translate3d(0, 0%, 0)" },
    exiting: { transform: "translate3d(0, 100%, 0)" },
  },
  FADE: {
    from: { opacity: 0 },
    entered: { opacity: 1 },
    exiting: { opacity: 0 },
  },
};
