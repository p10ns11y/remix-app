export default function NewJokeRoute() {
  return (
    <div>
      <h1>New Joke</h1>
      <form method="post">
        <div>
          <label htmlFor="name">Name:</label>
          <input id="name" type="text" name="name" placeholder="Write name" />
        </div>
        <div>
          <label htmlFor="content">Content:</label>
          <textarea id="content" name="content" placeholder="Write content" />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
