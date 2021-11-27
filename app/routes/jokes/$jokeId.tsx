import type { Joke } from '@prisma/client';
import type { LoaderFunction } from 'remix';
import { useLoaderData, Link } from 'remix';
import { db } from '~/utils/db.server';

export const loader: LoaderFunction = async ({ params }) => {
  const joke: Joke | null = await db.joke.findUnique({
    where: { id: params.jokeId },
  });

  if (!joke) throw new Error('Joke not found');

  return joke;
};

export default function JokeRoute() {
  const joke = useLoaderData<Joke>();

  return (
    <div>
      <p>Here's your hilarious joke:</p>
      <p>{joke.content}</p>
      <Link to=".">{joke.name} Permalink</Link>
    </div>
  );
}
