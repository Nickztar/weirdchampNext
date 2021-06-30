import { NextApiRequest, NextApiResponse } from 'next';
import { verify } from 'jsonwebtoken';
import { parse } from 'cookie';
import axios from 'axios';
import { DiscordUser } from '../../types/generalTypes';
import User from '../../models/user';
import dbConnect from '../../utils/dbConnect';
import { PlayEndpointBodyType, S3File } from '../../types/APITypes';
import { useAPIAuth } from '../../utils/useAPIAuth';
import Sounds from '../../models/sounds';

const SoundAPI = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();
  if (req.method === `POST`) {
    if (!req.headers.cookie) {
      return null;
    }

    const { token } = parse(req.headers.cookie);
    if (!token) {
      return null;
    }
    const data: PlayEndpointBodyType = JSON.parse(req.body);

    try {
      const { ...user } = verify(token, process.env.JWT_CODE) as DiscordUser & {
        iat: number;
        exp: number;
      };

      const discUser = await User.findOne({ id: user.id });
      if (!discUser) {
        return res.status(401);
      }

      const response = await axios.post(
        `${process.env.BOT_URL}/api/bot/specific`,
        data
      );
      return res
        .status(200)
        .send({ data: response.data as boolean, type: `addition` });
    } catch (err) {
      console.error(err);
      return res.status(500);
    }
  } else if (req.method === `GET`) {
    try {
      //Fetch sounds from weirdchamp bot.
      const files = await Sounds.find({});
      return res.status(200).send({ data: files as S3File[] });
    } catch (err) {
      console.error(err);
      return res.status(500);
    }
  } else if (req.method === `DELETE`) {
    const { id } = JSON.parse(req.body);
    const discUser = await useAPIAuth(req);
    if (!discUser || !discUser.isAdmin) {
      return res
        .status(401)
        .json({ message: `You are unauthorized to use that :(` });
    }

    return res.status(500);
  } else {
    return res.status(405).json({ message: `method not allowed` });
  }
};

export default SoundAPI;
