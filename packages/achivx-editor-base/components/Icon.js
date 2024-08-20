import React from "react";
import Unknown from "./icons/unknown.svg";
import { Box } from "./system/Box";
export { icons } from "./icons";

export const Icon = ({ icon, color, size = "24px" }) => {
  return (
    <Box
      as={icon ?? Unknown}
      color={color}
      fill="currentColor"
      width={size}
      height={size}
    />
  );
};
