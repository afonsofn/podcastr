import { createContext, useState, ReactNode, useContext } from "react"

// ------> <Types> <------ \\

type Episode = { // Tipamos o Context
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
}

type PlayerContextData = {
  episodeList: Episode[]; // Dessa forma é tipando um Array desse tipo de objetos
  currentEpisodeIndex: number;
  hasNext: boolean;
  hasPrevious: boolean;
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  play: (episode: Episode) => void; // Dessa forma é tipando o objeto Episode
  playList: (list: Episode[], index: number) => void; //void é quando nao retorna nada
  playNext: () => void;
  playPrevious: () => void;
  setPlayingState: (state: boolean) => void;
  togglePlay: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  clearPlayerState: () => void;
}

export const PlayerContext = createContext({} as PlayerContextData) // E setamos o tipo no contexto inicial que nesse caso é um objeto vazio

type PlayerContextProviderProps = {
  children: ReactNode;
}

// Recupero o children das props que é um componente genérico pra simular um componente qualquer que o contexto vai envolver
export function PlayerContextProvider({ children }: PlayerContextProviderProps) {

  // ------> <States> <------ \\

  const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)

  // Vou exportar essas duas variaveis para desabilitar o botao de proximo e anterior, caso nao tenha
  const hasNext = isShuffling || currentEpisodeIndex + 1 < episodeList.length; 
  const hasPrevious = currentEpisodeIndex > 0;

  // ------> <Functions> <------ \\
  
  // Toca a próxima música da lista.
  function playNext() {
    if (isShuffling) { // caso o shuffle esteja ligado eu passo o index aleatorio
      const nextRamdomEpisodeIndex = Math.floor(Math.random() * episodeList.length) // math.floor arrendonda pra um numero inteiro
      setCurrentEpisodeIndex(nextRamdomEpisodeIndex)
    } else if (hasNext) { // Caso o numero que episodio que eu queira setar seja maior do que o numero de episodios que tem, nao permite passar
      setCurrentEpisodeIndex(currentEpisodeIndex + 1)
    }
  }

  // Toca a música anterior da lista.
  function playPrevious() {
    if (hasPrevious) { // So volta a m'u'sica se o index do episodio for maior que 0 pq se for 0 n da pra voltar
      setCurrentEpisodeIndex(currentEpisodeIndex - 1)
    }
  }

  // Essa funcao é pra ser tocada na pagina individual de cada episodio pq ai so seta ele na lista.
  function play(episode: Episode) {
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }

  // Nessa funcao eu seto a lista de episodios e o index do episodio a ser tocado.
  function playList(list: Episode[], index: number) {
    setEpisodeList(list)
    setCurrentEpisodeIndex(index)
    setIsPlaying(true)
  }

  // Essa funcao serve para pausar quando for pausado pelo click.
  function togglePlay() {
    setIsPlaying(!isPlaying)
  }

  // Essa funcao serve para setar o loop gracas ao parametro loop do html audio que recebe um boolean.
  function toggleLoop() {
    setIsLooping(!isLooping)
  }

  // Essa funcao serve para ligar o aleatório.
  function toggleShuffle() {
    setIsShuffling(!isShuffling)
  }

  // Essa funcao serve para pausar quando não for pausado pelo click.
  function setPlayingState(state: boolean) { 
    setIsPlaying(state)
  }

  //Função a ser chamada quando acabar a lista de audios.
  function clearPlayerState() {
    setEpisodeList([])
    setCurrentEpisodeIndex(0)
  }

  return ( // O metodo "Component" é como se fosse um componente generico representando todos os outrtos componentes do projeto.
    <PlayerContext.Provider
      value={{
        episodeList,
        currentEpisodeIndex,
        hasNext,
        hasPrevious,
        isPlaying,
        isLooping,
        isShuffling,
        play,
        playList,
        playNext,
        playPrevious,
        setPlayingState,
        togglePlay,
        toggleLoop,
        toggleShuffle,
        clearPlayerState
      }}
    > {/* Passamos o contexto ao redor de todos os componentes que vao precisar dele */}
      { children }  {/* Seto aqui e o children serve como um componente generico, qqr um que estiver dentro dele recebera os dados do state */}
    </PlayerContext.Provider>
  )
}

// Essa exportacao aqui é so pra facilitar o import nos componentes que precisaremos recuperar o contexto, ao envez de importar o useContext e depois o Player context, so precisamos importar essa funcao que estamos criando que ja esta impotando as duas coisas aqui.
export const usePlayer = () => {
  return useContext(PlayerContext)
}
