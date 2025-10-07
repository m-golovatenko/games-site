import { createHashRouter } from 'react-router-dom'
import { Home, Snake, TicTac } from '@/pages'

export const router = createHashRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/snake',
    element: <Snake />
  },
  {
    path: '/tictac',
    element: <TicTac />
  }
])