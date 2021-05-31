import '../styles/global.scss'
import styles from '../styles/app.module.scss'

import Header from '../components/Header'
import Player from '../components/Player'
import { PlayerContextProvider } from '../contexts/playerContext'

function MyApp({ Component, pageProps }) { // Nesse componente ficam os componentes que sempre apareceram na tela
  return(
    <PlayerContextProvider>
      <div className={ styles.wrapper }>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContextProvider>
  )
}

export default MyApp
