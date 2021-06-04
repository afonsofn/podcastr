// O LINK DE DOWNLOAD DO GOOGLE CHROME SERVE PARA URL DE AUDIOS PARA USAR NESSE PROJETO.

// O 'index' dentro da pasta pages é como se fosse a 'home' do projeto, no roteamento ela vai ser a "/", para fazer um roteamento dinamico no Next.js criamos as pastas das páginas dentro da pasta pages, e dentro das pastas criamos um um arquivo js com colchetes ao redor do nome, então o Next entende que aquilo ali é uma rota dinâmica
import { GetStaticProps } from 'next' // Essa é uma função de tipagem da função de "SSG" => "episode 3 - 7:30"
import Image from 'next/image' // Esse componente do next permite que se trate a imagem de uma forma mais sucinta
import Link from 'next/link' // Esse componente do next permite viajar entre as rotas sem precisar reccaregar todo o app, diferente do "a"
import Head from 'next/head'

import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

import { convertDurationToTimeString } from '../utils/converteDurationToTimeString'
import { usePlayer } from '../contexts/playerContext'
import { api } from '../services/api'

import styles from '../styles/home.module.scss'

// Tipagem das props do componente
type homeProps = {
  episodes: Array<{ // Aqui estou dizendo que será um array de objeto
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
  // Recuperamos a função play List do context sendo exportado do playerContext
  const { playList } = usePlayer()

  const latestEpisodesLength = 2;

  return (
    <div className={styles.homePage}>
      {/* Com essa tag Head exportada do 'next/head', nos conseguimos setar o título das pages na aba do navegador */}
      <Head>
        <title>Home | Podcastr</title>
      </Head>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          { episodes.slice(0, latestEpisodesLength).map((episode, index) => {
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
                {/* Com esse link não é necessário recarregar a página toda ao navegar pela aplicação */}
                <Link href={`/episode/${episode.id}`}>   
                  <a>{episode.title}</a>
                </Link>
                <p>{episode.members}</p>
                <span>{episode.published_at}</span>
                <span>{episode.durationAsString}</span>
              </div>
              {/* Nesse onClick passamos a lista completa de episódios e o index do episódio que queremos tocar */}
              <button type="button" onClick={() => playList(episodes, index)}> {/* Quando passar uma funcao no onClick que precisa de parâmetro tem que passar como arrow function */}
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
              {episodes.slice(latestEpisodesLength, episodes.length).map((episode, index) => (
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
                    <button type="button" onClick={() => playList(episodes, index + latestEpisodesLength)}>
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

// ==> ESSA É A FORMA STATIC SITE GENERATION (SSG) DE FAZER REQUISIÇÕES
// ==> NESSE CASO O NEXT FAZ UMA CÓPIA DO HTML PELA PRIMEIRA PESSOA QUE ACESSOU A PÁGINA, E FICA MOSTRANDO ESSA VERSÃO PARA AS PROXIMAS PESSOAS QUE ACESSAREM.
// ==> ESSA FUNÇÃO SÓ PODE SER CHAMADA DENTRO DE ALGUM ARQUIVO NA PASTA PAGES.
export const getStaticProps: GetStaticProps = async () => { // 'GetStaticProps' é uma função de tipagem da função de "SSG"
  const { data } = await api.get('episodes')

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
    // RETORNAMOS A RESPOSTA COMO PROPS
    props: {
      episodes,
    },
    // 'revalidate' recebe um número em segundos de quanto em quanto tempo deve ser gerada uma nova versão da página, ou seja, a cada 8 horas quando uma pessoa accessar a página, uma requisição vai ser feita, ou seja, só vão ser feitas 3 requisições por dia. 
    revalidate: 60 * 60 * 8,
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