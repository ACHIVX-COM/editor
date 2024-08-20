/**
 * A file upload API that stores data in a data-url, without uploading it anywhere.
 *
 * @type {import('./fileApiContext').FileUploadApi}
 */
export const dataUrlUploadApi = {
  async onAddFile(blob) {
    const reader = new FileReader();

    reader.readAsDataURL(blob);

    return new Promise((resolve) => {
      reader.onloadend = () => {
        resolve({
          url: reader.result,
        });
      };
    });
  },

  async onRemoveFile(_id) {
    // noop
  },
};
