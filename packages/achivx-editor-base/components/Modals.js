import React, { useRef } from "react";
import { Form, Field } from "react-final-form";
import styled from "styled-components";
import { Box, Flex, Grid } from "@achivx/editor-base/components/system/Box";
import { Text } from "@achivx/editor-base/components/system/Text";
import { Button, SecondaryButton } from "@achivx/editor-base/components/Button";
import { Modal } from "@achivx/editor-base/components/Modal";
import { TextInput } from "@achivx/editor-base/components/TextInput";
import { Icon, icons } from "@achivx/editor-base/components/Icon";
import { FormFieldLayout } from "@achivx/editor-base/components/form/FormFieldLayout";
import {
  RadialIndeterminate,
  RadialDeterminate,
} from "@achivx/editor-base/components/RadialProgress";
import { TextField } from "@achivx/editor-base/components/TextField";
import { screen } from "@achivx/editor-base/components/system/primitives";
import { useTranslation } from "@achivx/editor-base/translation/useTranslation";
import { ModalPanel } from "./ModalPanel";
import {
  composeValidators,
  isValidLink,
  minLength,
  maxLength,
  nonWhitespace,
  allowNil,
  required,
} from "../utils/validators";
import { ImageEditor } from "./ImageEditor";

export const ExternalLinkWarningModal = ({ href, onDismiss, ...rest }) => {
  const { t } = useTranslation();

  return (
    <Modal
      {...rest}
      onDismiss={onDismiss}
      isClosable
      aria-label={t("External link warning")}
    >
      <Grid gridAutoFlow="row" gridGap="m" p="xxl-5" pt="m">
        <Text preset="h5">{t("Warning")}</Text>
        <Text preset="Body2">
          {t(
            "This is an external link. We are not responsible for the contents of the website that it leads to",
          )}
        </Text>
        <Flex justifyContent="center">
          <SecondaryButton
            size="large"
            onClick={() => {
              window.open(href, "_blank", "noopener, noreferrer");
              onDismiss();
            }}
          >
            {t("Follow anyway")}
          </SecondaryButton>
          <Button size="large" onClick={onDismiss}>
            {t("Cancel")}
          </Button>
        </Flex>
      </Grid>
    </Modal>
  );
};

const validateLink = composeValidators([required(), isValidLink()]);

export const LinkModal = ({ isOpen, onSubmit, onDismiss }) => {
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isOpen}
      aria-label={t("Link")}
      isClosable
      onDismiss={onDismiss}
    >
      <Form onSubmit={onSubmit}>
        {({ handleSubmit, submitting, submitError, hasValidationErrors }) => {
          return (
            <form
              onSubmit={(e) => {
                handleSubmit(e);
                onDismiss();
              }}
            >
              <Grid
                gridAutoFlow="row"
                gridGap={{ _: "s", md: "m" }}
                p={{ _: "s", md: "xxl-5" }}
                pt={{ _: "xxl-5", md: "m" }}
                width={{ _: "unset", md: "700px" }}
                maxWidth="100%"
              >
                <Text preset="h5">{t("Link")}</Text>
                <Box>
                  <Field
                    render={(fieldProps) => (
                      <FormFieldLayout
                        t={t}
                        {...fieldProps}
                        label={t("Display text")}
                      >
                        <TextInput preset="Body1" />
                      </FormFieldLayout>
                    )}
                    name="text"
                    validate={required()}
                  />
                </Box>
                <Box>
                  <Field
                    render={(fieldProps) => (
                      <FormFieldLayout t={t} {...fieldProps} label={t("Link")}>
                        <TextInput preset="Body1" />
                      </FormFieldLayout>
                    )}
                    name="src"
                    validate={validateLink}
                  />
                </Box>
                <Grid
                  mt={{ _: "s", md: "0" }}
                  justifyContent={{ _: "unset", md: "flex-end" }}
                >
                  <Button
                    size="large"
                    type="submit"
                    disabled={submitting || submitError || hasValidationErrors}
                  >
                    {t("Insert")}
                  </Button>
                </Grid>
              </Grid>
            </form>
          );
        }}
      </Form>
    </Modal>
  );
};

export const ImageUploadingModal = (props) => {
  const { t } = useTranslation();

  return (
    <Modal {...props} aria-label={t("Image uploading")}>
      <ModalPanel>
        <RadialIndeterminate radius={60} />
        <Text preset="h3" mt="xs">
          {t("Uploading photo")}
        </Text>
      </ModalPanel>
    </Modal>
  );
};

const DefaultUploadErrorAction = ({ t, onRetry }) => (
  <Button size="large" onClick={onRetry}>
    {t("Try again")}
  </Button>
);

const TryUploadOtherImageAction = ({ t, onDismiss, onChooseAnotherImage }) => (
  <Button size="large" onClick={onChooseAnotherImage || onDismiss}>
    {t("Choose another image")}
  </Button>
);

const uploadErrorActionComponents = new Map([
  [
    "upload_file.unauthorized",
    ({ t, onSignIn }) => (
      <Button size="large" onClick={onSignIn}>
        {t("Sign in")}
      </Button>
    ),
  ],
  ["upload_file.bad_format", TryUploadOtherImageAction],
  ["upload_file.image_too_large", TryUploadOtherImageAction],
  ["upload_file.image_too_small", TryUploadOtherImageAction],
  ["upload_file.file_too_large", TryUploadOtherImageAction],
]);

export const ImageUploadErrorModal = ({
  error,
  errorInfo,
  onRetry,
  onDismiss,
  isOpen,
  ...rest
}) => {
  const { t } = useTranslation();
  const errorMessage = error || "Something went wrong";
  const Action =
    uploadErrorActionComponents.get(errorMessage) || DefaultUploadErrorAction;

  return (
    <Modal
      isClosable
      isOpen={isOpen}
      onDismiss={onDismiss}
      aria-label={t("Image uploading error")}
    >
      <ModalPanel
        buttonsSlot={
          <Action t={t} onDismiss={onDismiss} onRetry={onRetry} {...rest} />
        }
      >
        <RadialDeterminate radius={60} progress={0.75} progressFill="red-600">
          <Icon icon={icons.cross} color="red-600" size="60px" />
        </RadialDeterminate>
        <Text preset="Body1" color="red-600" mt="s" textAlign="center">
          {errorInfo ? t(errorInfo.message, errorInfo.info) : t(errorMessage)}
        </Text>
        <Text preset="h3" mt="xs" mb="m">
          {t("Uploading photo")}
        </Text>
      </ModalPanel>
    </Modal>
  );
};

export const UploadModals = ({ state, send, ...rest }) => {
  if (state.matches("uploading") || state.matches("loading")) {
    return <ImageUploadingModal isOpen />;
  }

  if (state.matches("error")) {
    return (
      <ImageUploadErrorModal
        {...rest}
        isOpen
        onRetry={() => send("RETRY")}
        onDismiss={() => send("DISMISS")}
        error={
          state.context.error?.errors?.image?.message ||
          state.context.error?.message
        }
        errorInfo={state.context.error?.errors?.image}
      />
    );
  }

  return null;
};

const DEFAULT_MIME = "image/jpeg";

const SubmitButton = styled(Button)`
  width: 100%;
  ${screen("sm")} {
    width: unset;
  }
`;

export const ImageEditModal = ({
  isOpen,
  onSubmit,
  onDismiss,
  headerText,
  image,
  configuration,
}) => {
  const {
    minAllowedImageWidth = 590,
    minAllowedImageHeight = 590,
    minAllowedImageAltLength = 5,
    maxAllowedImageAltLength = 25,
  } = configuration;
  const { t } = useTranslation();
  const imageRef = useRef();

  const validateAlt = composeValidators([
    allowNil(nonWhitespace()),
    allowNil(minLength(minAllowedImageAltLength)),
    allowNil(maxLength(maxAllowedImageAltLength)),
  ]);

  const onFormSubmit = async ({ imageAlt }) => {
    const imageBlob = imageRef.current.getImage();

    await onSubmit({ imageBlob, imageAlt });
  };

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismiss}
      isClosable
      aria-label={t("Image edit")}
    >
      <Form onSubmit={onFormSubmit} initialValues={{ imageAlt: image.alt }}>
        {(renderProps) => {
          const error = renderProps.error || renderProps.submitError;

          return (
            <Box
              as="form"
              p={{ _: "s", md: "xxl-5" }}
              pt={{ _: "xxl-3", md: "m" }}
              width={{ _: "unset", md: "700px" }}
              maxWidth="100%"
              onSubmit={renderProps.handleSubmit}
            >
              <Text preset="h5" mb="xs">
                {headerText}
              </Text>
              <ImageEditor
                src={image.url}
                exportOptions={{
                  type: image.mime ?? DEFAULT_MIME,
                  size: image.size,
                }}
                ref={imageRef}
                autoCrop={false}
                cropperStyles={{ maxHeight: { _: "50vh", md: "unset" } }}
                minCropBoxHeight={minAllowedImageHeight}
                minCropBoxWidth={minAllowedImageWidth}
              />
              <Text preset="Body1Semibold" my="s">
                {t("Caption")}
              </Text>
              <Field
                name="imageAlt"
                validate={validateAlt}
                render={(fieldProps) => (
                  <FormFieldLayout t={t} {...fieldProps}>
                    <TextField placeholder={t("It was a beautiful day...")} />
                  </FormFieldLayout>
                )}
              />
              <Flex justifyContent="flex-end" mt="m">
                <SubmitButton
                  type="submit"
                  size="large"
                  disabled={renderProps.submitting}
                >
                  {t("Save and continue")}
                </SubmitButton>
              </Flex>
              {error && (
                <Text preset="Body2" color="red-600" mt="m">
                  {error}
                </Text>
              )}
            </Box>
          );
        }}
      </Form>
    </Modal>
  );
};
