
const crypto = require('crypto');

module.exports = {
    KEY_SIZE: 256,
    SALT: "e5f79c5915c02171eec6b212d5520d44480993d7d622a7c4c2da32f6efda0ffa",
    ALGO_SYM: "aes-256-cbc",
    IV: "qKrtJS287EKQfACW",
    CLEAR_ENCODE: "utf8",
    ENCRYPT_ENCODE: "binary",
    MOD_LENGTH=2048,
    KEY_FORMAT="pem",
    PRINT_FORMAT='base64',
    getSymmetricKey(password) {
        const key = crypto.scryptSync(password, module.exports.SALT, module.exports.KEY_SIZE / 8);

        return key.toString(module.exports.PRINT_FORMAT);
    },

    Encrypt(clearText, skey) {
        try {
            key=new Buffer(skey, module.exports.PRINT_FORMAT);
            const cipher = crypto.createCipheriv(module.exports.ALGO_SYM, key, module.exports.IV);
            return Buffer.concat([
                cipher.update(new Buffer(clearText)),
                cipher.final()
            ]).toString(module.exports.PRINT_FORMAT);
        } catch (error) {
            console.error(error);
        };
    },

    Decrypt(encryptdata, skey) {
        try {
            key=new Buffer(skey, module.exports.PRINT_FORMAT);
            const decipher = crypto.createDecipheriv(module.exports.ALGO_SYM, key, module.exports.IV);
            return Buffer.concat([
                decipher.update(new Buffer(encryptdata, module.exports.PRINT_FORMAT)),
                decipher.final()
            ]).toString(module.exports.CLEAR_ENCODE);
        } catch (error) {
            console.error(error);
        };
    },

    getSID(id, password) {
        key = module.exports.getSymmetricKey(password);
        SID = module.exports.Encrypt(id, key)
        return SID;
    },

    getIdFromSID(SID, password) {
        key = module.exports.getSymmetricKey(password);
        id = module.exports.Decrypt(SID, key)
        return id;
    },
    generateKeyPair(password) {

        const keyPair = crypto.generateKeyPairSync('rsa', {
            modulusLength: module.exports.MOD_LENGTH,
            publicKeyEncoding: {
                type: 'spki',
                format: module.exports.KEY_FORMAT
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: module.exports.KEY_FORMAT,
                cipher: module.exports.ALGO_SYM,
                passphrase: password
            }
        });
        // Creating public and private key file  
        //fs.writeFileSync("public_key", keyPair.publicKey); 
        //fs.writeFileSync("private_key", keyPair.privateKey); 
        return keyPair;
    },
    RSAencrypt(plaintext, publicKey) {
        //const publicKey = fs.readFileSync(publicKeyFile, "utf8");
        const encrypted = crypto.publicEncrypt(
            publicKey, Buffer.from(plaintext));
        return encrypted.toString(module.exports.PRINT_FORMAT);
    },
    RSAdecrypt(ciphertext, privateKey) {
        //const privateKey = fs.readFileSync(privateKeyFile, "utf8");
        const decrypted = crypto.privateDecrypt(
            privateKey, Buffer.from(ciphertext, module.exports.PRINT_FORMAT));
        return decrypted.toString(module.exports.CLEAR_ENCODE);
    }
}