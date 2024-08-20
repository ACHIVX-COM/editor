import React from "react";
import styled from "styled-components";
import { layout } from "./system/primitives";
import { Box } from "./system/Box";

const AlternativeSources = ({ src, sizes, buildUrl, sourcesMapper }) =>
  sourcesMapper({
    src,
    sizes,
    buildUrl,
  }).map(({ mime, url, media }) => (
    <source key={url} srcSet={url} type={mime} media={media} />
  ));

const allowedProps = [
  "id",
  "width",
  "height",
  "src",
  "alt",
  "loading",
  "className",
  "onClick",
];

const getNormalizedProps = ({ style, ...props }) => {
  const res = { style };

  Object.keys(props).forEach((name) => {
    const prop = props[name];

    if (typeof prop !== "object") {
      if (name === "width" || name === "height") {
        if (typeof prop === "string") {
          if (prop.endsWith("px")) {
            res[name] = prop?.replace("px", "");
          } else if (/^[0-9]+$/.test(prop)) {
            res[name] = prop;
          }
        }
      } else if (allowedProps.includes(name)) {
        res[name] = prop;
      }
    }
  });

  return { ...res, className: `${res.className}` };
};

const DefaultPicture = styled(Box)`
  display: contents;

  & > source {
    display: none;
  }
`;

const LazyImageImpl = (props) => {
  const {
    src,
    alt = "",
    children,
    pictureComponent: PictureComponent = DefaultPicture,
    priority,
    allSizes: _allSizes,
    sourcesMapper,
    fetchPriority, // high or low
    ...other
  } = props;

  return (
    <PictureComponent as="picture">
      {sourcesMapper ? (
        <AlternativeSources {...props} sourcesMapper={sourcesMapper} />
      ) : null}
      <img
        {...getNormalizedProps(other)}
        fetchPriority={fetchPriority}
        loading={priority ? "eager" : "lazy"}
        alt={alt}
        src={src}
      />
      {children}
    </PictureComponent>
  );
};

export const LazyImage = styled(LazyImageImpl)`
  ${layout}
`;
