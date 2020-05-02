const {cryptoUtil} = require('../utils');

describe("Crypto Tools", () => {
    it("Crypto Tools should work", () => {
        //Another way to test a boolean
        key=cryptoUtil.getSymmetricKey("mot de passe");
        console.log(key);
        msg= "YEP DaanCovid";
        ciphertext=cryptoUtil.Encrypt(msg,key);
        console.log(ciphertext);
        cleartext=cryptoUtil.Decrypt(ciphertext,key);
        expect(cleartext===msg).toBe(true);

        id="dc76809c-23b2-4e0d-91ce-14aa46aeb5b4";
        SID=cryptoUtil.getSID(id,"mot de passe");
        newId=cryptoUtil.getIdFromSID(SID,"mot de passe");
        console.log(newId);
        console.log(typeof id);
        console.log(typeof newId);
        expect(id===newId).toBe(true);

    });
});