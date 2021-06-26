import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import dbConnect from '../../utils/dbConnect';
import { DiscordGuild, MoveModel } from '../../types/DiscordTypes';
import { verify } from 'jsonwebtoken';
import { parse } from 'cookie';
import User from '../../models/user';
import { DiscordUser } from '../../types/generalTypes';

const GuildAPI = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();
  if (req.method === `POST`) {
    if (!req.headers.cookie) {
      return res.send(401);
    }

    const { token } = parse(req.headers.cookie);
    if (!token) {
      return res.send(401);
    }
    const data: MoveModel = JSON.parse(req.body);

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
        `${process.env.BOT_URL}/api/bot/teams`,
        data
      );
      if (response.status == 200) {
        return res.status(200).send(true);
      } else {
        return res.status(500).send(false);
      }
      // .send({ data: response.data as boolean });
    } catch (err) {
      console.error(err);
      return res.status(500).send(false);
    }
  } else if (req.method === `GET`) {
    if (!req.headers.cookie) {
      return res.send(401);
    }

    const { token } = parse(req.headers.cookie);
    if (!token) {
      return res.send(401);
    }
    try {
      const { ...user } = verify(token, process.env.JWT_CODE) as DiscordUser & {
        iat: number;
        exp: number;
      };

      const discUser = await User.findOne({ id: user.id });
      if (!discUser) {
        return res.status(401);
      }
      const guilds = await axios.get<Array<DiscordGuild>>(
        `${process.env.BOT_URL}/api/bot/guilds?DiscordID=${discUser.id}`
      );

      return res.status(200).send({ data: guilds.data });
    } catch (err) {
      console.error(err);
      return res.status(500);
    }
  } else if (req.method === `DELETE`) {
    return res.status(500);
  } else {
    return res.status(405).json({ message: `method not allowed` });
  }
};

export default GuildAPI;
