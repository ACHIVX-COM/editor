import styled from "styled-components";

export const Button = styled.button`
  appearance: none;
  display: inline-grid;
  justify-content: center;
  align-items: center;
  grid-column-gap: var(--theme-spacings-xxs);
  grid-auto-flow: column;

  cursor: pointer;

  font-family: inherit;
  font-size: 14px;
  line-height: 22px;
  font-weight: 400;

  transition-property: color, border-color, background-color;
  transition-duration: 0.3s;
  transition-timing-function: ease;

  color: var(--theme-colors-white);
  background-color: var(--theme-colors-primary-600);
  border: 1px solid var(--theme-colors-primary-600);
  padding: 8px 16px;
  min-width: 40px;

  &:hover,
  &:focus {
    background-color: var(--theme-colors-primary-500);
    border: 1px solid var(--theme-colors-primary-500);
  }

  &:active {
    background-color: var(--theme-colors-primary-700);
    border: 1px solid var(--theme-colors-primary-700);
  }
`;

export const SecondaryButton = styled(Button)`
  border: none;
  background: none;
  color: var(--theme-colors-neutral-800);

  &:hover,
  &:focus {
    background: none;
    border: none;
    color: var(--theme-colors-primary-500);
  }

  &:active {
    background: none;
    border: none;
    color: var(--theme-colors-primary-800);
  }
`;
