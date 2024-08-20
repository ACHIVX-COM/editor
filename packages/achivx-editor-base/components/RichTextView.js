import React, { createContext, useContext, useState } from "react";
import { Editor } from "slate-react";
import { Flex, Box } from "@achivx/editor-base/components/system/Box";
import { Text } from "@achivx/editor-base/components/system/Text";
import { Value } from "slate";
import styled from "styled-components";
import { traverse, NODE_TYPES } from "../utils/traverse";
import { LightboxGallery, LightboxOverlay, CloseButton } from "./Lightbox";
import {
  renderGenericBlock,
  renderMark,
  ImageUI,
  Frame,
  schema,
} from "./RichText";

/**
 * Context is a function: (String) => void
 */
const ImagePreviewContext = createContext(null);

const useImagePreview = () => useContext(ImagePreviewContext);

const ImageReadOnly = ({ image, alt, renderAlt, ...rest }) => {
  const onImageClick = useImagePreview();

  return (
    <Box as="figure" mx="0" my="m">
      <ImageUI
        src={image.url}
        draggable="false"
        onClick={() => onImageClick(image.id)}
        alt={image.alt}
        {...rest}
      />
      {renderAlt && (
        <Text
          as="figcaption"
          preset="CaptionMedium"
          width="max-content"
          color="neutral-800"
          mx="auto"
          mt="xs"
        >
          {alt}
        </Text>
      )}
    </Box>
  );
};

const VideoReadOnly = ({ href, ...rest }) => (
  <VideoWrapper {...rest}>
    <Frame src={href} />
  </VideoWrapper>
);

const VideoWrapper = styled("div")`
  position: relative;
  padding-top: 56.25%; //preserving 16/9 aspect ratio
`;

const renderReadonlyBlock = (props, editorInstance, next) => {
  const { node, isFocused } = props;

  switch (node.type) {
    case "image": {
      const image = Object.fromEntries(node.data);

      return <ImageReadOnly image={image} renderAlt={Boolean(image.alt)} />;
    }
    case "video":
      return (
        <VideoReadOnly href={node.data.get("video")} selected={isFocused} />
      );
    default:
      return renderGenericBlock(props, editorInstance, next);
  }
};

const extractImages = (value) => {
  const images = [];

  traverse(value.document, {
    [NODE_TYPES.IMAGE]: (node) => {
      if (node.data) {
        images.push(node.data);
      }
    },
  });

  return images;
};

export const RichTextView = ({ value, createImageAlts }) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedLightboxItemIndex, setSelectedLightboxItemIndex] = useState(0);

  const images = extractImages(value);
  const onImageClick = (id) => {
    setSelectedLightboxItemIndex(images.findIndex((img) => img.id === id));
    setIsLightboxOpen(true);
  };

  return (
    <ImagePreviewContext.Provider value={onImageClick}>
      <Editor
        readOnly
        value={Value.isValue(value) ? value : Value.create(value)}
        style={{ wordBreak: "break-word" }}
        createImageAlts={createImageAlts}
        images={images}
        schema={schema}
        renderNode={renderReadonlyBlock}
        renderMark={renderMark}
      />
      {images?.length ? (
        <LightboxOverlay
          isOpen={isLightboxOpen}
          onDismiss={() => setIsLightboxOpen(false)}
        >
          <LightboxGallery
            items={images.map(({ url, height, width, alt }) => ({
              url,
              height,
              width,
              alt,
            }))}
            index={selectedLightboxItemIndex}
            onDismiss={() => setIsLightboxOpen(false)}
          />
          <Flex
            alignItems="center"
            gridGap="s"
            position="fixed"
            zIndex="var(--theme-z-indexes-light-box)"
            top="s"
            right="s"
          >
            <CloseButton
              onDismiss={() => {
                setIsLightboxOpen(false);
              }}
            />
          </Flex>
        </LightboxOverlay>
      ) : null}
    </ImagePreviewContext.Provider>
  );
};
