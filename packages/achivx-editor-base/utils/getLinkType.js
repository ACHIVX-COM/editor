export const LINK_TYPES = {
  EXTERNAL: "external",
  INTERNAL: "internal",
  JS: "js",
  INVALID: "invalid",
};

export const getLinkType = ({ href }) => {
  const { host } = window.location;
  let url = "";

  if (href.toLowerCase().includes("javascript:")) {
    return { type: LINK_TYPES.JS };
  }

  try {
    url = new URL(href);

    if (url.hostname === "" || !["http:", "https:"].includes(url.protocol)) {
      return { type: LINK_TYPES.INVALID };
    }
  } catch (_) {
    return { type: LINK_TYPES.INVALID };
  }

  if (url.host === host) {
    return { type: LINK_TYPES.INTERNAL };
  }

  return { type: LINK_TYPES.EXTERNAL };
};
