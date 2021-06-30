import aws from 'aws-sdk';
import { AWS } from '../types/Constants';

export const getS3Url = async (fileType: string, fileKey: string) => {
  aws.config.update({
    region: AWS.REGION,
    accessKeyId: process.env.S3_ID,
    secretAccessKey: process.env.S3_KEY,
  });
  const signedUrlExpireSeconds = 60 * 5;
  const s3 = new aws.S3({
    apiVersion: AWS.API_VERSION,
    signatureVersion: 'v4',
  });
  return new Promise<string>((resolve, reject) => {
    s3.getSignedUrl(
      'putObject',
      {
        Bucket: AWS.S3_BUCKET,
        ContentType: fileType,
        Key: fileKey,
        Expires: signedUrlExpireSeconds,
      },
      (err, url) => {
        if (err) reject(err.message);
        resolve(url);
      }
    );
  });
};
