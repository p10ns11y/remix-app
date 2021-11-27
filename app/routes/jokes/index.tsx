import type { LoaderFunction } from 'remix';
import type { Joke } from '@prisma/client';
import { useLoaderData, Link } from 'remix';
import { db } from '~/utils/db.server';

export const loader: LoaderFunction = async () => {
  const count = await db.joke.count();
  const randomRowNumber = Math.floor(Math.random() * count);
  const [randomJoke] = await db.joke.findMany({
    take: 1,
    skip: randomRowNumber,
    select: { content: true, name: true, id: true },
  });

  return randomJoke as Joke;
};

export default function JokesIndexRoute() {
  const randomJoke = useLoaderData<Pick<Joke, 'id' | 'content' | 'name'>>();
  return (
    <div>
      <p>Here's a random joke:</p>
      <p>{randomJoke.content}</p>
      <Link to={randomJoke.id}>"{randomJoke.name}" Permalink</Link>
    </div>
  );
}
