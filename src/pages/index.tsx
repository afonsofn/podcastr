import { GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'

import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

import { convertDurationToTimeString } from '../utils/converteDurationToTimeString'
import { usePlayer } from '../contexts/playerContext'
import { api } from '../services/api'

import styles from '../styles/home.module.scss'

type homeProps = {
  episodes: Array<{
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
  const { playList } = usePlayer()

  const latestEpisodesLength = 2;

  return (
    <div className={styles.homePage}>
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
                <Link href={`/episode/${episode.id}`}>   
                  <a>{episode.title}</a>
                </Link>
                <p>{episode.members}</p>
                <span>{episode.published_at}</span>
                <span>{episode.durationAsString}</span>
              </div>
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

export const getStaticProps: GetStaticProps = async () => {
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
    props: {
      episodes,
    },
    revalidate: 60 * 60 * 8,
  }
}
