import { UserType } from '../models/user';
import { S3File } from '../types/APITypes';

export const getSounds = async (): Promise<S3File[]> => {
  const res: Response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URI}/api/sounds`
  );
  // eslint-disable-next-line no-return-await
  const unsortedSounds = await res.json();

  const sounds = unsortedSounds.data;
  return sounds;
};

export const getUsers = async (): Promise<UserType[]> => {
  const res: Response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URI}/api/users`
  );
  const data = await res.json();
  return data.users;
};
