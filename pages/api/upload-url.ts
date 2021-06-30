import aws from 'aws-sdk';
import { AWS } from '../../types/Constants';
import { NextApiRequest, NextApiResponse } from 'next';
import { verify } from 'jsonwebtoken';
import { parse } from 'cookie';
import { DiscordUser } from '../../types/generalTypes';
import User from '../../models/user';
import dbConnect from '../../utils/dbConnect';
import { getS3Url } from './../../utils/S3Utils';
import formidable from 'formidable';
import axios from 'axios';
import Sound, { SoundType } from '../../models/sounds';
import { sha256 } from '../../utils/hash';
import fs from 'fs';
import util from 'util';
export const config = {
  api: {
    bodyParser: false,
  },
};
interface ParsedFile {
  fields: formidable.Fields;
  files: formidable.Files;
}

const readFile = util.promisify(fs.readFile);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method != 'PUT') res.status(400);
  if (!req.headers.cookie) {
    return res.status(401);
  }

  const { token } = parse(req.headers.cookie);
  if (!token) {
    return res.status(401);
  }
  const fileKey = req.query.file as string;
  const fileType = req.query.filetype as string;
  try {
    await dbConnect();
    const { ...user } = verify(token, process.env.JWT_CODE) as DiscordUser & {
      iat: number;
      exp: number;
    };
    const discUser: DiscordUser = await User.findOne({ id: user.id });
    if (!discUser) {
      return res.status(401);
    }

    const data = await new Promise<ParsedFile>(function (resolve, reject) {
      const form = new formidable.IncomingForm({ keepExtensions: true });
      form.parse(req, function (err: any, fields, files) {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });
    const url = (await getS3Url(fileType, fileKey).catch((err) =>
      console.log(err)
    )) as string;
    if (data.files == null || url == null) return res.status(400);
    const file = data.files.file as any; //The types are pretty fucked up...
    const fileRead = await readFile(file.path);
    const upload = await axios.put(url, fileRead, {
      headers: { 'Content-type': fileType },
    });
    if (upload.status == 200) {
      const displayName = fileKey
        .replace(/(.wav)|(.mp3)/gm, '')
        .replace(/_/gm, ' ');
      let newSound: SoundType = new Sound({
        CreatedBy: discUser.id, //Dont really know who uploaded these, just default to me
        DisplayName: displayName,
        key: fileKey,
        Size: file.size,
        NameHash: sha256(displayName),
        LastModified: Date.now(),
      });

      const sound = await newSound.save();
      return res.status(200).json({ sound });
    }
    return res.status(500);
  } catch (err) {
    console.error(err);
    return res.status(500);
  }
};
