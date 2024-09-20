const path = require('path');
const { createHash } = require('crypto');
const fs = require('fs');
const { join } = require('node:path');
const { deflateSync } = require('node:zlib');

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
 * @param {string} dataString - The data to hash.
 * @param {string} targetEncoding - Optional. Encoding of the output hash
 * @returns {string} The SHA-1 hash code.
 */
function generateHashCode(dataString, targetEncoding) {
  return createHash('sha1').update(dataString).digest(targetEncoding ?? undefined);
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

function saveFile(data) {
  const hashCode = generateHashCode(data, 'hex');
  const { folder, objectName } = parseHashCode(hashCode);
  const objectFilePath = join(gitFolders.objects, folder);
  fs.mkdirSync(objectFilePath, { recursive: true });

  const compressedData = deflateSync(data);

  fs.writeFileSync(join(objectFilePath, objectName), compressedData);

  return hashCode;
}

module.exports = {
  gitFolders,
  readFile,
  saveFile,
};