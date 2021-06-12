import { MovieType } from '../models/movie';
import { UserType } from '../models/user';

export const getMovies = async (): Promise<MovieType[]> => {
  const res: Response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URI}/api/movie`
  );
  // eslint-disable-next-line no-return-await
  const unsortedMovies = await res.json();

  const movies = unsortedMovies.data
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
    .reverse();
  return [];
};

export const getUsers = async (): Promise<UserType[]> => {
  const res: Response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URI}/api/users`
  );
  const data = await res.json();
  return data.users;
};
