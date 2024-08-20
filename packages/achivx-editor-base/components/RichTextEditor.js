import React, {
  createContext,
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import isHotkey from "is-hotkey";
import { Editor } from "slate-react";
import styled from "styled-components";
import { useMachine } from "@xstate/react";
import { Flex, Box, Grid } from "@achivx/editor-base/components/system/Box";
import { Text } from "@achivx/editor-base/components/system/Text";
import { Icon, icons } from "@achivx/editor-base/components/Icon";
import { screen } from "@achivx/editor-base/components/system/primitives";
import { Modal } from "@achivx/editor-base/components/Modal";
import DropOrPasteImages from "slate-drop-or-paste-images";
import { useTranslation } from "@achivx/editor-base/translation/useTranslation";
import { useFileApi } from "../utils/fileApiContext";
import {
  uploadButtonMachine,
  imageEditStateMachine,
} from "./UploadStateMachine";
import { AddVideoForm } from "./AddVideo";
import { convertIfHeic } from "../utils/convertIfHeic";
import { ImageEditModal, UploadModals, LinkModal } from "./Modals";
import {
  DEFAULT_NODE,
  renderGenericBlock,
  renderMark,
  Frame,
  ImageUI,
  schema,
} from "./RichText";

const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
  "mod+z": "undo",
  "mod+y": "redo",
};
const LIST_TYPES = ["numbered-list", "bulleted-list"];

const buttonMixin = `
  padding: 0;
  background-color: var(--theme-colors-white);
  border: none;
  display: inline-grid;
  justify-content: center;
  align-items: center;
`;

const ButtonBase = styled.button.attrs({ type: "button" })`
  cursor: pointer;
  ${buttonMixin}
`;

const MediaControl = styled.button.attrs({ type: "button" })`
  ${buttonMixin};
  padding: var(--theme-spacings-xs);
  background-color: var(--theme-colors-neutral-900);
`;

const MediaControls = styled(Grid)`
  position: absolute;
  top: 0;
  right: 0;
  transition: opacity 0.3s var(--theme-timing-functions-standard);
  z-index: 10;

  ${screen("md")} {
    opacity: 0;
  }
  &:hover {
    opacity: 1;
  }
`;

const selectedMixin = `
  box-shadow: var(--theme-shadows-elevation-5);

  & ${MediaControls} {
    opacity: 1;
  }
`;
const ImageWrapper = styled(Box)`
  &:hover ${MediaControls} {
    opacity: 1;
  }

  ${(props) => (props.selected ? selectedMixin : "")}
`;
const VideoWrapper = styled("div")`
  position: relative;
  padding-top: 56.25%; //preserving 16/9 aspect ratio
  &:hover ${MediaControls} {
    box-shadow: var(--theme-shadows-elevation-5);
    opacity: 1;
  }
  ${(props) => (props.selected ? selectedMixin : "")}
`;

const removeVideo = (editorInstance, node) => {
  editorInstance.removeNodeByKey(node.key);
};

const Video = ({ node, editorInstance, ...rest }) => (
  <VideoWrapper {...rest}>
    <MediaControls>
      <MediaControl
        onClick={() => {
          removeVideo(editorInstance, node);
        }}
      >
        <Icon color="white" size="16px" icon={icons.cross} />
      </MediaControl>
    </MediaControls>
    <Frame src={node.data.get("video")} />
  </VideoWrapper>
);

const removeImage = (editorInstance, node) => {
  editorInstance.removeNodeByKey(node.key);
};

const Image = ({ image, editorInstance, node, alt, ...rest }) => {
  const { t } = useTranslation();
  const fileApi = useFileApi();

  const attrsRef = useRef();

  attrsRef.current = { node, id: image.id };

  const [state, send] = useMachine(imageEditStateMachine, {
    context: {
      fileApi,
      editorInstance,
      attrsRef,
    },
  });

  return (
    <ImageWrapper position="relative" {...rest}>
      <Box as="figure" mx="auto" my="m">
        <ImageUI src={image.url} />
        {alt && (
          <Text
            preset="Caption"
            width="max-content"
            color="neutral-800"
            mx="auto"
            mt="xs"
          >
            {alt}
          </Text>
        )}
      </Box>
      <MediaControls gridGap="xxs" gridAutoFlow="column">
        <MediaControl onClick={() => send("EDIT")}>
          <Icon color="white" size="16px" icon={icons.pen} />
        </MediaControl>
        <MediaControl
          onClick={() => {
            removeImage(editorInstance, node);
            fileApi.onRemoveFile(image.id);
          }}
        >
          <Icon color="white" size="16px" icon={icons.cross} />
        </MediaControl>
      </MediaControls>
      {state.matches("editing") && (
        <ImageEditModal
          image={image}
          headerText={t("Editing")}
          isOpen
          onSubmit={(data) => send("DONE_EDITING", { data })}
          onDismiss={() => send("DISMISS")}
          configuration={editorInstance.props.configuration}
        />
      )}
      <UploadModals
        state={state}
        send={send}
        onChooseAnotherImage={() => send("REEDIT")}
      />
    </ImageWrapper>
  );
};

export const Toolbar = styled(Flex)`
  position: sticky;
  bottom: var(--theme-spacings-s);
  background: white;
  flex-wrap: wrap;
  border: 1px solid var(--theme-colors-neutral-300);
  margin-top: var(--theme-spacings-s);
`;

export const ToolbarSeparator = () => (
  <Box
    width="1px"
    height="16px"
    alignSelf="center"
    backgroundColor="neutral-300"
  />
);

const redo = (editorInstance, event) => {
  event.preventDefault();
  editorInstance.redo();
};

const undo = (editorInstance, event) => {
  event.preventDefault();
  editorInstance.undo();
};

const historyControls = {
  undo,
  redo,
};

const EditorContext = createContext(null);

const useRichTextEditor = () => useContext(EditorContext).current;

const onClickLink = (editorInstance, data) => {
  const { text = "[link]", src } = data;

  if (!src) {
    return;
  }

  editorInstance
    .insertText(` ${text}`)
    .moveFocusBackward(text.length)
    .wrapInline({
      type: "link",
      data,
    })
    .moveToEnd();
};

const onClickClearFormat = (editorInstance) => {
  editorInstance.value.marks.forEach((mark) => {
    editorInstance.removeMark(mark.type);
  });
};

const onClickVideo = (editorInstance, data) => {
  editorInstance.insertBlock({
    type: "video",
    data,
  });
};

export const LinkButton = ({ title }) => {
  const editorInstance = useRichTextEditor();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <ButtonBase title={title} onClick={() => setIsModalOpen(true)}>
        <Icon color="neutral-400" size="32px" icon={icons.link} />
      </ButtonBase>

      <LinkModal
        isOpen={isModalOpen}
        onSubmit={(data) => onClickLink(editorInstance, data)}
        onDismiss={() => setIsModalOpen(false)}
      />
    </>
  );
};

export const VideoButton = ({ title }) => {
  const { t } = useTranslation();
  const editorInstance = useRichTextEditor();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <ButtonBase title={title} onClick={() => setIsModalOpen(true)}>
        <Icon color="primary-600" size="32px" icon={icons.video} />
      </ButtonBase>

      <Modal
        isClosable
        isOpen={isModalOpen}
        onDismiss={() => setIsModalOpen(false)}
        aria-label={t("Add video")}
      >
        <AddVideoForm
          onSubmit={(data) => {
            onClickVideo(editorInstance, data);
            setIsModalOpen(false);
          }}
        />
      </Modal>
    </>
  );
};

const HiddenInput = styled.input.attrs({
  type: "file",
  accept: `image/*, image/heic, image/heif`,
})`
  opacity: 0;
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  max-width: 100%;
`;

export const ImageButton = ({ disabled, ...props }) => {
  const editorInstanceRef = useRef();
  const editorInstance = useRichTextEditor();
  const fileApi = useFileApi();
  const inputRef = useRef();

  useEffect(() => {
    editorInstanceRef.current = editorInstance;
  }, [editorInstance]);

  const [state, send] = useMachine(uploadButtonMachine, {
    context: { fileApi },
    actions: {
      onEditedUploadDone: (_, { data: images }) => {
        (Array.isArray(images) ? images : [images]).forEach((data) =>
          editorInstanceRef.current.insertBlock({ type: "image", data }),
        );
      },
    },
  });

  const { t } = useTranslation();

  if (!fileApi) {
    return null;
  }

  return (
    <>
      <ButtonBase
        {...props}
        css="position: relative;"
        onClick={() => inputRef.current.click()}
      >
        <HiddenInput
          ref={inputRef}
          disabled={disabled}
          multiple
          onChange={async (e) => {
            try {
              e.persist();
              const files = Array.from(e.target.files);

              send("LOADING");
              const data = await Promise.all(
                files.map((file) => convertIfHeic(file)),
              );

              send("UPLOAD", { data });
              e.target.value = null;
            } catch (e) {
              console.error("Error loading image", e);

              send("ERROR");
            }
          }}
        />
        <Icon
          color={disabled ? "neutral-600" : "primary-600"}
          size="32px"
          icon={icons.photo}
        />
      </ButtonBase>
      <UploadModals
        send={send}
        state={state}
        onChooseAnotherImage={() => inputRef.current.click()}
      />
      {state.matches("editing") && (
        <ImageEditModal
          image={{
            ...state.context.previewImages[0],
            size: state.context.previewImageInitialSize,
          }}
          headerText={t("Uploading photo")}
          isOpen
          onSubmit={(data) => send("DONE_EDITING", { data })}
          onDismiss={() => send("DISMISS")}
          configuration={editorInstance.props.configuration}
        />
      )}
    </>
  );
};

export const ClearFormatButton = ({ title }) => {
  const editorInstance = useRichTextEditor();

  return (
    <ButtonBase
      onClick={() => onClickClearFormat(editorInstance)}
      title={title}
    >
      <Icon color="neutral-400" size="32px" icon={icons["clear-formatting"]} />
    </ButtonBase>
  );
};

export const UndoButton = ({ title }) => {
  const editorInstance = useRichTextEditor();

  return (
    <ButtonBase onMouseDown={(e) => undo(editorInstance, e)} title={title}>
      <Icon color="neutral-400" size="32px" icon={icons.undo} />
    </ButtonBase>
  );
};

export const RedoButton = ({ title }) => {
  const editorInstance = useRichTextEditor();

  return (
    <ButtonBase onMouseDown={(e) => redo(editorInstance, e)} title={title}>
      <Icon color="neutral-400" size="32px" icon={icons.redo} />
    </ButtonBase>
  );
};

const onKeyDown = (event, editorInstance, next) => {
  if (!event.ctrlKey) {
    return next();
  }

  for (const [hotkey, action] of Object.entries(HOTKEYS)) {
    if (isHotkey(hotkey, event)) {
      if (action in historyControls) {
        historyControls[action](editorInstance, event);

        return next();
      }

      event.preventDefault();
      editorInstance.toggleMark(action);

      return next();
    }
  }

  return next();
};
const renderEditableBlock = (props, editorInstance, next) => {
  const { attributes, node, isFocused } = props;

  switch (node.type) {
    case "image": {
      const image = Object.fromEntries(node.data);

      return (
        <Image
          image={image}
          alt={image.alt}
          editorInstance={editorInstance}
          node={node}
          selected={isFocused}
          {...attributes}
        />
      );
    }
    case "video": {
      return (
        <Video
          selected={isFocused}
          editorInstance={editorInstance}
          node={node}
          {...attributes}
        />
      );
    }
    default:
      return renderGenericBlock(props, editorInstance, next);
  }
};

export const ImageUploadModals = ({ setCallback, onSignIn }) => {
  const editorInstanceRef = useRef();
  const editorInstance = useRichTextEditor();

  useEffect(() => {
    editorInstanceRef.current = editorInstance;
  }, [editorInstance]);

  const fileApi = useFileApi();

  const [state, send] = useMachine(uploadButtonMachine, {
    context: { fileApi },
    actions: {
      onEditedUploadDone: (_, { data }) => {
        editorInstanceRef.current.insertBlock({ type: "image", data });
      },
    },
  });

  const callback = useCallback(
    (data) => send("UPLOAD", { data: [data] }),
    [send],
  );

  useEffect(() => {
    setCallback(() => callback);
  }, [callback, setCallback]);

  const { t } = useTranslation();

  return (
    <>
      <UploadModals send={send} state={state} onSignIn={onSignIn} />
      {state.matches("editing") && (
        <ImageEditModal
          image={state.context.previewImages[0]}
          headerText={t("Uploading photo")}
          isOpen
          onSubmit={(data) => send("DONE_EDITING", { data })}
          onDismiss={() => send("DISMISS")}
          configuration={editorInstance.props.configuration}
        />
      )}
    </>
  );
};

export const RichTextEditor = forwardRef(
  ({ children, onChange, configuration, value, ...rest }, ref) => {
    const editorRef = useRef();
    const handleChange = ({ value }) => onChange(value);

    const [callback, setCallback] = useState();

    const plugins = useMemo(
      () =>
        callback
          ? [
              DropOrPasteImages({
                insertImage: (_, file) => callback(file),
              }),
            ]
          : [],
      [callback],
    );

    useImperativeHandle(ref, () => ({
      appendImage: (data) => {
        editorRef.current.moveFocusToEndOfDocument();
        editorRef.current.insertBlock({
          type: "image",
          data,
        });
      },
      removeImage: (node) => removeImage(editorRef.current, node),
      focus: editorRef.current.focus,
      getImages: () =>
        editorRef.current.value.document.getBlocksByType("image").toArray(),
      getText: () => editorRef.current.value.document.text,
    }));

    return (
      <>
        <Editor
          spellCheck
          autoFocus
          style={{ wordBreak: "break-word" }}
          configuration={configuration}
          ref={editorRef}
          schema={schema}
          onKeyDown={onKeyDown}
          renderNode={renderEditableBlock}
          renderMark={renderMark}
          onChange={handleChange}
          plugins={plugins}
          onFocus={() => {}} // https://github.com/ianstormtaylor/slate/issues/1984 basically, fix for the firefox
          value={value}
          {...rest}
        />
        <EditorContext.Provider value={editorRef}>
          <ImageUploadModals setCallback={setCallback} />
          {children}
        </EditorContext.Provider>
      </>
    );
  },
);
const onClickMark = (event, type, editorInstance) => {
  event.preventDefault();
  editorInstance.toggleMark(type);
};

const hasBlock = (type, value) => {
  return value.blocks.some((node) => node.type === type);
};

const onClickBlock = (event, type, editorInstance, data) => {
  event.preventDefault();
  const {
    value,
    value: { document, blocks },
  } = editorInstance;

  if (hasBlock("image", value)) {
    return;
  }

  switch (type) {
    case "block-quote":
      {
        const wasTypeOf = document.getParent(blocks.first().key)?.type;

        if (wasTypeOf === type) {
          editorInstance.unwrapBlock(type);
        } else {
          if (LIST_TYPES.includes(wasTypeOf)) {
            editorInstance.unwrapBlock(wasTypeOf);
            editorInstance.wrapBlock({ type, data });
            editorInstance.wrapBlock(wasTypeOf);

            return;
          }

          editorInstance.wrapBlock({ type, data });
        }
      }

      break;
    case "numbered-list":
    case "bulleted-list":
      {
        const isActive = hasBlock("list-item", value);
        const wasTypeOf = document.getParent(blocks.first().key)?.type;

        if (isActive) {
          if (wasTypeOf !== type) {
            editorInstance.unwrapBlock(wasTypeOf).wrapBlock(type);
          } else {
            editorInstance.setBlocks(DEFAULT_NODE);
            LIST_TYPES.forEach((listType) =>
              editorInstance.unwrapBlock(listType),
            );
          }
        } else {
          editorInstance.setBlocks("list-item");
          editorInstance.wrapBlock(type);
        }
      }

      break;

    default:
      {
        const isActive = hasBlock(type, value);
        const wasList = hasBlock("list-item", value);

        editorInstance.setBlocks(isActive ? DEFAULT_NODE : type);

        if (wasList) {
          LIST_TYPES.forEach((listType) =>
            editorInstance.unwrapBlock(listType),
          );
        }
      }

      break;
  }
};

const hasMark = (type, value) => {
  return value.activeMarks.some((mark) => mark.type === type);
};

export const MarkButton = ({ type, icon, title }) => {
  const editorInstance = useRichTextEditor();
  const isActive = editorInstance && hasMark(type, editorInstance.value);

  return (
    <ButtonBase
      onMouseDown={(event) => onClickMark(event, type, editorInstance)}
      title={title}
    >
      <Icon
        color={isActive ? "primary-400" : "neutral-400"}
        size="32px"
        icon={icons[icon]}
      />
    </ButtonBase>
  );
};

export const BlockButton = ({ type, icon, data, title }) => {
  const editorInstance = useRichTextEditor();
  let isActive = editorInstance && hasBlock(type, editorInstance.value);

  if (editorInstance && LIST_TYPES.includes(type)) {
    const { document, blocks } = editorInstance.value;

    if (blocks.size > 0) {
      const parent = document.getParent(blocks.first().key);

      isActive =
        hasBlock("list-item", editorInstance.value) &&
        parent &&
        parent.type === type;
    }
  }

  return (
    <ButtonBase
      onMouseDown={(event) => onClickBlock(event, type, editorInstance, data)}
      title={title}
    >
      <Icon
        color={isActive ? "primary-400" : "neutral-400"}
        size="32px"
        icon={icons[icon]}
      />
    </ButtonBase>
  );
};
