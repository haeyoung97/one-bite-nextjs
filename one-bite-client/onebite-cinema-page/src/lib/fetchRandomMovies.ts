import { MovieData } from "@/types";

export default async function fetchRandomMovies(): Promise<MovieData[]> {
  const url = `https://onebite-cinema-api-xi.vercel.app/movie/random`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error();

    return await response.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}
