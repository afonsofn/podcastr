// import { useRouter } from 'next/router' // const router = useRouter() <h1>{ router.query.slug }</h1> // Seta o useRouter numa constante conseguimos renderizar o que for passado na url
import { GetStaticPaths, GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link' 

import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

import { convertDurationToTimeString } from '../../utils/converteDurationToTimeString'
import { api } from '../../services/api'

import styles from './episode.module.scss'


type episodeProps = {
  episode: {
    id: string,
    title: string,
    members: string,
    published_at: string,
    thumbnail: string,
    description: string,
    url: string,
    duration: Number,
    durationAsString: string,
  }
}

export default function Episode ({ episode }: episodeProps) {
  
  return (
    <div className={styles.episode}>

      <div className={styles.thumbnailContainer}>

        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="Voltar"/>
          </button>
        </Link>

        <Image width={700} height={160} objectFit="cover" src={episode.thumbnail} />

        <button type="button">
          <img src="/play.svg" alt="Tocar Episódio"/>
        </button>
      </div>
    
      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.published_at}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <div className={styles.description} dangerouslySetInnerHTML={{ __html: episode.description}} />
    
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params
  const { data } = await api.get(`/episodes/${slug}`)

  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    published_at: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    description: data.description,
    url: data.file.url
  }
  
  return {
    props: {
      episode,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  }
}