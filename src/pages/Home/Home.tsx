import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Home.module.css'
import { GAMES } from '@/constants/games'

interface Props {}

export const Home: FC<Props> = () => {
  const navigate = useNavigate()
  return (
    <div className={styles.grid}>
      {GAMES.map((game) => (
        <div key={game.id} className={styles.gameItem}>
          <div className={'w-full h-[300px] shrink-0'}></div>
          <div className={'flex flex-col gap-2 px-3 h-full justify-between'}>
            <div className={'flex flex-col gap-2'}>
              <h2>{game.title}</h2>
              <p>{game.description}</p>
            </div>

            <button onClick={() => navigate(game.path)}>Play</button>
          </div>
        </div>
      ))}
    </div>
  )
}