const path = require('path');
const { createHash } = require('crypto');

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

module.exports = {
  generateHashCode,
  gitFolders,
  parseHashCode,
};