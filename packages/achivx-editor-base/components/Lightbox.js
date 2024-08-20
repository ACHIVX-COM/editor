import React, { useState } from "react";
import styled from "styled-components";
import { Box, Flex } from "@achivx/editor-base/components/system/Box";
import { LazyImage } from "@achivx/editor-base/components/LazyImage";
import { Icon, icons } from "@achivx/editor-base/components/Icon";
import Popup from "reactjs-popup";
import {
  Slider,
  withFullSizeItems,
} from "@achivx/editor-base/components/Slider";
import { screen } from "@achivx/editor-base/components/system/primitives";
import { Text } from "@achivx/editor-base/components/system/Text";

const FullSizeSlider = withFullSizeItems(Slider);

export const NextButton = () => (
  <Icon
    icon={icons["chevron-right"]}
    color="neutral-200"
    height="100%"
    size="44px"
  />
);
export const PrevButton = () => (
  <Icon
    icon={icons["chevron-left"]}
    color="neutral-200"
    height="100%"
    size="44px"
  />
);

export const ButtonControl = (props) =>
  props.next ? <NextButton /> : <PrevButton />;

export const LightboxOverlay = styled(Popup).attrs(
  ({ isOpen, onDismiss = () => {} }) => ({
    open: isOpen,
    onClose: onDismiss,
    modal: true,
    nested: true,
  }),
)`
  &-overlay {
    background-color: rgba(0, 0, 0, 0.95) !important;
    display: block !important;
  }

  &-content {
    position: fixed;
    color: var(--theme-colors-neutral-900);
    inset: 0;
    width: unset;
    overflow-y: auto;
    z-index: 199;
    height: 100%;
  }
`;

const Picture = styled(Flex).attrs({
  width: "100%",
  height: "100%",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
})``;

const ImageHolder = styled(LazyImage).attrs({
  pictureComponent: Picture,
})`
  object-fit: contain;
`;

const Frame = styled.iframe`
  border: none;
  display: flex;
  width: 100%;
  height: 100%;
  padding: 0;
`;
const PlayIcon = styled(Flex)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const MenuButton = styled.button`
  color: var(--theme-colors-blue-600);
  min-width: var(--theme-spacings-xxl-2);
  appearance: none;
  background: transparent;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  outline: none;
  border: none;
  margin: 0;
  padding: 0;
`;

export const CloseButton = ({ onDismiss }) => (
  <MenuButton onClick={onDismiss}>
    <Icon color="white" size="24px" icon={icons.cross} />
  </MenuButton>
);

const Video = ({ url, previewImage, isTriggered, onClick, onDismiss }) => {
  return (
    <Box
      height="100%"
      width="100%"
      onClick={onDismiss}
      py="xxl-6"
      px={{ _: "0", md: "xxl-6" }}
      m="0"
    >
      <Flex
        height="100%"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        position="relative"
        justifyContent="center"
      >
        {isTriggered ? (
          <Frame src={url} />
        ) : (
          <>
            <ImageHolder alt="" src={previewImage.url} />
            <PlayIcon>
              <Icon icon={icons.play} size="32px" ml="xxs" color="white" />
            </PlayIcon>
          </>
        )}
      </Flex>
    </Box>
  );
};

const AltHolder = styled(Flex).attrs({
  bottom: "0",
  width: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.8)",
  alignItems: "center",
  justifyContent: "center",
  pb: { md: "xxl-6" },
  position: "absolute",
})`
  height: 64px;
  ${screen("md")} {
    height: 128px;
    opacity: 0;
    &:hover {
      opacity: 1;
    }
  }
`;

export const LightboxGallery = ({
  items,
  index = 0,
  afterChange = () => {},
  onDismiss,
  onNext = () => {},
}) => {
  const [isTriggered, setIsTriggered] = useState(false);

  return (
    <Box
      height="100%"
      css="
        > div:first-child {
          height: 100%
      }"
    >
      <FullSizeSlider
        height="100%"
        slidesPerView={1}
        initialSlide={index}
        onSlideChange={({ activeIndex }) => {
          afterChange(activeIndex);
          setIsTriggered(false);
        }}
        controls={{
          prev: {
            position: { top: "50%", left: 0 },
            render: () => <ButtonControl prev />,
          },
          next: {
            position: { top: "50%", right: 0 },
            render: () => <ButtonControl next />,
          },
        }}
        onNext={onNext}
        items={items}
        keyGen={(item) => item.url}
        renderItem={({ url, type, previewImage, alt }) => (
          <Flex
            justifyContent="center"
            alignItems="center"
            maxWidth="100wh"
            maxHeight="100vh"
          >
            {type !== "video" ? (
              <Box
                height="100%"
                onClick={onDismiss}
                py="xxl-6"
                px={{ _: "0", md: "xxl-6" }}
                m="0"
              >
                <ImageHolder
                  alt={alt}
                  src={url}
                  width="100%"
                  height="100%"
                  maxWidth="100wh"
                  maxHeight="100vh"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {alt && (
                    <AltHolder>
                      <Text color="neutral-400" preset="Body1Semibold">
                        {alt}
                      </Text>
                    </AltHolder>
                  )}
                </ImageHolder>
              </Box>
            ) : (
              <Flex
                key={url}
                justifyContent="center"
                alignItems="center"
                width="100vw"
                height="100vh"
              >
                <Video
                  url={url}
                  previewImage={previewImage}
                  isTriggered={isTriggered}
                  onClick={() => setIsTriggered(true)}
                  onDismiss={onDismiss}
                />
              </Flex>
            )}
          </Flex>
        )}
      />
    </Box>
  );
};
