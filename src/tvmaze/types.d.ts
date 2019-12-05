export interface Image {
  medium: string;
}

export interface Show {
  id: number;
  name: string;
  image?: Image;
}

export interface Season {
  id: number;
  name: string;
  number: number;
  image?: Image;
}

export interface Episode {
  airstamp: string;
  id: number;
  name: string;
  number: number;
  season: number;
  image?: Image;
}
