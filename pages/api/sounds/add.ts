import { NextApiRequest, NextApiResponse } from 'next';
import { verify } from 'jsonwebtoken';
import { parse } from 'cookie';
import dbConnect from '../../../utils/dbConnect';
import User, { UserType } from '../../../models/user';
import Sound, { SoundType } from '../../../models/sounds';
import { DiscordUser } from '../../../types/generalTypes';
import { S3File } from '../../../types/APITypes';

const AddSound = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();
  if (req.method === `POST`) {
    if (!req.headers.cookie) {
      return null;
    }

    const { token } = parse(req.headers.cookie);
    if (!token) {
      return null;
    }

    const data: S3File = JSON.parse(req.body);

    try {
      const { ...user } = verify(token, process.env.JWT_CODE) as DiscordUser & {
        iat: number;
        exp: number;
      };

      const discUser: UserType = await User.findOne({ id: user.id });
      if (!discUser) {
        return res.status(401);
      }

      const displayName = data.key
        .replace(/(.wav)|(.mp3)/gm, '')
        .replace(/_/gm, ' ');

      let newSound: SoundType = new Sound({
        CreatedBy: discUser.id,
        DisplayName: displayName,
        key: data.key,
        Size: data.Size,
        // NameHash: await sha256(displayName), //TODO!
        LastModified: Date.now(),
      });
      await newSound.save();

      return res.status(200).send({ data: newSound, type: `addition` });
    } catch (err) {
      console.error(err);
      return res.status(500);
    }
  } else if (req.method === `GET`) {
    try {
      return res.status(200).send({ data: '' });
    } catch (err) {
      console.error(err);
      return res.status(500);
    }
  } else if (req.method === `DELETE`) {
    return res
      .status(401)
      .json({ message: `You are unauthorized to use that :(` });
  } else {
    return res.status(405).json({ message: `method not allowed` });
  }
};

export default AddSound;
