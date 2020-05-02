const {cryptoUtil} = require('../utils');

describe("getSymmetricKey(password)", () => {
    it("should return random string", () => {
        //Another way to test a boolean
        key=cryptoUtil.getSymmetricKey("mot de passe");
        msg= new Buffer("YEP DaanCovid")
        ciphertext=cryptoUtil.Encrypt(msg,key);
        expect(cryptoUtil.Decrypt(ciphertext,key).toString('utf8')===msg.toString('utf8')).toBe(true);
    });
});