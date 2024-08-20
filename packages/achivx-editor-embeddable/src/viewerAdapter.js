import { Viewer } from "@achivx/editor-base/viewer";
import React, { createRef } from "react";
import { createRoot } from "react-dom/client";

export class AchivxViewer {
  #root;
  #viewerRef;
  #value;

  constructor({ element, value }) {
    this.#viewerRef = createRef();

    this.#root = createRoot(element);
    this.#root.render(<Viewer value={value} ref={this.#viewerRef} />);

    this.#value = value;
  }

  unmount() {
    this.#root.unmount();
  }

  get value() {
    return this.#value;
  }

  set value(value) {
    this.#viewerRef.current?.setValue(value);
    this.#value = value;
  }
}
