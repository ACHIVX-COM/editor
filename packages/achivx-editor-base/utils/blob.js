export const dataURItoBlob = (dataURI) => {
  const mime = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const binary = atob(dataURI.split(",")[1]);
  const array = [];

  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }

  return new Blob([new Uint8Array(array)], { type: mime });
};

export const getCompressedBlob = ({
  canvas,
  type,
  desiredQuality,
  originalSize,
}) => {
  let currentQuality = desiredQuality;
  let blob;

  do {
    const data = canvas.toDataURL(type, currentQuality);

    blob = dataURItoBlob(data);
    currentQuality -= 0.1;
  } while (blob.size > originalSize && currentQuality > 0);

  return blob;
};
