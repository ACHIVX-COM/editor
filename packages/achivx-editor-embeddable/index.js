import { AchivxEditor } from "./src/editorAdapter";
import { AchivxViewer } from "./src/viewerAdapter";

function invokeAchivxEditorCallback(cb) {
  cb({ AchivxEditor, AchivxViewer });
}

for (const cb of window.achivxEditorCallbacks || []) {
  invokeAchivxEditorCallback(cb);
}

window.achivxEditorCallbacks = {
  push(...callbacks) {
    for (const cb of callbacks) {
      invokeAchivxEditorCallback(cb);
    }
  },
};
