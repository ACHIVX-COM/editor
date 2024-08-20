const resolveVariant = ({ error, touched }) => {
  if (error && touched) {
    return "error";
  }

  return "default";
};

export const fromFinalFormFieldMapper = (props) => {
  const { meta, t } = props;
  const { touched } = meta || {};
  const error = meta.error || meta.submitError;

  const variant = resolveVariant({
    error,
    touched,
  });

  // Expected array [errorMessage, errorInfo] or standard final form error.
  // It is needed for mapping error with additional info
  const normalizedError = Array.isArray(error) ? error : [error];

  return {
    message: touched ? t(...normalizedError) : undefined,
    variant,
  };
};
