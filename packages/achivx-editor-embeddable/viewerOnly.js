import { AchivxViewer } from "./src/viewerAdapter";

function invokeAchivxEditorCallback(cb) {
  cb({
    AchivxViewer,
    get AchivxEditor() {
      throw new Error(
        "AchivxEditor is not available in this bundle. Use the full bundle to get the editor.",
      );
    },
  });
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
