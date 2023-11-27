import { sql } from "@vercel/postgres";

export default async function Home() {
  let time = await fetch(
    "https://worldtimeapi.org/api/timezone/Europe/London",
    { next: { revalidate: 10 } }
  );
  const data = await time.json();

  const datetime = new Date(data.datetime);
  const readableDate = datetime.toLocaleTimeString("en-GB");

  await sql`INSERT INTO ViewsTable (views) SELECT 0 WHERE NOT EXISTS (SELECT * FROM ViewsTable)`;

  await sql`UPDATE ViewsTable SET views = views + 1`;
  const result = await sql`SELECT views from ViewsTable`;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Time and Views Page!</h1>
      <h2>Now with more vitamins!</h2>
      <p>This has been viewed {result.rows[0].views}</p>
      <p>The time is : {readableDate}</p>
    </main>
  );
}
