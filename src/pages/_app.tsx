import '../styles/global.scss'
import styles from '../styles/app.module.scss'

import Header from '../components/Header'
import Player from '../components/Player'
import { PlayerContextProvider } from '../contexts/playerContext' // Importando o Context

// Next.js usa o _app para inicializar as páginas, nesse componente ficam os elementos que apareceram na tela, é como se fosse a tela final pro usuário.
// Aqui nós disponibilizamos as infos globais que queremos que os outros componentes tenham acesso, como estilos globais, estados, etc...
function MyApp({ Component, pageProps }) {
  return(
    // Passamos o context ao redor dos componentes que queremos que tenha acesso as info do nosso state global.
    <PlayerContextProvider> 
      <div className={ styles.wrapper }>
        <main>
          <Header />
          {/* O 'pageProps' um objeto com as propriedades que foram pré-carregadas ou pelo 'getStaticProps' ou 'getStaticPaths' ou então o 'getServerSideProps', caso contrário, é um objeto vazio. */}
          {/* O 'Component' é a página ativa no momento, então quando estiver navegando entre as rotas, o 'Component' vai mudar para a nova página. */}
          <Component {...pageProps} /> 
        </main>
        <Player />
      </div>
    </PlayerContextProvider>
  )
}

export default MyApp
