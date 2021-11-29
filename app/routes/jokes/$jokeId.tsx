import type { Joke } from '@prisma/client';
import type { LoaderFunction, MetaFunction, ActionFunction } from 'remix';
import {
  useLoaderData,
  Link,
  useParams,
  useCatch,
  Form,
  redirect,
} from 'remix';
import { db } from '~/utils/db.server';
import { requireUserId } from '~/utils/session.server';

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

export const meta: MetaFunction = ({ data: joke }: { data: Joke | null }) => {
  if (!joke) {
    return {
      title: 'No joke',
      description: 'No joke found',
    };
  }
  return {
    title: `"${joke.name}" joke`,
    description: `Enjoy the "${joke.name}" joke and much more`,
  };
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();

  if (formData.get('_method') === 'delete') {
    const userId = await requireUserId(request);
    const joke = await db.joke.findUnique({
      where: {
        id: params.jokeId,
      },
    });

    if (!joke) {
      throw new Response("Can't delete what does not exist", { status: 404 });
    }

    if (joke.jokesterId !== userId) {
      throw new Response("Pssh, nice try. That's not your joke", {
        status: 401,
      });
    }

    await db.joke.delete({ where: { id: params.jokeId } });

    return redirect('/jokes');
  }
};

export default function JokeRoute() {
  const joke = useLoaderData<Joke>();

  return (
    <div>
      <p>Here's your hilarious joke:</p>
      <p>{joke.content}</p>
      <Link to=".">{joke.name} Permalink</Link>
      <Form method="post">
        <input type="hidden" name="_method" value="delete" />
        <button type="submit" className="button">
          Delete
        </button>
      </Form>
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
