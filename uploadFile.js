const uuid = require('uuid');
const aws = require('aws-sdk');

const { BUCKET_NAME } = process.env;

const spacesEndpoint = new aws.Endpoint('nyc3.digitaloceanspaces.com');

const s3 = new aws.S3({
  endpoint: spacesEndpoint,
});

const uploadFile = (fileToUpload) => {
  return new Promise((resolve, reject) => {
    const fileName = uuid.v4();

    s3.upload(
      {
        Bucket: 'tigerthon-dev',
        ACL: 'public-read',
        Key: `tigerthon/${fileName}.png`,
        UploadId: fileName,
        Body: fileToUpload,
      },
      {},
      (err, data) => {
        if (err) reject(err);

        resolve(data);
      },
    );
  });
};

module.exports = uploadFile;
