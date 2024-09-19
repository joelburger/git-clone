const path = require('path');
const { createHash } = require('crypto');
const fs = require('fs');
const zlib = require('zlib');

/**
 * An object containing paths to various git-related folders.
 */
const gitFolders = {
  objects: path.join(process.cwd(), '.git', 'objects'),
  refs: path.join(process.cwd(), '.git', 'refs'),
  root: path.join(process.cwd(), '.git'),
};

/**
 * Parses a hash code into its folder and object name components.
 *
 * @param {string} hashCode - The 40-character hash code to parse.
 * @returns {Object} An object containing the folder and objectName.
 * @throws {Error} If the hash code is invalid (null, undefined, or less than 40 characters)
 */
function parseHashCode(hashCode) {
  if (!hashCode || hashCode.length < 40) {
    throw new Error('Invalid hash code');
  }

  const folder = hashCode.slice(0, 2);
  const objectName = hashCode.slice(2);

  return { folder, objectName };
}

/**
 * Generates a SHA-1 hash code for the given data.
 *
 * @param {string|Buffer} data - The data to hash.
 * @returns {string} The 40-character SHA-1 hash code.
 */
function generateHashCode(data) {
  return createHash('sha1').update(data).digest('hex');
}

/**
 * Reads a file from the .git/objects directory based on its hash code.
 *
 * @param {string} hashCode - The 40-character hash code of the object to read.
 * @returns {Buffer} The content of the object file.
 * @throws {Error} If the object file is not found or the hash code is invalid.
 */
function readFile(hashCode) {
  const { folder, objectName } = parseHashCode(hashCode);
  const objectPath = path.join(gitFolders.objects, folder, objectName);

  if (!fs.existsSync(objectPath)) {
    throw new Error(`Object file not found: ${objectPath}`);
  }

  return fs.readFileSync(objectPath);
}

/**
 * Fetches a blob by its hash code.
 *
 * @param {string} hashCode - The 40-character hash code of the object to fetch.
 * @returns {Object} An object containing the header and content of the blob.
 * @throws {Error} If the object file is not found or the hash code is invalid.
 */
function fetchBlob(hashCode) {
  const data = readFile(hashCode);
  const buffer = zlib.inflateSync(data);
  const headerEnd = buffer.indexOf('\0') + 1;
  const header = buffer.subarray(0, headerEnd).toString('utf8');
  const content = buffer.subarray(headerEnd).toString('utf8');

  return {
    header,
    content,
  };
}

/**
 * Fetches a tree object by its hash code.
 *
 * @param {string} hashCode - The 40-character hash code of the tree object to fetch.
 * @returns {Array} An array of objects, each containing the mode and name of a folder.
 * @throws {Error} If the object file is not found or the hash code is invalid.
 */
function fetchTree(hashCode) {
  const data = readFile(hashCode);
  const buffer = zlib.inflateSync(data);
  const headerEnd = buffer.indexOf('\0') + 1;
  const folders = [];
  let cursor = headerEnd;

  while (cursor < buffer.length) {
    const metadataEnd = buffer.indexOf('\0', cursor);
    const [mode, name] = buffer.subarray(cursor, metadataEnd).toString('utf8').split(' ');
    folders.push({ mode, name });
    cursor = metadataEnd + 1 + 20; // skip metadata and hashcode
  }

  return folders;
}

/**
 * Saves a git object to the .git/objects directory.
 *
 * @param {string} content - The content of the object to save.
 * @returns {string} The 40-character SHA-1 hash code of the saved object.
 */
function saveObject(content) {
  const objectData = `blob ${content.length}\0${content}`;
  const hashCode = generateHashCode(objectData);
  const { folder, objectName } = parseHashCode(hashCode);
  const objectFilePath = path.join(gitFolders.objects, folder);

  fs.mkdirSync(objectFilePath, { recursive: true });

  const compressedData = zlib.deflateSync(objectData);
  fs.writeFileSync(path.join(objectFilePath, objectName), compressedData);

  return hashCode;
}

module.exports = {
  generateHashCode,
  fetchBlob,
  fetchTree,
  gitFolders,
  parseHashCode,
  saveObject
};