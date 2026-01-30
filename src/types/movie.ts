export interface SearchMovie {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
  isInWatchlist?: boolean;
}

export interface MovieDetail extends SearchMovie {
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings?: { Source: string; Value: string }[];
  Metascore: string;
  imdbRating: string;
  BoxOffice: string;
  Source: string;
  Rating: string;
  Value: string;
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

export type WatchlistQuery = {
  filter?: 'movie' | 'series' | 'episode';
  watched?: boolean;
  sort?: 'dateAdded' | 'title' | 'year' | 'rating' | 'myRating';
  order?: 'asc' | 'desc';
};

export type SortOption =
  | "dateAdded-desc"
  | "dateAdded-asc"
  | "title-asc"
  | "title-desc"
  | "year-desc"
  | "year-asc"
  | "rating-desc"
  | "rating-asc";
