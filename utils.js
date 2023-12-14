const crypto = require("crypto");

const generateInvitationCode = (
  segmentLength = 4,
  segmentCount = 3,
  separator = "-"
) => {
  const charset = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let segments = [];

  for (let i = 0; i < segmentCount; i++) {
    let segment = "";
    let bytes = crypto.randomBytes(segmentLength);
    for (let j = 0; j < segmentLength; j++) {
      // Use bitwise operation to ensure the random number falls within the range of the charset length
      let randomIndex = bytes[j] % charset.length;
      segment += charset[randomIndex];
    }
    segments.push(segment);
  }

  return segments.join(separator);
};

const isValidEmail = (email) => {
  let filter =
    /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
  return String(email).search(filter) != -1;
};

module.exports = {
  generateInvitationCode,
  isValidEmail,
};
