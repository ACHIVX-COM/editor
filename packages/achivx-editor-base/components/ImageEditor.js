import React, {
  forwardRef,
  useRef,
  useState,
  useImperativeHandle,
} from "react";
import styled from "styled-components";
import CropperBase from "react-cropper";
import cropperCss from "cropperjs/dist/cropper.min.css";
import VisuallyHidden from "@achivx/editor-base/components/VisuallyHidden";
import { Box } from "@achivx/editor-base/components/system/Box";
import { Icon, icons } from "@achivx/editor-base/components/Icon";
import { layout } from "@achivx/editor-base/components/system/primitives";
import { useTranslation } from "@achivx/editor-base/translation/useTranslation";
import { Tooltip } from "./Tooltip";
import { getCompressedBlob } from "../utils/blob";

const actions = {
  none: "none",
  crop: "crop",
  move: "move",
};

const Line = styled(Box)`
  width: 1px;
  height: 24px;
  margin: 8px 0;
  opacity: 0.1;
  background-color: var(--theme-colors-white);
`;

const Actions = styled(Box)`
  top: 0;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  background-color: var(--theme-colors-neutral-900);
`;

const Button = styled.button`
  cursor: pointer;
  background-color: transparent;
  border: none;
  ${(props) =>
    props.active
      ? "color: var(--theme-colors-primary-300);"
      : "color: var(--theme-colors-white);"}

  &:hover {
    color: var(--theme-colors-primary-500);
  }
`;

const ActionButton = ({ onClick, icon, text, active }) => (
  <Tooltip label={text}>
    <Button type="button" onClick={onClick} active={active}>
      <Icon icon={icon} size="32px" />
      <VisuallyHidden>{text}</VisuallyHidden>
    </Button>
  </Tooltip>
);

const Cropper = styled(CropperBase)`
  direction: ltr;
  font-size: 0;
  line-height: 0;
  position: relative;
  -ms-touch-action: none;
  touch-action: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  ${layout}
`;

export const ImageEditor = forwardRef(
  (
    {
      src,
      exportOptions,
      rotationAngle,
      zoomStep,
      minCropBoxHeight,
      minCropBoxWidth,
      autoCrop,
      cropperStyles,
      aspectRatio,
    },
    ref,
  ) => {
    const { t } = useTranslation();
    const [dragMode, setDragMode] = useState(actions.none);
    const cropperRef = useRef(null);

    useImperativeHandle(ref, () => ({
      getImage: () => {
        const {
          type = "image/jpeg",
          quality = 1,
          size = Infinity,
        } = exportOptions;

        return getCompressedBlob({
          canvas: cropperRef.current.cropper.getCroppedCanvas(),
          type,
          desiredQuality: quality,
          originalSize: size,
        });
      },
    }));

    const changeDragMode = (mode) => {
      if (dragMode !== mode) {
        setDragMode(mode);
        cropperRef.current.cropper.setDragMode(mode);
      }
    };

    const onRotateLeft = () => {
      changeDragMode(actions.none);
      cropperRef.current.cropper.rotate(-rotationAngle);
    };

    const onRotateRight = () => {
      changeDragMode(actions.none);
      cropperRef.current.cropper.rotate(rotationAngle);
    };

    const onZoomIn = () => {
      changeDragMode(actions.none);
      cropperRef.current.cropper.zoom(zoomStep);
    };

    const onZoomOut = () => {
      changeDragMode(actions.none);
      cropperRef.current.cropper.zoom(-zoomStep);
    };

    const onMove = () => {
      changeDragMode(actions.move);
    };

    const onCrop = () => {
      changeDragMode(actions.crop);
      const dataUrl = cropperRef.current.cropper.getCroppedCanvas().toDataURL();

      cropperRef.current.cropper.replace(dataUrl);
    };

    const onReset = () => {
      changeDragMode(actions.crop);
      cropperRef.current.cropper.replace(src);
      cropperRef.current.cropper.reset();
    };

    return (
      <Box>
        <style>{cropperCss}</style>
        <Actions>
          <ActionButton onClick={onReset} icon={icons.undo} text={t("reset")} />
          <Line />
          <ActionButton
            onClick={onZoomIn}
            icon={icons["zoom-in"]}
            text={t("zoom in")}
          />
          <ActionButton
            onClick={onZoomOut}
            icon={icons["zoom-out"]}
            text={t("zoom out")}
          />
          <Line />
          <ActionButton
            onClick={onRotateLeft}
            icon={icons["rotate-left"]}
            text={t("rotate left")}
          />
          <ActionButton
            onClick={onRotateRight}
            icon={icons["rotate-right"]}
            text={t("rotate right")}
          />
          <Line />
          <ActionButton
            active={dragMode === actions.move}
            onClick={onMove}
            icon={icons.move}
            text={t("move")}
          />
          <ActionButton
            active={dragMode === actions.crop}
            onClick={onCrop}
            icon={icons.crop}
            text={t("crop")}
          />
        </Actions>
        <Cropper
          ref={cropperRef}
          src={src}
          guides={false}
          zoomOnWheel={false}
          initialAspectRatio={1}
          aspectRatio={aspectRatio}
          checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
          autoCrop={autoCrop}
          autoCropArea={1}
          checkCrossOrigin={false}
          crossOrigin=""
          ready={() => {
            if (autoCrop) {
              const { cropper } = cropperRef.current;
              const cropBox = cropper.getCropBoxData();
              const canvas = cropper.canvasData;

              cropBox.left = canvas.left;
              cropBox.top = canvas.top;
              cropBox.width = canvas.width;
              cropBox.height = canvas.height;
              cropper.setCropBoxData(cropBox);
            }
          }}
          crop={(event) => {
            const { cropper } = cropperRef.current;
            const canvas = cropper.canvasData;
            const { width } = event.detail;
            const { height } = event.detail;

            if (width < minCropBoxWidth || height < minCropBoxHeight) {
              cropper.setData({
                width:
                  width < minCropBoxWidth
                    ? Math.max(minCropBoxWidth, Math.min(canvas.width, width))
                    : undefined,
                height:
                  height < minCropBoxHeight
                    ? Math.max(
                        minCropBoxHeight,
                        Math.min(canvas.height, height),
                      )
                    : undefined,
              });
            }
          }}
          {...cropperStyles}
        />
      </Box>
    );
  },
);

ImageEditor.defaultProps = {
  exportOptions: {
    maxWidth: 1920,
    maxHeight: 1920,
    type: "image/jpeg",
    quality: 0.75,
  },
  rotationAngle: 90,
  zoomStep: 0.1,
  minCropBoxHeight: 320,
  minCropBoxWidth: 320,
  autoCrop: true,
};
