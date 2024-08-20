import React, {
  useEffect,
  useImperativeHandle,
  useState,
  forwardRef,
} from "react";
import { EMPTY_VALUE } from "./components/RichText";
import {
  ImageButton,
  RichTextEditor,
  Toolbar,
  VideoButton,
  MarkButton,
  BlockButton,
  ClearFormatButton,
  UndoButton,
  RedoButton,
  LinkButton,
  ToolbarSeparator,
} from "./components/RichTextEditor";
import { EditorThemeProvider } from "./components/EditorThemeProvider";
import { dataUrlUploadApi } from "./utils/dataUrlUploadApi";
import { FileApiProvider } from "./utils/fileApiContext";
import { useTranslation } from "./translation/useTranslation";

export const Editor = forwardRef(
  (
    {
      initialValue = EMPTY_VALUE,
      uploadApi = dataUrlUploadApi,
      onChange = () => {},
    },
    ref,
  ) => {
    const [value, setValue] = useState(initialValue);
    const { t } = useTranslation();

    useImperativeHandle(
      ref,
      () => ({
        setValue,
      }),
      [setValue],
    );

    useEffect(() => onChange(value), [value]);

    return (
      <EditorThemeProvider>
        <FileApiProvider value={uploadApi}>
          <RichTextEditor value={value} onChange={setValue} configuration={{}}>
            <Toolbar>
              <VideoButton title={t("Insert video")} />
              <ImageButton title={t("Insert image")} />
              <LinkButton title={t("Insert link")} />
              <ToolbarSeparator />
              <MarkButton type="bold" icon="bold" title={t("Bold")} />
              <MarkButton type="italic" icon="italic" title={t("Italic")} />
              <MarkButton
                type="underlined"
                icon="underlined"
                title={t("Underline")}
              />
              <MarkButton
                type="strikethrough"
                icon="stricken"
                title={t("Strikethrough")}
              />
              <MarkButton type="code" icon="code" title={t("Code")} />
              <BlockButton
                type="heading-one"
                icon="heading-one"
                title={t("Heading 1")}
              />
              <BlockButton
                type="heading-two"
                icon="heading-two"
                title={t("Heading 2")}
              />
              <BlockButton
                type="block-quote"
                icon="block-quote"
                data={{
                  placeholder: "quote",
                }}
                title={t("Quote")}
              />
              <BlockButton
                type="numbered-list"
                icon="numbered-list"
                title={t("Numbered list")}
              />
              <BlockButton
                type="bulleted-list"
                icon="bulleted-list"
                title={t("Bulleted list")}
              />
              <ClearFormatButton title={t("Clear formatting")} />
              <UndoButton title={t("Undo")} />
              <RedoButton title={t("Redo")} />
            </Toolbar>
          </RichTextEditor>
        </FileApiProvider>
      </EditorThemeProvider>
    );
  },
);
