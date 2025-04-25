const Keygrip = require("keygrip");
const { Buffer } = require("buffer");

module.exports = (user) => {
  const sessionObject = {
    passport: {
      user: user._id.toString(), // mongoose return and id object not just the id
    },
  };
  const sessionString = Buffer.from(JSON.stringify(sessionObject)).toString(
    "base64"
  );
  const keys = require("../../config/keys");
  const keygrip = new Keygrip([keys.cookieKey]);
  // sign the session string
  const signedSessionString = keygrip.sign("session=" + sessionString);
  return {
    session: sessionString,
    sig: signedSessionString,
  };
};
