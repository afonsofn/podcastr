// import { useRouter } from 'next/router'
// const router = useRouter()
// <h1>{ router.query.slug }</h1>
// Seta o useRouter numa constante conseguimos renderizar o que for passado na url

// JA COMENTEI APP, DOCUMENT, INDEX

import { useEffect } from 'react'

import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import {  usePlayer } from '../../contexts/playerContext'

import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

import { convertDurationToTimeString } from '../../utils/converteDurationToTimeString'
import { api } from '../../services/api'

import styles from './episode.module.scss'


type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  members: string;
  duration: number;
  durationAsString: string;
  url: string;
  publishedAt: string;
}

type EpisodeProps = {
  episode: Episode;
}

export default function Episode ({ episode }: EpisodeProps) {
  const { play } = usePlayer()
  
  const router = useRouter()
// Lógica do load no next
  if (router.isFallback) {
    return <p>Carregando...</p>
  }
  
  return (
    <div className={styles.episode}>
      {/* Com essa tag Head exportada do 'next/head', nos conseguimos setar o título das pages na aba do navegador */}
      <Head>
        <title>{episode.title} | Podcastr</title>
      </Head>

      <div className={styles.thumbnailContainer}>

        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="Voltar"/>
          </button>
        </Link>

        <Image width={700} height={160} objectFit="cover" src={episode.thumbnail} />
        
        <button type="button" onClick={() => play(episode)}>
          <img src="/play.svg" alt="Tocar Episódio"/>
        </button>
      </div>
    
      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <div className={styles.description} dangerouslySetInnerHTML={{ __html: episode.description}} />
    
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => { // Com esse método eu consigo setar as paginas fora a "/" que vao ser geradas estaticamente tbm
  const { data } = await api.get('episodes', { // Fazemos uma
    params: {
      _limit: 2,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const paths = data.map(episode => {
    return {
      params: {
        slug: episode.id // Dessa forma estamos gerando estaticamente as duas primeiras paginas da app, e o resto se for acessada o next busca no seu servidor node.
      }
    }
  })

  return {
    paths, // Passamos o slug dentro de params com as paginas que queremos que sejam geradas estaticamente de inicio, e com o Fallback determinamos que as que nao estao ai sejam buscadas no servidor node do next.
    fallback: 'blocking' // O fallback ddetermina o comportamento da pagina ao acessar de forma estatica
  }                      // "false" ao acessar a pagina veremos um 404 // "true" faz a requisicao pelo lado do client // "blocking" (mais recomendado) ele vai buscar no servidor node do next
}

export const getStaticProps: GetStaticProps = async (ctx) => { // Eu so consigo acessar os params atraves do contexto "ctx"
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