function isNil(x) {
  return x === undefined || x === null;
}

export function maxLength(
  max,
  message = `Value must be no more than ${max} characters`,
) {
  return (value = "") => {
    if (isNil(value)) {
      return undefined;
    }

    return value.toString().length <= max ? undefined : message;
  };
}

export function required(message = "Field is required") {
  return (value) => (isNil(value) ? message : undefined);
}

export function nonWhitespace(
  message = "Value must contain something but not only blank spaces",
) {
  return (value) => {
    if (typeof value !== "string") {
      return undefined;
    }

    return /\S/.test(value) ? undefined : message;
  };
}

export function minLength(
  min,
  message = `Value must be at least ${min} characters`,
) {
  return (value) =>
    (value || "").toString().length >= min ? undefined : message;
}

export function isValidLink(message = "Link is invalid") {
  return (value) => {
    try {
      const url = new URL(value);

      if (url.hostname === "" || !["http:", "https:"].includes(url.protocol)) {
        return message;
      }
    } catch (_) {
      return message;
    }

    return undefined;
  };
}

export const allowNil =
  (validator) =>
  (value, ...restArgs) =>
    isNil(value) ? undefined : validator(value, ...restArgs);

export const composeValidators =
  (validators) =>
  async (...args) => {
    for (const validator of validators) {
      const errorMessage = await validator(...args);

      if (errorMessage) {
        return errorMessage;
      }
    }

    return undefined;
  };
