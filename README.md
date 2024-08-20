# ACHIVX Editor

ACHIVX editor is a customized version of [Slate](https://www.slatejs.org/) rich text editor that can be embedded into any site:

```HTML
<div id="editor"></div>
<script src="https://unpkg.com/@achivx/editor-embeddable/build/achivx-editor-embeddable.js" async></script>
<script>
  (window.achivxEditorCallbacks = window.achivxEditorCallbacks || [])
    .push(function ({ AchivxEditor }) {
      const editor = new AchivxEditor({
        // DOM element to mount editor to.
        element: document.getElementById("editor"),

        // Initial content of the editor.
        // You may load it from your API if you need to edit an existing document or leave it undefined to start editing a new empty document.
        // initialValue: ...,

        // Adapter for file (image) storage.
        // If missing, the editor will encode images as data-URLs and embed them into the document.
        // If an explicit null is passed, image-related functionality will be disabled.
        // uploadApi: {
        //   // Called when a new file should be uploaded.
        //   // Should return a promise resolving to an object containing at least `url` field, containing a valid URL of the file.
        //   async onAddFile(blob) {
        //     ...
        //   },
        //   // Called when a file should be deleted.
        //   // "id" (if present) or "url" (if not) field from the object previously returned from onAddFile is passed.
        //   async onRemoveFile(id) {
        //     ...
        //   }
        // },
      });

      // "change" event will be fired every time the editor state changes.
      // Note that it will happen very frequently - on every edit or cursor move.
      // If you want to perform some expensive actions (e.g. autosaving the document to server) on changes, some debouncing/throttling will be necessary.
      editor.addEventListener("change", function () {
        // editor.value contains current editor content.
        // It may also be assigned to a new document - current editor content will be replaced by the new value.
        console.log(editor.value);
      });

      // The editor can be removed from DOM by calling the following method:
      // editor.unmount();
    });
</script>
```

If you only need to display a content previously created using the ACHIVX editor, you can use a viewer-only bundle:

```HTML
<div id="viewer"></div>
<!--
  Viewer bundle is smaller than the default one and contains the viewer only.
  If you use both editor and viewer, you can use the default bundle - AchivxViewer is still available there.
-->
<script src="https://unpkg.com/@achivx/editor-embeddable/build/achivx-viewer-embeddable.js" async></script>
<script>
  (window.achivxEditorCallbacks = window.achivxEditorCallbacks || [])
    .push(function ({ AchivxViewer }) {
      const viewer = new AchivxViewer({
        element: document.getElementById("viewer"),

        // The document, previously created by AchivxEditor
        value: ...,
      });

      // The content can be changed by assigning a new value to value property:
      //viewer.value = ...;

      // The viewer can be removed from DOM by calling the following method:
      // viewer.unmount();
    });
</script>
```

There also is a [@achivx/editor-base](./packages/achivx-editor-base/) package that contains the ACHIVX Editor (and separate components it's made of) as React components.
These components can be used to embed the editor into a React-based application.
