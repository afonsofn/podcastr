export function convertDurationToTimeString(duration: number) {
  const hours = Math.floor(duration / 3600) // O math.floor arredonda os valores pra baixo
  const minutes = Math.floor((duration % 3600) / 60)
  const seconds = duration % 60

  const timeString = [hours, minutes, seconds]
    .map(unit => String(unit).padStart(2, '0')) //O padStart() preenche a string com um determinado caractere, até que a string atinja o comprimento fornecido. É aplicado antes do primeiro caractere da string.
    .join(':')
    
  return timeString;
}