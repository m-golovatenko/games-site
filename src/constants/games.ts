export interface Game {
  id: string
  title: string
  description: string
  image: string
  path: string
}

export const GAMES: Game[] = [
  {
    id: 'snake',
    title: 'Snake',
    description: 'Классическая змейка. Собирайте еду и растите!',
    image: '',
    path: '/snake'
  },
  {
    id: 'tictac',
    title: 'Tic Tac Toe',
    description: 'Крестики нолики',
    image: '',
    path: '/tictac'
  }
]