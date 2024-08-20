import React, { useMemo, useRef, useEffect, useState } from "react";
import styled from "styled-components";
import { Flex, Box } from "./system/Box";

export const MOVING_DIRECTION = {
  LEFT: "left",
  RIGHT: "right",
};

const calculateDefaultSlidesSpaces = ({
  frameWidth,
  slidesPerView,
  itemWidth,
  spaceBetween,
}) => {
  const currentSpaceBetween =
    (frameWidth - slidesPerView * itemWidth) / slidesPerView;

  if (currentSpaceBetween < spaceBetween) {
    return calculateDefaultSlidesSpaces({
      frameWidth,
      slidesPerView: slidesPerView - 1,
      itemWidth,
      spaceBetween,
    });
  }

  return {
    currentSpaceBetween,
    currentSlidesPerView: slidesPerView,
  };
};

const calculateFitContainerSlidesSpaces = ({
  frameWidth,
  slidesPerView,
  itemWidth,
  spaceBetween,
}) => {
  const currentSpaceBetween =
    (frameWidth - slidesPerView * itemWidth) / (slidesPerView - 1);

  if (!Number.isFinite(currentSpaceBetween)) {
    return {
      currentSpaceBetween: frameWidth - itemWidth,
      currentSlidesPerView: 1,
    };
  }

  if (currentSpaceBetween < spaceBetween) {
    return calculateFitContainerSlidesSpaces({
      frameWidth,
      slidesPerView: slidesPerView - 1,
      itemWidth,
      spaceBetween,
    });
  }

  return {
    currentSpaceBetween,
    currentSlidesPerView: slidesPerView,
  };
};

const Button = styled(Box).attrs({ as: "button" })`
  z-index: 1;
  position: absolute;
  display: flex;
  cursor: pointer;
  align-items: center;
  border: none;
  top: 0;
  padding: 0;
  height: 100%;
  background-color: transparent;

  &:disabled {
    ${(props) => (props.hideOnDisabled ? "& > * { display: none; }" : "")}
  }
`;

const useSliderClientSide = ({
  spaceBetween,
  fitContentSlides,
  frameWidth,
  slidesPerView,
  itemWidth,
  items,
  wrapperRef,
}) => {
  const { currentSpaceBetween, currentSlidesPerView } = useMemo(() => {
    const { currentSpaceBetween, currentSlidesPerView } = fitContentSlides
      ? calculateFitContainerSlidesSpaces({
          frameWidth,
          slidesPerView,
          itemWidth,
          spaceBetween,
        })
      : calculateDefaultSlidesSpaces({
          frameWidth,
          slidesPerView,
          itemWidth,
          spaceBetween,
        });

    return {
      currentSpaceBetween,
      currentSlidesPerView,
    };
  }, [
    frameWidth,
    itemWidth,
    items.length,
    slidesPerView,
    spaceBetween,
    wrapperRef.current,
  ]);

  return {
    currentSpaceBetween,
    currentSlidesPerView,
  };
};

const useSliderServerSide = ({ spaceBetween, slidesPerView }) => {
  return {
    currentSpaceBetween: spaceBetween,
    currentSlidesPerView: slidesPerView,
  };
};

export const Slider = ({
  height,
  items,
  slidesPerView = 1,
  slideWholeView,
  renderItem,
  controls = {},
  onSlideChange,
  keyGen = () => "",
  onNext = () => {},
  spaceBetween,
  transitionDuration = 200,
  fitContentSlides,
  paginationRender,
  alignItems = "center",
  initialSlide = 0,
}) => {
  const [isClient, setIsClient] = useState(false);

  const stopActionTimeoutId = useRef(null);

  const startTimeout = () => {
    clearTimeout(stopActionTimeoutId.current);

    stopActionTimeoutId.current = setTimeout(() => {
      stopActionTimeoutId.current = null;
    }, transitionDuration);
  };

  useEffect(() => {
    setIsClient(true);

    return () => {
      clearTimeout(stopActionTimeoutId.current);
    };
  }, []);

  const wrapperRef = useRef(null);
  const frameWidth = wrapperRef.current?.clientWidth ?? 0;

  const sliderRef = useRef(null);

  const [mouseX, setMouseX] = React.useState(0);
  const [startCoordinations, setStartCoordinations] = useState(null);

  const [movingDirection, setMovingDirection] = useState(null);
  const [currentSlidePosition, setCurrentSlidePosition] = useState(
    initialSlide * frameWidth,
  );

  const [itemWidth, setItemWidth] = useState(
    sliderRef.current?.firstChild?.clientWidth,
  );

  useEffect(() => {
    setMouseX(initialSlide * frameWidth);
    setCurrentSlidePosition(initialSlide * frameWidth);
  }, [frameWidth, initialSlide]);

  useEffect(() => {
    if (fitContentSlides && slidesPerView === 1) {
      setItemWidth(frameWidth);

      return;
    }

    if (sliderRef.current?.firstChild?.clientWidth) {
      setItemWidth(sliderRef.current?.firstChild?.clientWidth);
    }
  }, [sliderRef.current, wrapperRef.current]);

  const { currentSpaceBetween, currentSlidesPerView } = (
    typeof window === "undefined" ? useSliderServerSide : useSliderClientSide
  )({
    spaceBetween,
    fitContentSlides,
    frameWidth,
    slidesPerView,
    itemWidth,
    items,
    wrapperRef,
  });
  const itemWithSpaceWidth = currentSpaceBetween + itemWidth;

  const maxPosition =
    itemWithSpaceWidth * items.length -
    frameWidth -
    (fitContentSlides ? currentSpaceBetween : 0);

  const protectCorrectScrollValue = (scroll) => {
    if (scroll < 0) {
      return 0;
    }

    if (scroll > maxPosition) {
      return maxPosition;
    }

    return scroll;
  };

  const withCorrectInit = (func) => {
    if (frameWidth && frameWidth) {
      return (...args) => func(...args);
    }

    return () => {};
  };

  const moveScrollTo = (newPos, dir) => {
    setMouseX(protectCorrectScrollValue(newPos));
    setMovingDirection(dir);
    startTimeout();
  };

  const slidesForScrolling = slideWholeView ? currentSlidesPerView : 1;

  const goNext = withCorrectInit(() => {
    const currentSlider = Math.floor(
      mouseX / itemWithSpaceWidth / slidesForScrolling,
    );
    const newPosition =
      currentSlider * itemWithSpaceWidth * slidesForScrolling +
      itemWithSpaceWidth * slidesForScrolling;

    moveScrollTo(newPosition);
    startTimeout();
    setCurrentSlidePosition(protectCorrectScrollValue(newPosition));
  });

  const goBack = withCorrectInit(() => {
    const currentSlider = Math.ceil(
      mouseX / itemWithSpaceWidth / slidesForScrolling,
    );
    const newPosition =
      currentSlider * itemWithSpaceWidth * slidesForScrolling -
      itemWithSpaceWidth * slidesForScrolling;

    moveScrollTo(newPosition);
    startTimeout();
    setCurrentSlidePosition(protectCorrectScrollValue(newPosition));
  });

  const handleStartSliding = (e) => {
    e.stopPropagation();

    const startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;

    setStartCoordinations(startX);
  };

  const handleSliding = (e) => {
    e.stopPropagation();

    if (!startCoordinations || items.length < currentSlidesPerView) {
      return;
    }

    const endX = e.clientX || (e.touches && e.touches[0].clientX) || 0;

    const dif = endX - startCoordinations;

    const dir = dif < 0 ? MOVING_DIRECTION.RIGHT : MOVING_DIRECTION.LEFT;

    const newScroll = currentSlidePosition + startCoordinations - endX;

    moveScrollTo(newScroll, dir);
  };

  useEffect(() => {
    if (!startCoordinations && movingDirection) {
      switch (movingDirection) {
        case MOVING_DIRECTION.LEFT:
          goBack();
          break;

        case MOVING_DIRECTION.RIGHT:
          goNext();
          break;

        default: {
          break;
        }
      }
    }
  }, [startCoordinations, movingDirection, goBack, goNext]);

  const handleEndSliding = () => {
    if (!startCoordinations) {
      return;
    }

    setStartCoordinations(null);

    switch (movingDirection) {
      case MOVING_DIRECTION.LEFT:
        goBack();
        break;

      case MOVING_DIRECTION.RIGHT:
        goNext();
        break;

      default: {
        break;
      }
    }
  };

  const showNextButton =
    controls.prev &&
    isClient &&
    mouseX < maxPosition &&
    currentSlidePosition < maxPosition;

  const showPrevButton =
    controls.prev && isClient && mouseX > 0 && currentSlidePosition > 0;

  const showPagination = isClient && paginationRender;

  const getPagination = () => {
    if (currentSlidesPerView === 1) {
      return items.length;
    }

    if (slideWholeView) {
      return Math.ceil(items.length / currentSlidesPerView);
    }

    if (items.length <= currentSlidesPerView) {
      return 0;
    }

    return items.length - currentSlidesPerView + 1;
  };

  const goToSlide = (newSlide) => {
    if (currentSlidesPerView === 1) {
      const newPosition = newSlide * frameWidth;

      setMouseX(protectCorrectScrollValue(newPosition));

      setCurrentSlidePosition(protectCorrectScrollValue(newPosition));

      return;
    }

    if (slideWholeView) {
      const newPosition = newSlide * frameWidth;

      setMouseX(protectCorrectScrollValue(newPosition));

      setCurrentSlidePosition(protectCorrectScrollValue(newPosition));

      return;
    }

    if (items.length <= currentSlidesPerView) {
      setMouseX(protectCorrectScrollValue(0));
      setCurrentSlidePosition(protectCorrectScrollValue(0));

      return;
    }

    setMouseX(protectCorrectScrollValue(newSlide * itemWithSpaceWidth));

    setCurrentSlidePosition(
      protectCorrectScrollValue(newSlide * itemWithSpaceWidth),
    );
  };

  const activePage = () => {
    if (currentSlidesPerView === 1) {
      return Math.round(currentSlidePosition / frameWidth);
    }

    if (slideWholeView) {
      return Math.ceil(currentSlidePosition / frameWidth);
    }

    if (items.length <= currentSlidesPerView) {
      return 0;
    }

    return Math.floor(currentSlidePosition / itemWithSpaceWidth);
  };

  const handlePreventItemClick = (e) => {
    if (stopActionTimeoutId.current) {
      e.preventDefault();
    }
  };

  useEffect(() => {
    if (isClient) {
      onNext?.({ activeIndex: activePage() });
      onSlideChange?.({ activeIndex: activePage() });
    }
  }, [currentSlidePosition]);

  return (
    <Box position="relative" height="100%">
      <Flex
        position="relative"
        overflow="hidden"
        minWidth="100%"
        height={height}
        ref={wrapperRef}
        onMouseDown={handleStartSliding}
        onMouseMove={handleSliding}
        onMouseUp={handleEndSliding}
        onMouseLeave={handleEndSliding}
        onTouchStart={handleStartSliding}
        onTouchMove={handleSliding}
        onTouchEnd={handleEndSliding}
      >
        {(!isClient || !Number.isNaN(currentSlidePosition)) && (
          <Flex
            pl={fitContentSlides ? 0 : currentSpaceBetween / 2}
            height="100%"
            minHeight={height}
            display="flex"
            justifyContent="space-around"
            gridColumnGap={currentSpaceBetween}
            alignItems={alignItems}
            ref={sliderRef}
            style={{ transform: `translateX(${-mouseX}px)` }}
            css={`
              transition: transform
                ${startCoordinations ? 0 : transitionDuration}ms ease-out;
            `}
          >
            {items.map((item, index) => (
              <div
                key={keyGen(item, index)}
                onDragStart={(event) => event.preventDefault()}
                onClickCapture={handlePreventItemClick}
                css={`
                  user-select: none;
                  visibility: ${isClient ? "visible" : "hidden"};
                `}
              >
                <Box
                  width={
                    fitContentSlides && slidesPerView === 1
                      ? frameWidth
                      : "auto"
                  }
                  position="relative"
                >
                  {renderItem(item, index)}
                </Box>
              </div>
            ))}
          </Flex>
        )}
      </Flex>
      <>
        {showPrevButton && (
          <Button
            onClick={(e) => {
              e.preventDefault();
              goBack();
            }}
            title="Rotate carousel to the left"
            {...controls.prev.position}
            hideOnDisabled={controls.hideOnDisabled}
          >
            {controls.prev.render()}
          </Button>
        )}
        {showNextButton && (
          <Button
            onClick={(e) => {
              goNext();
              e.preventDefault();
            }}
            title="Rotate carousel to the right"
            {...controls.next.position}
            hideOnDisabled={controls.hideOnDisabled}
          >
            {controls.next.render()}
          </Button>
        )}
        {showPagination &&
          paginationRender({
            pageCount: getPagination(),
            goToPage: goToSlide,
            activePage: activePage(),
          })}
      </>
    </Box>
  );
};

export const withFullSizeItems = (Component) => (props) => {
  return (
    <Component {...props} slidesPerView={1} fitContentSlides slideWholeView />
  );
};
