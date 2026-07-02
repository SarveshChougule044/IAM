// backend/utils/fileStore.js
// Lightweight file-based storage replacing MongoDB
const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "../data");

// Ensure data dir exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

/**
 * Read a JSON file from DATA_DIR. Returns [] if file does not exist.
 */
function readJSON(filename) {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) return [];
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Overwrite a JSON file in DATA_DIR with given data array.
 */
function writeJSON(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

/**
 * Find one record matching predicate fn. Returns null if not found.
 */
function findOne(filename, predicate) {
  const records = readJSON(filename);
  return records.find(predicate) || null;
}

/**
 * Find all records matching predicate fn. Returns [].
 */
function findAll(filename, predicate) {
  const records = readJSON(filename);
  return predicate ? records.filter(predicate) : records;
}

/**
 * Insert a new record. Returns the inserted record.
 */
function insertOne(filename, record) {
  const records = readJSON(filename);
  records.push(record);
  writeJSON(filename, records);
  return record;
}

/**
 * Update records matching predicate. Returns number of records updated.
 */
function updateOne(filename, predicate, updater) {
  const records = readJSON(filename);
  let updated = 0;
  const newRecords = records.map((r) => {
    if (predicate(r)) {
      updated++;
      return { ...r, ...updater(r), updatedAt: new Date().toISOString() };
    }
    return r;
  });
  writeJSON(filename, newRecords);
  return updated;
}

/**
 * Delete records matching predicate. Returns number deleted.
 */
function deleteMany(filename, predicate) {
  const records = readJSON(filename);
  const filtered = records.filter((r) => !predicate(r));
  const deleted = records.length - filtered.length;
  writeJSON(filename, filtered);
  return deleted;
}

/**
 * Count records matching optional predicate.
 */
function count(filename, predicate) {
  const records = readJSON(filename);
  return predicate ? records.filter(predicate).length : records.length;
}

module.exports = {
  readJSON,
  writeJSON,
  findOne,
  findAll,
  insertOne,
  updateOne,
  deleteMany,
  count,
};
