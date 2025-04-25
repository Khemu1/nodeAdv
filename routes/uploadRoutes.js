const requireLogin = require("../middlewares/requireLogin");
const {s3} = require("../services/aws");
const uuid = require("uuid/v1");
module.exports = (app) => {
  app.get("/api/upload", requireLogin, (req, res) => {
    // generate the signed URL and send it to the client
    const key = `${req.user.id}/${uuid()}.jpeg`;
    s3.getSignedUrl(
      "putObject",
      {
        Bucket: "blog-bucket-node-starter",
        ContentType: "jpeg",
        Key: key,
      },
      (err, url) => {
        if (err) {
          res.send(400, err);
        } else {
          res.send({
            url,
            key,
          });
        }
      }
    );
  });
};
