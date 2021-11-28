import type { Joke } from '@prisma/client';
import type { LoaderFunction } from 'remix';
import { useLoaderData, Link, useParams, useCatch } from 'remix';
import { db } from '~/utils/db.server';

export const loader: LoaderFunction = async ({ params }) => {
  const joke: Joke | null = await db.joke.findUnique({
    where: { id: params.jokeId },
  });

  if (!joke) {
    throw new Response('What a joke! Not found.', {
      status: 404,
    });
  }

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

export function CatchBoundary() {
  let caught = useCatch();
  let params = useParams();
  if (caught.status === 404) {
    return (
      <div className="error-container">
        Huh? What the heck is "{params.jokeId}"?
      </div>
    );
  }
  throw new Error(`Unhandled error: ${caught.status}`);
}

export function ErrorBoundary() {
  let { jokeId } = useParams();
  return (
    <div className="error-container">{`There was an error loading joke by the id ${jokeId}. Sorry.`}</div>
  );
}
