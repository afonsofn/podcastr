import '../styles/global.scss'
import styles from '../styles/app.module.scss'

import Header from '../components/Header'
import Player from '../components/Player'
import { PlayerContext } from '../contexts/playerContext'
import { useState } from 'react'


function MyApp({ Component, pageProps }) { // Nesse componente ficam os componentes que sempre apareceram na tela
  const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodeIndex, setcurrentEpisodeIndex] = useState(0)
  
  function play(episode) {
    setEpisodeList([episode])
    setcurrentEpisodeIndex(0)
  }

  return ( // O metodo "Component" é como se fosse um componente generico representando todos os outrtos componentes do projeto.
    <PlayerContext.Provider value={{ episodeList, currentEpisodeIndex, play }}> {/* Passamos o contexto ao redor de todos os componentes que vao precisar dele */} {/* E setamos o valor inicial */}
      <div className={ styles.wrapper }>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContext.Provider>
  )
}

export default MyApp
