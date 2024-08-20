import React, { useImperativeHandle, forwardRef, useState } from "react";
import { EMPTY_VALUE } from "./components/RichText";
import { RichTextView } from "./components/RichTextView";
import { EditorThemeProvider } from "./components/EditorThemeProvider";

export const Viewer = forwardRef(
  ({ value: initialValue = EMPTY_VALUE }, ref) => {
    const [value, setValue] = useState(initialValue);

    useImperativeHandle(
      ref,
      () => ({
        setValue,
      }),
      [setValue],
    );

    return (
      <EditorThemeProvider>
        <RichTextView value={value} />
      </EditorThemeProvider>
    );
  },
);
