import { assign, createMachine } from "xstate";
import { Block } from "slate";

export const uploadButtonMachine = createMachine(
  {
    id: "sm-upload-button",
    initial: "idle",
    strict: true,
    context: {},
    states: {
      idle: {
        entry: "reset",
        on: {
          UPLOAD: {
            actions: ["onPreviewImageUploadStart"],
            target: "#sm-upload-button.uploading.preview",
          },
          LOADING: {
            target: "#sm-upload-button.loading",
          },
        },
      },

      loading: {
        on: {
          ERROR: {
            actions: ["onError"],
            target: "#sm-upload-button.error.previewUpload",
          },
          UPLOAD: {
            actions: ["onPreviewImageUploadStart"],
            target: "#sm-upload-button.uploading.preview",
          },
        },
      },

      uploading: {
        initial: "preview",
        states: {
          preview: {
            invoke: {
              src: "uploadPreview",
              onDone: [
                {
                  actions: ["onPreviewUploadDone", "onPreviewUploadChange"],
                  target: "#sm-upload-button.editing",
                  cond: "isSingleImage",
                },
                {
                  actions: [
                    "onPreviewUploadDone",
                    "onPreviewUploadChange",
                    "onEditedUploadDone",
                  ],
                  target: "#sm-upload-button.idle",
                },
              ],
              onError: {
                actions: ["onError"],
                target: "#sm-upload-button.error.previewUpload",
              },
            },
          },

          edited: {
            invoke: {
              src: "uploadEdited",
              onDone: {
                actions: ["onEditedUploadDone"],
                target: "#sm-upload-button.idle",
              },
              onError: {
                actions: ["onError"],
                target: "#sm-upload-button.error.editedUpload",
              },
            },
          },
        },
      },

      error: {
        states: {
          previewUpload: {
            on: {
              UPLOAD: {
                actions: ["onPreviewImageUploadStart"],
                target: "#sm-upload-button.uploading.preview",
              },
              DISMISS: {
                target: "#sm-upload-button.idle",
              },
              RETRY: {
                target: "#sm-upload-button.uploading.preview",
              },
            },
          },

          editedUpload: {
            on: {
              UPLOAD: {
                actions: ["onPreviewImageUploadStart"],
                target: "#sm-upload-button.uploading.preview",
              },
              DISMISS: {
                target: "#sm-upload-button.idle",
              },
              RETRY: {
                target: "#sm-upload-button.uploading.edited",
              },
            },
          },
        },
      },

      editing: {
        on: {
          DISMISS: {
            target: "#sm-upload-button.idle",
          },
          DONE_EDITING: {
            actions: ["onDoneEditing"],
            target: "#sm-upload-button.uploading.edited",
          },
        },
      },
    },
  },
  {
    actions: {
      reset: assign({
        previewImages: null,
        error: null,
        editedImage: null,
      }),

      onPreviewImageUploadStart: assign({
        previewImages: (_, event) => event.data,
        previewImageInitialSize: (_, event) => event.data.size,
      }),

      onPreviewUploadChange: () => {},

      onError: assign({ error: (_, event) => event.data }),

      onPreviewUploadDone: assign({ previewImages: (_, event) => event.data }),

      onDoneEditing: assign({
        editedImage: (_, event) => event.data.imageBlob,
        editedImageAlt: (_, event) => event.data.imageAlt,
      }),
    },
    services: {
      uploadPreview: async ({ previewImages, fileApi }) =>
        await Promise.all(
          previewImages.map((previewImage) => fileApi.onAddFile(previewImage)),
        ),

      uploadEdited: async ({
        editedImage,
        editedImageAlt,
        previewImages,
        fileApi,
      }) => {
        await fileApi.onRemoveFile(previewImages[0].id ?? previewImages[0].url);

        return {
          ...(await fileApi.onAddFile(editedImage)),
          alt: editedImageAlt,
        };
      },
    },
    guards: {
      isSingleImage: ({ previewImages }) => {
        console.log({ previewImages });
        return previewImages?.length === 1;
      },
    },
  },
);

export const imageEditStateMachine = createMachine(
  {
    id: "sm-image-edit",
    initial: "idle",
    strict: true,
    context: {},
    states: {
      idle: {
        entry: "reset",
        on: {
          EDIT: {
            target: "editing",
          },
        },
      },
      editing: {
        on: {
          DISMISS: {
            target: "idle",
          },
          DONE_EDITING: {
            actions: ["onDoneEditing"],
            target: "uploading",
          },
        },
      },
      uploading: {
        invoke: {
          src: "uploadEdited",
          onDone: {
            actions: ["onEditedUploadDone"],
            target: "idle",
          },
          onError: {
            actions: ["onError"],
            target: "error",
          },
        },
      },
      error: {
        on: {
          DISMISS: {
            target: "idle",
          },
          REEDIT: {
            target: "editing",
          },
          RETRY: {
            target: "uploading",
          },
        },
      },
    },
  },
  {
    actions: {
      reset: assign({
        error: null,
        editedImage: null,
      }),

      onError: assign({ error: (_, event) => event.data }),

      onDoneEditing: assign({
        editedImage: (_, event) => event.data.imageBlob,
        editedImageAlt: (_, event) => event.data.imageAlt,
      }),

      /**
       * @param {{editorInstance: import('slate').Editor}} param0
       * @param {*} event
       */
      onEditedUploadDone: ({ attrsRef, editorInstance }, event) => {
        const { node } = attrsRef.current;

        const newBlock = Block.create({
          type: "image",
          data: event.data,
        });

        editorInstance.replaceNodeByKey(node.key, newBlock);
      },
    },
    services: {
      uploadEdited: async ({
        editedImage,
        editedImageAlt,
        fileApi,
        attrsRef,
      }) => {
        await fileApi.onRemoveFile(attrsRef.current.id ?? attrsRef.current.url);

        return {
          ...(await fileApi.onAddFile(editedImage)),
          alt: editedImageAlt,
        };
      },
    },
  },
);
