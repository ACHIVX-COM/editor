import getVideoId from "get-video-id";
import { Field, Form } from "react-final-form";
import React from "react";
import { Box, Grid } from "@achivx/editor-base/components/system/Box";
import { Text } from "@achivx/editor-base/components/system/Text";
import { TextInput } from "@achivx/editor-base/components/TextInput";
import { Button } from "@achivx/editor-base/components/Button";
import { FormFieldLayout } from "./form/FormFieldLayout";
import { useTranslation } from "@achivx/editor-base/translation/useTranslation";
import { composeValidators, required } from "../utils/validators";

const formaters = new Map([
  ["youtube", (id) => `https://www.youtube.com/embed/${id}`],
  ["vimeo", (id) => `https://player.vimeo.com/video/${id}`],
]);

const formatVideoURL = (data) => {
  const copy = { ...data };
  const { id, service } = getVideoId(copy.video);

  copy.video = formaters.get(service)?.(id) ?? copy.video;

  return copy;
};

const validateVideoURL = () => (videoUrl) => {
  const { service } = getVideoId(videoUrl ?? "");

  if (!formaters.get(service)) {
    return "Unsupported video provider";
  }

  return undefined;
};

const videoFieldValidator = composeValidators([required(), validateVideoURL()]);

export const AddVideoForm = ({ onSubmit }) => {
  const { t } = useTranslation();

  return (
    <Form onSubmit={(data) => onSubmit(formatVideoURL(data))}>
      {({ handleSubmit }) => {
        return (
          <form onSubmit={handleSubmit}>
            <Box
              p={{ _: "s", md: "xxl-5" }}
              pt={{ _: "xxl-5", md: "m" }}
              width={{ _: "unset", md: "700px" }}
              maxWidth="100%"
            >
              <Text preset="h5">{t("Uploading video")}</Text>
              <Box my="m">
                <Field name="video" validate={videoFieldValidator}>
                  {(fieldProps) => (
                    <FormFieldLayout t={t} {...fieldProps}>
                      <TextInput preset="Body1" />
                    </FormFieldLayout>
                  )}
                </Field>
              </Box>
              <Text mb="xs" preset="Body2">
                {t(
                  "Insert a third-party video from one of the following providers",
                )}
              </Text>
              <Text preset="Body2Semibold">YouTube</Text>
              <Text preset="Body2">
                http://www.youtube.com/watch?v=uN1qUeId
              </Text>
              <Text preset="Body2Semibold">Vimeo</Text>
              <Text preset="Body2">http://www.vimeo.com/123456</Text>
              <Grid
                mt={{ _: "s", md: "0" }}
                justifyContent={{ _: "unset", md: "flex-end" }}
                gridAutoFlow={{ _: "row", md: "column" }}
                gridGap={{ _: "xs", md: "xxl-2" }}
              >
                <Button size="large" order="1" type="submit">
                  {t("Insert")}
                </Button>
              </Grid>
            </Box>
          </form>
        );
      }}
    </Form>
  );
};
