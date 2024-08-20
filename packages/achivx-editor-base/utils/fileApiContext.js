import { useContext, createContext } from "react";

/**
 * @callback AddFileCallback
 * @param {Blob} data
 * @returns {Promise<{}>}
 */

/**
 * @callback RemoveFileCallback
 * @param {string} fileId
 * @returns {Promise<void>}
 */

/**
 * @typedef {Object} FileUploadApi
 * @prop {AddFileCallback} onAddFile
 * @prop {RemoveFileCallback} onRemoveFile
 */

/**
 * @type {import('react').Context<FileUploadApi>}
 */
export const FileApiContext = createContext(null);
export const FileApiProvider = FileApiContext.Provider;

export const useFileApi = () => useContext(FileApiContext);
