export interface Image {
  medium: string;
}

export interface Show {
  id: number;
  name: string;
  image?: Image;
}

interface Season {
  id: number;
  name: string;
  number: number;
  image?: Image;
}

interface Episode {
  airdate: string;
  id: number;
  name: string;
  number: number;
  season: number;
  image?: Image;
}
