import { createContext } from "react"; // Invocamos o Context

type Episode = { // Tipamos o Context
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
}

type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  play: (episode: Episode) => void; //void é quando nao retorna nada
}

export const PlayerContext = createContext({} as PlayerContextData) // E setamos o tipo no contexto inicial que nesse caso é um objeto vazio