import aws from "aws-sdk";

export const useAws = () => {
    aws.config.update({
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY,
        region: process.env.REGION,
        signatureVersion: 'v4',
      });
}