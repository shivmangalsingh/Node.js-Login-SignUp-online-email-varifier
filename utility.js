const crypto = require('crypto');

function hashKeyGenerator() {
    const buf = crypto.randomBytes(12);
    return buf.toString('hex');
}
module.exports.hashKeyGenerator = hashKeyGenerator;