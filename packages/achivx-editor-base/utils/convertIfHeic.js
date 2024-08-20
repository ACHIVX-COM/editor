import heic2any from "heic2any";

const isHeic = (blob) =>
  !["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(blob.type);

export const convertIfHeic = async (blob, desiredQuality = 0.8) => {
  if (isHeic(blob)) {
    let currentQuality = desiredQuality;
    let resultBlob;

    do {
      resultBlob = await heic2any({
        blob,
        toType: "image/jpeg",
        quality: currentQuality,
      });
      currentQuality -= 0.1;
    } while (resultBlob.size > blob.size && currentQuality > 0);

    return new File(
      [resultBlob],
      `${blob.name.split(".").slice(0, -1).join(".")}.jpeg`,
      {
        type: "image/jpeg",
      },
    );
  }

  return blob;
};
