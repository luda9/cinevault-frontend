export interface Movie {
  Poster: string;
  Title: string;
  Type: string;
  Year: string;
  imdbID: string;
  isInWatchList: boolean;
  Director: string;
  Plot: string;
  Metascore: string;
  imdbId: string;
  Rated: string;
  Runtime: string;
  Genre: string;
  imdbRating: string;
  Writer: string;
  Actors: string;
  Language: string;
  Country: string;
  Released: string;
  BoxOffice: string;
  Awards: string;
}

export type WatchlistItem = {
  id: number;
  imdbId: string;
  title: string;
  year: string;
  poster: string;
  type: 'movie' | 'series';
  imdbRating: string;
  genre: string;
  watched: boolean;
  myRating: number | null;
  dateAdded: string;
  runtime: string;
};

type WatchlistQuery = {
  filter?: 'movie' | 'series' | 'episode';
  watched?: boolean;
  sort?: 'dateAdded' | 'title' | 'year' | 'rating' | 'myRating';
  order?: 'asc' | 'desc';
};
