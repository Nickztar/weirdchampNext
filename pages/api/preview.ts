import { NextApiRequest, NextApiResponse } from 'next';
import { verify } from 'jsonwebtoken';
import { parse } from 'cookie';
import { DiscordUser } from '../../types/generalTypes';
import User from '../../models/user';
import dbConnect from '../../utils/dbConnect';
import axios from 'axios';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();
  if (req.method === `GET`) {
    if (!req.headers.cookie) {
      return null;
    }

    const { token } = parse(req.headers.cookie);
    if (!token) {
      return null;
    }
    const key = req.query.key as string;
    try {
      const { ...user } = verify(token, process.env.JWT_CODE) as DiscordUser & {
        iat: number;
        exp: number;
      };
      const discUser: any = await User.findOne({ id: user.id });
      if (!discUser) {
        return res.status(401);
      }

      const response = await axios.get(
        `${process.env.BOT_URL}/api/aws/geturlbykey?key=${key}`
      );
      return res.status(200).json({ url: response.data as string });
      // const review = {
      //     // eslint-disable-next-line no-underscore-dangle
      //     user: discUser._id,
      //     comment,
      //     rating,
      //   };

      //   const movie: MovieType = await Movie.findOne({ _id: movieID });
      //   if (!movie) {
      //     return res.status(404);
      //   }
      //   const existingReview = movie.reviews.filter(
      //     // eslint-disable-next-line no-underscore-dangle
      //     (rv) => rv.user.toString() === discUser._id.toString()
      //   )[0];
      //   if (existingReview) {
      //     const index = movie.reviews.indexOf(existingReview);
      //     movie.reviews.splice(index, 1);
      //   }
      //   movie.reviews.push(review);
      //   movie.numReviews = movie.reviews.length;
      //   movie.rating =
      //     Math.round(
      //       (movie.reviews.reduce<number>((a, b) => a + b.rating, 0) /
      //         movie.reviews.length) *
      //         10
      //     ) / 10;
      //   movie.markModified(`reviews`);
      //   await movie.save();
      //   return res
      //     .status(200)
      //     .json({ movie, type: existingReview ? `modification` : `addition` });
    } catch (err) {
      console.error(err);
      return res.status(500);
    }
  } else if (req.method === `DELETE`) {
    // TODO Delete reviews...
    return res.status(405);
  } else {
    return res.status(405).send({ message: `method not allowed :(` });
  }
};
