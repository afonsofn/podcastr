import { createContext, useState, ReactNode } from "react"; // Invocamos o Context

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
  // play: (episode: Episode) => void; //void é quando nao retorna nada
  playNext: () => void
  playPrevious: () => void
  playList: (list: Episode[], index: number) => void; //void é quando nao retorna nada
  setPlayingState: (state: boolean) => void; //void é quando nao retorna nada
  togglePlay: () => void;
}



export const PlayerContext = createContext({} as PlayerContextData) // E setamos o tipo no contexto inicial que nesse caso é um objeto vazio

type PlayerContextProviderProps = {
  children: ReactNode;
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps) { // Recupero o children das props
  const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodeIndex, setcurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  
  // function play(episode: Episode) {
  //   setEpisodeList([episode])
  //   setcurrentEpisodeIndex(0)
  //   setIsPlaying(true)
  // }

  function playList(list: Episode[], index: number) { // Nessa funcao eu seto a lista de episodios e o index do episodio a ser tocado
    setEpisodeList(list)
    setcurrentEpisodeIndex(index)
    setIsPlaying(true)
  }

  function togglePlay() { // Essa funcao serve para pausar quando for pausado pelo click
    setIsPlaying(!isPlaying)
  }

  function setPlayingState(state: boolean) { // Essa funcao serve para pausar quando não for pausado pelo click
    setIsPlaying(state)
  }

  function playNext() {
    const nextEpisodeIndex = currentEpisodeIndex + 1

    if (nextEpisodeIndex < episodeList.length) { // Caso o numero que episodio que eu queira setar seja maior do que o numero de episodios que tem, nao permite passar
      setcurrentEpisodeIndex(currentEpisodeIndex + 1)
    }
  }

  function playPrevious() {
    if (currentEpisodeIndex > 0) { // So volta a musica se o index do episodio for maior que 0 pq se for 0 n da pra voltar
      setcurrentEpisodeIndex(currentEpisodeIndex - 1)
    }
  }

  return ( // O metodo "Component" é como se fosse um componente generico representando todos os outrtos componentes do projeto. 
    <PlayerContext.Provider
      value={{
        episodeList,
        currentEpisodeIndex,
        // play,
        playNext,
        playPrevious,
        togglePlay,
        isPlaying,
        setPlayingState,
        playList
      }}
    > {/* Passamos o contexto ao redor de todos os componentes que vao precisar dele */}
      { children }  {/* Seto aqui e o children serve como um componente generico, qqr um que estiver dentro dele recebera os dados do state */}
    </PlayerContext.Provider>
  )
}