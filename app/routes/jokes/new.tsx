import type { ActionFunction } from 'remix';
import type { Joke } from '@prisma/client';
import { redirect } from 'remix';
import { db } from '~/utils/db.server';

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const newJokeObject = Object.fromEntries(form.entries()) as Pick<
    Joke,
    'name' | 'content'
  >;

  const joke: Joke = await db.joke.create({ data: newJokeObject });

  return redirect(`/jokes/${joke.id}`);
};

export default function NewJokeRoute() {
  return (
    <div>
      <p>Add your own hilarious joke</p>
      <form method="post">
        <div>
          <label>
            Name: <input type="text" name="name" />
          </label>
        </div>
        <div>
          <label>
            Content: <textarea name="content" />
          </label>
        </div>
        <div>
          <button type="submit" className="button">
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
