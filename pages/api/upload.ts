import { NextApiRequest, NextApiResponse } from 'next';
import { verify } from 'jsonwebtoken';
import { parse } from 'cookie';
import { DiscordUser } from '../../types/generalTypes';
import User from '../../models/user';
import dbConnect from '../../utils/dbConnect';
import axios from 'axios';

//set bodyparser
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();
  if (req.method === `POST`) {
    if (!req.headers.cookie) {
      return null;
    }

    const { token } = parse(req.headers.cookie);
    if (!token) {
      return null;
    }
    try {
      const { ...user } = verify(token, process.env.JWT_CODE) as DiscordUser & {
        iat: number;
        exp: number;
      };
      const discUser: any = await User.findOne({ id: user.id });
      if (!discUser) {
        return res.status(401);
      }

      return res.status(200);
    } catch (err) {
      console.error(err);
      return res.status(500);
    }
  } else if (req.method === `GET`) {
    return res.status(405);
  } else {
    return res.status(405).send({ message: `method not allowed :(` });
  }
};
