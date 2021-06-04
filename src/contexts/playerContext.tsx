import { createContext, useState, ReactNode, useContext } from "react"; // Invocamos o Context

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
  hasPrevious: boolean;
  hasNext: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  play: (episode: Episode) => void
  playNext: () => void
  playPrevious: () => void
  playList: (list: Episode[], index: number) => void; //void é quando nao retorna nada
  setPlayingState: (state: boolean) => void; //void é quando nao retorna nada
  togglePlay: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  clearPlayerState: () => void;
}

export const PlayerContext = createContext({} as PlayerContextData) // E setamos o tipo no contexto inicial que nesse caso é um objeto vazio

type PlayerContextProviderProps = {
  children: ReactNode;
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps) { // Recupero o children das props
  const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)

  function play(episode: Episode) {
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }

  function playList(list: Episode[], index: number) { // Nessa funcao eu seto a lista de episodios e o index do episodio a ser tocado
    setEpisodeList(list)
    setCurrentEpisodeIndex(index)
    setIsPlaying(true)
  }

  function togglePlay() { // Essa funcao serve para pausar quando for pausado pelo click
    setIsPlaying(!isPlaying)
  }

  function toggleLoop() { // Essa funcao serve para pausar quando for pausado pelo click
    setIsLooping(!isLooping)
  }

  function toggleShuffle() { // Essa funcao serve para pausar quando for pausado pelo click
    setIsShuffling(!isShuffling)
  }

  function setPlayingState(state: boolean) { // Essa funcao serve para pausar quando não for pausado pelo click
    setIsPlaying(state)
  }

  const hasNext = isShuffling || currentEpisodeIndex + 1 < episodeList.length; // Vou exportar essas duas variaveis para desabilitar o botao de proximo e anterior, caso nao tenha
  const hasPrevious = currentEpisodeIndex > 0;

  function playNext() {
    if (isShuffling) { // caso o shuffle esteja ligado eu passo o index aleatorio
      const nextRamdomEpisodeIndex = Math.floor(Math.random() * episodeList.length) // math.floor arrendonda pra um numero inteiro
      setCurrentEpisodeIndex(nextRamdomEpisodeIndex)
    } else if (hasNext) { // Caso o numero que episodio que eu queira setar seja maior do que o numero de episodios que tem, nao permite passar
      setCurrentEpisodeIndex(currentEpisodeIndex + 1)
    }
  }

  function playPrevious() {
    if (hasPrevious) { // So volta a musica se o index do episodio for maior que 0 pq se for 0 n da pra voltar
      setCurrentEpisodeIndex(currentEpisodeIndex - 1)
    }
  }

  function clearPlayerState() {
    setEpisodeList([])
    setCurrentEpisodeIndex(0)
  }

  return ( // O metodo "Component" é como se fosse um componente generico representando todos os outrtos componentes do projeto. 
    <PlayerContext.Provider
      value={{
        episodeList,
        currentEpisodeIndex,
        play,
        playNext,
        playPrevious,
        togglePlay,
        isPlaying,
        setPlayingState,
        playList,
        hasNext,
        hasPrevious,
        toggleLoop,
        toggleShuffle,
        clearPlayerState,
        isLooping,
        isShuffling
      }}
    > {/* Passamos o contexto ao redor de todos os componentes que vao precisar dele */}
      { children }  {/* Seto aqui e o children serve como um componente generico, qqr um que estiver dentro dele recebera os dados do state */}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => { // Essa exportacao aqui é so pra facilitar o import nos componentes que precisaremos recuperar o contexto, ao envez de importar o useContext e depois o Player context, so precisamos importar essa funcao que estamos criando que ja esta impotando as duas coisas aqui.
  return useContext(PlayerContext)
}
