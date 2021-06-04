import { useEffect, useRef, useState } from 'react'

import Image from 'next/image'

import Slider from 'rc-slider' // Package da net
import 'rc-slider/assets/index.css' // Package da net

import { convertDurationToTimeString } from '../../utils/converteDurationToTimeString'
import { usePlayer } from '../../contexts/playerContext'

import styles from './styles.module.scss'


export default function Player() {
  // Usamos a função useRef para criar referencias para acessar elementos HTML, como fariamos se recuperassemos pelo document.getElementById...
  const audioRef = useRef<HTMLAudioElement>(null) // Tipando essa função, quando eu a for usar o typeScript vai me ajudar passando todas os metodos disponivel que eu posso usar com aquele elemento HTML

  // ------> <State> <------ \\

  const [progress, setProgress] = useState(0) // Estado da barra de progresso do player.

  // ------> <Functions> <------ \\

  function setupProgressListener() {
    audioRef.current.currentTime = 0 // nesse caminho eu recupero onde em quanto tempo ta o audio

    audioRef.current.addEventListener('timeupdate', event => { // toda vez que o tempo for atualizado(timeupdate) ele seta o progresso
      setProgress(Math.floor(audioRef.current.currentTime)) // arrendonda o numero pra baixo
    })
  }

  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount
    setProgress(amount)
  }

  function handleEpisodeEnded() { // Determina se vai pro proximo episodio, ou pro inicio da lista.
    if (hasNext) {
      playNext()
    } else {
      clearPlayerState()
    }
  }

  // Recuperando funções do Context.
  const {
    episodeList, // Com essa funcao eu recupero o o episodio que eu cliquei lá na nossa main.
    currentEpisodeIndex,
    hasNext,
    hasPrevious,
    isPlaying,
    isLooping,
    isShuffling,
    playNext,
    playPrevious,
    setPlayingState,
    togglePlay,
    toggleLoop,
    toggleShuffle,
    clearPlayerState
  } = usePlayer()

  useEffect(() => { // Watcher
    if (!audioRef.current) { // Dentro de cada ref so tem um valor o "current", que é como se fosse o value dele
      return;
    }

    if (isPlaying) { // Caso esteja em play da pause, caso contrario, o contrario
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying]) // Eu estou dizendo aqui eu eu quero que essa funcao seja disparada toda vez que o isPlaying sofrer alguma alteracao, é como o watch do vue.

  const episode = episodeList[currentEpisodeIndex] // Da lista de episodios eu pego o episodio com tal id

  return (
    <div className={ styles.playerContainer }>  
      <header>
        <img src="/playing.svg" alt="Tocando agora"/>
        <strong>
          Tocando agora
        </strong>
      </header>

      { episode ? ( // caso tenha episodio ... 
        <div className={styles.currentEpisode}> {/* Renderiza isso */}
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            objectFit="cover"
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : ( // Caso nao ...
        <div className={styles.emptyPlayer}> {/* Renderiza isso */}
          <strong>
            Selecione um podcast para ouvir
          </strong>
        </div>
      ) }

      <footer className={!episode ? styles.empty : ''}>  {/* Caso nao tenha episodio poe esse style */}
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            { episode ? ( // caso tenha episodio ... 
              <Slider  // renderiza o package que a gnt baixou
                max={episode.duration}
                value={progress}
                onChange={handleSeek}
                trackStyle={{ backgroundColor: '#04d361' }}
                railStyle={{ backgroundColor: '#9f75ff' }}
                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
              />
            ) : (  // Caso nao
              <div className={styles.emptySlider} /> // renderiza isso
            ) }
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span> {/* se eu n tiver episodio eu seto o 0 */}
        </div>

        { episode && ( // Forma simplificada de fazer o ternário
          <audio
            src={episode.url}
            ref={audioRef}
            autoPlay // Assim que carregar o episódio o audio já toca
            loop={isLooping} // Recebe um boolean, pra ficar em loop ou nao
            onPlay={() => setPlayingState(true)} 
            onPause={() => setPlayingState(false)}
            onEnded={handleEpisodeEnded}
            onLoadedMetadata={setupProgressListener}
          />
        ) }

        <div className={styles.buttons}>
          <button type="button" disabled={!episode || episodeList.length === 1} onClick={toggleShuffle} className={isShuffling ? styles.isActive : ""}> {/* Botoes desabilitados caso nao tenha episodio */}
            <img src="/shuffle.svg" alt="Embaralhar"/>
          </button>
          <button type="button" disabled={!episode || !hasPrevious} onClick={playPrevious}>
            <img src="/play-previous.svg" alt="Tocar anterior"/>
          </button>
          <button type="button" className={styles.playButton} disabled={!episode} onClick={togglePlay}>
            { isPlaying
              ? <img src="/pause.svg" alt="Tocar"/>
              : <img src="/play.svg" alt="Tocar"/>
            }
          </button>
          <button type="button" disabled={!episode || !hasNext} onClick={playNext}>
            <img src="/play-next.svg" alt="Tocar proxima"/>
          </button>
          <button type="button" disabled={!episode} onClick={toggleLoop} className={isLooping ? styles.isActive : ""}>
            <img src="/repeat.svg" alt="Repetir"/>
          </button>
        </div>
      </footer>
    </div>
  )
}