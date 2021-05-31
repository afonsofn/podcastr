import { useContext, useEffect, useRef } from 'react'
import Image from 'next/image'

import Slider from 'rc-slider' // Package da net

import { PlayerContext } from '../../contexts/playerContext'

import styles from './styles.module.scss'
import 'rc-slider/assets/index.css' // Package da net


export default function Player() {
  // Usamos a função useRef para criar referencias para acessar elementos HTML, como fariamos se recuperassemos pelo document.getElementById....
  const audioRef = useRef<HTMLAudioElement>(null) // Tipando essa função, quando eu a for usar o typeScript vai me ajudar passando todas os metodos disponivel que eu posso usar com aquele elemento HTML

  const {
    episodeList,// Com essa funcao eu recupero o o episodio que eu cliquei lá na nossa main.
    currentEpisodeIndex,
    isPlaying,
    togglePlay,
    setPlayingState,
    playNext,
    playPrevious
  } = useContext(PlayerContext)

  useEffect(() => {
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
          <span>00:00</span>
          <div className={styles.slider}>
            { episode ? ( // caso tenha episodio ... 
              <Slider  // renderiza o package que a gnt baixou
                trackStyle={{ backgroundColor: '#04d361' }}
                railStyle={{ backgroundColor: '#9f75ff' }}
                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
              />
            ) : (  // Caso nao
              <div className={styles.emptySlider} /> // renderiza isso
            ) }
          </div>
          <span>00:00</span>
        </div>

        { episode && ( // Forma simplificada de fazer o ternário
          <audio
            src={episode.url}
            ref={audioRef}
            autoPlay // Assim que carregar o episódio o audio já toca
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
          />
        ) }

        <div className={styles.buttons}>
          <button type="button" disabled={!episode}> {/* Botoes desabilitados caso nao tenha episodio */}
            <img src="/shuffle.svg" alt="Embaralhar"/>
          </button>
          <button type="button" disabled={!episode} onClick={playPrevious}>
            <img src="/play-previous.svg" alt="Tocar anterior"/>
          </button>
          <button type="button" className={styles.playButton} disabled={!episode} onClick={togglePlay}>
            { isPlaying
              ? <img src="/pause.svg" alt="Tocar"/>
              : <img src="/play.svg" alt="Tocar"/>
            }
          </button>
          <button type="button" disabled={!episode} onClick={playNext}>
            <img src="/play-next.svg" alt="Tocar proxima"/>
          </button>
          <button type="button" disabled={!episode}>
            <img src="/repeat.svg" alt="Repetir"/>
          </button>
        </div>
      </footer>
    </div>
  )
}