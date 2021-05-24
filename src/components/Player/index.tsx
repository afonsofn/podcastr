import { useContext } from 'react'
import Image from 'next/image'

import Slider from 'rc-slider' // Package da net

import { PlayerContext } from '../../contexts/playerContext'

import styles from './styles.module.scss'
import 'rc-slider/assets/index.css' // Package da net

// Aula 4 54:45

export default function Player() {
  const { episodeList, currentEpisodeIndex } = useContext(PlayerContext) // Com essa funcao eu recupero o data do context

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

        <div className={styles.buttons}>
          <button type="button" disabled={!episode}> {/* Botoes desabilitados caso nao tenha episodio */}
            <img src="/shuffle.svg" alt="Embaralhar"/>
          </button>
          <button type="button" disabled={!episode}>
            <img src="/play-previous.svg" alt="Tocar anterior"/>
          </button>
          <button type="button" className={styles.playButton} disabled={!episode}>
            <img src="/play.svg" alt="Tocar"/>
          </button>
          <button type="button" disabled={!episode}>
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