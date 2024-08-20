import { Editor } from "@achivx/editor-base/editor";
import { dataUrlUploadApi } from "@achivx/editor-base/utils/dataUrlUploadApi";
import React, { createRef } from "react";
import { createRoot } from "react-dom/client";
import { Value } from "slate";

export class AchivxEditor extends EventTarget {
  #root;
  #editorRef;
  #value;

  constructor({ element, initialValue, uploadApi = dataUrlUploadApi }) {
    super();

    this.#editorRef = createRef();

    this.#root = createRoot(element);
    this.#root.render(
      <Editor
        initialValue={initialValue ? Value.fromJSON(initialValue) : undefined}
        uploadApi={uploadApi}
        onChange={(value) => {
          this.#value = value;
          this.dispatchEvent(new CustomEvent("change"));
        }}
        ref={this.#editorRef}
      />,
    );
  }

  unmount() {
    this.#root.unmount();
  }

  get value() {
    return this.#value.toJSON();
  }

  set value(value) {
    this.#editorRef.current.setValue(Value.fromJSON(value));
  }
}
