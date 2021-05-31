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
  isPlaying: boolean;
  play: (episode: Episode) => void; //void é quando nao retorna nada
  setPlayingState: (state: boolean) => void; //void é quando nao retorna nada
  togglePlay: () => void;

}

export const PlayerContext = createContext({} as PlayerContextData) // E setamos o tipo no contexto inicial que nesse caso é um objeto vazio