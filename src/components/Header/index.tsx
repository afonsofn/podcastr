import format from 'date-fns/format' // Biblioteca para formatação de data 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

import styles from './styles.module.scss'

export default function Header() {
  // const currentDate = new Date().toLocaleDateString() // Método nativo do JS para converter para o formato da data local
  const currentDate = format(new Date(), 'EEEEEE, d MMMM', { // Método para conversão de data com a lib 'date-fns'
    locale: ptBR,
  });

  return (
    <header className={ styles.headerContainer }>
      <img src="/logo.svg" alt="PodcastLogo"/>

      <p>O melhor para você ouvir, sempre</p>

      <span>{ currentDate }</span>
    </header>
  )
}