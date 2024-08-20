import { Value, Block } from "slate";
import { getLinkType, LINK_TYPES } from "../utils/getLinkType";
import React, { useState } from "react";
import styled from "styled-components";
import { Text } from "@achivx/editor-base/components/system/Text";
import { LazyImage } from "@achivx/editor-base/components/LazyImage";
import { ExternalLinkWarningModal } from "./Modals";

export const DEFAULT_NODE = "paragraph";

export const EMPTY_VALUE = Value.fromJSON({
  document: {
    nodes: [
      {
        object: "block",
        type: "paragraph",
        nodes: [
          {
            object: "text",
            leaves: [
              {
                text: "",
              },
            ],
          },
        ],
      },
    ],
  },
});

export const schema = {
  document: {
    normalize: (editor, { code, node }) => {
      if (code === "last_child_type_invalid") {
        const paragraph = Block.create("paragraph");

        return editor.insertNodeByKey(node.key, node.nodes.size, paragraph);
      }

      return null;
    },
    last: { type: "paragraph" },
  },
  blocks: {
    image: {
      isVoid: true,
    },
    video: {
      isVoid: true,
    },
    marks: {
      highlight: {
        isAtomic: true,
      },
    },
  },
};

export const Frame = styled.iframe.attrs({
  type: "text/html",
})`
  display: block;
  border: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export const ImageUI = styled(LazyImage)`
  display: block;
  max-width: 100%;
  margin: 0 auto 0;
  transition: box-shadow 0.3s var(--theme-timing-functions-standard);

  &:hover {
    box-shadow: var(--theme-shadows-elevation-5);
  }
`;

const Quote = styled.blockquote`
  background-color: var(--theme-colors-neutral-050);
  margin: var(--theme-spacings-xxs);
  margin-left: var(--theme-spacings-s);
  padding: var(--theme-spacings-s);
  padding-left: var(--theme-spacings-xxl-2);
  border-left: 4px solid var(--theme-colors-primary-400);
  &:not([data-empty*="false"]) {
    &:after {
      content: attr(data-text);
      color: var(--theme-colors-neutral-400);
    }
    * br {
      display: none;
    }
    * {
      display: inline;
    }
  }
`;

const LinkBase = styled.a`
  text-decoration: none;
  background-color: var(--theme-colors-white);
  color: ${(props) =>
    props.selected
      ? "var(--theme-colors-primary-600)"
      : "var(--theme-colors-blue-600)"};
  cursor: pointer;
  &:hover,
  &:focus {
    color: var(--theme-colors-primary-600);
    text-decoration: underline;
  }
  &:active {
    text-decoration: underline;
  }
`;

const Link = ({ children, href, selected, ...rest }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { type } = getLinkType({ href });

  if (type === LINK_TYPES.INTERNAL) {
    return (
      <LinkBase {...rest} href={href} selected={selected}>
        {children}
      </LinkBase>
    );
  }

  if (type === LINK_TYPES.EXTERNAL) {
    return (
      <>
        <LinkBase
          {...rest}
          selected={selected}
          target="_blank"
          rel="ugc noopener noreferrer nofollow"
          href={href}
          onClick={(e) => {
            e.preventDefault();
            setIsModalOpen(true);
          }}
        >
          {children}
        </LinkBase>
        <ExternalLinkWarningModal
          isOpen={isModalOpen}
          href={href}
          onDismiss={() => setIsModalOpen(false)}
        />
      </>
    );
  }

  return null;
};

export const renderMark = (props, editorInstance, next) => {
  const { children, mark, attributes } = props;

  switch (mark.type) {
    case "highlight":
      return (
        <span
          {...attributes}
          style={{ backgroundColor: "var(--theme-colors-yellow-100)" }}
        >
          {children}
        </span>
      );
    case "bold":
      return <strong {...attributes}>{children}</strong>;
    case "code":
      return <code {...attributes}>{children}</code>;
    case "italic":
      return <em {...attributes}>{children}</em>;
    case "underlined":
      return <u {...attributes}>{children}</u>;
    case "strikethrough":
      return <del {...attributes}>{children}</del>;
    default:
      return next();
  }
};

export const renderGenericBlock = (props, editorInstance, next) => {
  const { attributes, children, node, isFocused } = props;

  switch (node.type) {
    case "paragraph":
      return (
        <Text as="p" m="0" {...attributes}>
          {children}
        </Text>
      );
    case "block-quote":
      return (
        <Quote
          data-empty={
            node.text === "" && node.nodes.first().type === DEFAULT_NODE
          }
          data-text={node.data.get("placeholder")}
          {...attributes}
        >
          {children}
        </Quote>
      );
    case "bulleted-list":
      return <ul {...attributes}>{children}</ul>;
    case "heading-one":
      return (
        <Text preset="h2" as="h2" m="0" {...attributes}>
          {children}
        </Text>
      );
    case "heading-two":
      return (
        <Text preset="h3" as="h3" m="0" {...attributes}>
          {children}
        </Text>
      );
    case "list-item":
      return <li {...attributes}>{children}</li>;
    case "numbered-list":
      return <ol {...attributes}>{children}</ol>;
    case "link": {
      const href = node.data.get("src");

      return (
        <Link {...attributes} selected={isFocused} href={href}>
          {children}
        </Link>
      );
    }
    default:
      return next();
  }
};
