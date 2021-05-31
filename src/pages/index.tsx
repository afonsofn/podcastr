// ESTA É A PÁGINA HOME, NO ROTEAMENTO ELA SEMPRE VAI SER A "/", para seguir para a proxima rota é só colocar o nome da pasta/component que esta dentro da pasta pages..

import { GetStaticProps } from 'next' // Essa é uma função de tipagem da função de "SSG" => "episode 3 - 7:30"
import { useContext } from 'react'
import Image from 'next/image' // Esse componente do next permite que se trate a imagem de uma forma mais sucinta
import Link from 'next/link' // Esse componente do next permite viajar entre as rotas sem ficar recarregando toda o app, diferente do "a"


import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

import { convertDurationToTimeString } from '../utils/converteDurationToTimeString'
import { PlayerContext } from '../contexts/playerContext'
import { api } from '../services/api'

import styles from '../styles/home.module.scss'
import { tr } from 'date-fns/locale'


type homeProps = {
  episodes: Array<{ // Aqui estou dizendo que será um array de objeto.
    id: string,
    title: string,
    members: string,
    published_at: string,
    thumbnail: string,
    url: string,
    duration: number,
    durationAsString: string,
  }>
}

export default function Home({ episodes }: homeProps) {
  const { play } = useContext(PlayerContext)

  return (
    <div className={styles.homePage}>  
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          { episodes.slice(0, 2).map(episode => {
            return (
              <li key={episode.id}>
              <Image 
                width={192}
                height={192}
                src={episode.thumbnail} 
                alt={episode.title}
                objectFit="cover"
              />

              <div className={styles.episodeDetails}>
                {/* Com esse link nos nao precisamos recarregar a página toda ao navegar pela aplicação */}
                <Link href={`/episode/${episode.id}`}>   
                  <a>{episode.title}</a>
                </Link>
                <p>{episode.members}</p>
                <span>{episode.published_at}</span>
                <span>{episode.durationAsString}</span>
              </div>

              <button type="button" onClick={() => play(episode)}> {/* Quando passar uma funcao no onClick que precisa de parametro tem que passar como arrow function */}
                <img src="/play-green.svg" alt="Tocar episódio"/>
              </button>
            </li>
            )
          }) }
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>

        <table cellSpacing={0}>
            <thead>
              <tr>
                <th></th>
                <th>Podcast</th>
                <th>Integrantes</th>
                <th>Data</th>
                <th>Duração</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {episodes.slice(2, episodes.length).map((episode) => (
                <tr key={episode.id}>
                  <td style={{ width: 72 }}>
                    <Image 
                      width={120}
                      height={120}
                      src={episode.thumbnail} 
                      alt={episode.title}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <Link href={`/episode/${episode.id}`}>   
                      <a>{episode.title}</a>
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{ width: 100 }}>{episode.published_at}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button type="button">
                      <img src="/play-green.svg" alt="Tocar episódio" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
        </table>
        
      </section>
    </div>
  )
}


// ==> ESSA É A FORMA STATIC SITE GENERATION (SSG) DE FAZER REQUISIÇÕES // ==> ESSA FUNÇÃO SÓ PODE SER CHAMADA DENTRO DE ALGUM ARQUIVO NA PASTA PAGES.
export const getStaticProps: GetStaticProps = async () => { // ==> NESSE CASO O NEXT FAZ UMA COPIA DO HTML COM A PRIMEIRA PESSOA QUE ACESSOU A PÁGINA, E FICA MOSTRANDO ESSA VERSÃO PARA AS PROXIMAS PESSOAS QUE ACESSAREM.
  const { data } = await api.get('episodes')

  console.log(data)

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      published_at: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      url: episode.file.url
    }
  })

  return {
    props: {  // SEMPRE RETORNAMOS COMO PROPS
      episodes,
    },
    revalidate: 60 * 60 * 8, // Recebe um número em segundos de quanto em quanto tempo quero que seja gerada uma nova versão da página, ou seja, a cada 8 horas quando uma pessoa accessar a página, uma requisição vai ser feita, ou seja, só vão ser feitas 3 requisições por dia. 
  }
}

// ==> ESSA É A FORMA SERVER SIDE RENDERING (SSR) DE FAZER REQUISIÇÕES // ==> ESSA FUNÇÃO SÓ PODE SER CHAMADA DENTRO DE ALGUM ARQUIVO NA PASTA PAGES.
// export async function getServerSideProps() { // ==> QUANDO EXPORTAMOS ESSA FUNÇÃO, O NEXT ENTENDE QUE TEM QUE EXECUTAR ESSA FUNÇÃO ANTES DE EXIBIR O CONTEÚDO DA PÁGINA.
//   const response = await fetch('http://localhost:3333/episodes')
//   const data = await response.json()

//   return { // SEMPRE RETORNAMOS COMO PROPS
//     props: {
//       episodes: data,
//     },
//   }
// }

// ==> ESSA É A FORMA SINGLE PAGE APPLICATION (SPA) DE FAZER REQUISIÇÕES.
// useEffect(() => {
//   axios('http://localhost:3333/episodes') 
//   .then((response) => {
//     console.log(response);
//   })
// }, [])