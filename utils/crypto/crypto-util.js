
const crypto = require('crypto');

module.exports = {
    KEY_SIZE: 256,
    SALT: "e5f79c5915c02171eec6b212d5520d44480993d7d622a7c4c2da32f6efda0ffa",
    ALGO_SYM: "aes-256-cbc",
    IV: "qKrtJS287EKQfACW",
    CLEAR_ENCODE: "utf8",
    ENCRYPT_ENCODE: "binary",
    getSymmetricKey(password) {
        const key = crypto.scryptSync(password, module.exports.SALT, module.exports.KEY_SIZE / 8);

        return key;
    },

    Encrypt(clearText, key) {
        try {
            const cipher = crypto.createCipheriv(module.exports.ALGO_SYM, key, module.exports.IV);
            return Buffer.concat([
                cipher.update(clearText),
                cipher.final()
            ]);
        } catch (error) {
            console.error(error);
        };
    },

    Decrypt(encryptdata, key) {
        try {
            const decipher = crypto.createDecipheriv(module.exports.ALGO_SYM, key, module.exports.IV);
            return Buffer.concat([
                decipher.update(encryptdata),
                decipher.final()
            ]);
        } catch (error) {
            console.error(error);
        };
    },

    getSID(id, password) {
        key = getSymmetricKey(password);
        SID = Encrypt(id, key)
        return SID;
    },
}