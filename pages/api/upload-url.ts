import aws from 'aws-sdk';
import { AWS } from '../../types/Constants';
import { NextApiRequest, NextApiResponse } from 'next';
import { verify } from 'jsonwebtoken';
import { parse } from 'cookie';
import { DiscordUser } from '../../types/generalTypes';
import User from '../../models/user';
import dbConnect from '../../utils/dbConnect';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.headers.cookie) {
    return null;
  }

  const { token } = parse(req.headers.cookie);
  if (!token) {
    return null;
  }
  const fileKey = req.query.file as string;
  const fileType = req.query.filetype as string;
  try {
    const { ...user } = verify(token, process.env.JWT_CODE) as DiscordUser & {
      iat: number;
      exp: number;
    };
    const discUser: any = await User.findOne({ id: user.id });
    if (!discUser) {
      return res.status(401);
    }

    const url = await getS3Promise(fileType, fileKey).catch((err) =>
      console.log(err)
    );
    return res.status(200).json({ fileKey, url });
  } catch (err) {
    console.error(err);
    return res.status(500);
  }
};

const getS3Promise = async (fileType: string, fileKey: string) => {
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
