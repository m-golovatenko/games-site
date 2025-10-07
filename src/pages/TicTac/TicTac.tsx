import { FC, useEffect, useState } from 'react'

interface Props {}

type Player = 'X' | 'O' | null

interface WinnerInfo {
  player: Player
  line: number[]
}

export const TicTac: FC<Props> = () => {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X')
  const [winner, setWinner] = useState<WinnerInfo | 'Draw' | null>(null)

  const handleClick = (index: number) => {
    if (board[index] || checkWinner(board)) return

    const newBoard = [...board]
    newBoard[index] = 'X'
    setBoard(newBoard)
    setCurrentPlayer('O')
  }

  const resetGame = () => {
    setCurrentPlayer('X')
    setBoard(Array(9).fill(null))
    setWinner(null)
  }

  const checkWinner = (board: Player[]): WinnerInfo | 'Draw' | null => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ]

    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { player: board[a], line: [a, b, c] }
      }
    }

    if (board.every((cell) => cell !== null)) return 'Draw'

    return null
  }

  useEffect(() => {
    if (currentPlayer === 'O' && !winner) {
      const timeout = setTimeout(() => {
        const emptyIndices = board
          .map((cell, idx) => (cell === null ? idx : null))
          .filter((idx) => idx !== null) as number[]

        if (emptyIndices.length === 0) return

        const randomIndex =
          emptyIndices[Math.floor(Math.random() * emptyIndices.length)]
        const newBoard = [...board]
        newBoard[randomIndex] = 'O'
        setBoard(newBoard)
        setCurrentPlayer('X')
      }, 500)

      return () => clearTimeout(timeout)
    }
  }, [board, currentPlayer, winner])

  useEffect(() => {
    const result = checkWinner(board)
    if (result) setWinner(result)
  }, [board])

  return (
    <div className={'flex flex-col gap-3 h-[calc(100vh-128px)] items-center'}>
      <h1>Tic tac toe</h1>
      <h2>
        {' '}
        {winner
          ? winner === 'Draw'
            ? 'Draw!'
            : `Winner: ${winner.player}`
          : `Next player: ${currentPlayer}`}
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 100px)',
          gap: '5px',
          justifyContent: 'center',
          position: 'relative',
          pointerEvents: currentPlayer === 'O' ? 'none' : 'auto'
        }}
      >
        {board.map((cell, index) => {
          const isWinningCell =
            winner && winner !== 'Draw' ? winner.line.includes(index) : false

          return (
            <button
              key={index}
              onClick={() => handleClick(index)}
              style={{
                width: '100px',
                height: '100px',
                fontSize: '2rem',
                cursor: cell || winner ? 'default' : 'pointer',
                color: isWinningCell ? 'red' : 'white'
              }}
            >
              {cell}
            </button>
          )
        })}
        {winner && winner !== 'Draw' && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none'
            }}
          >
            <WinnerLine line={winner.line} />
          </div>
        )}
      </div>
      <button onClick={resetGame}>Начать заново</button>
    </div>
  )
}

interface WinnerLineProps {
  line: number[]
}

const WinnerLine: FC<WinnerLineProps> = ({ line }) => {
  const [a, b, c] = line

  const getLineStyle = () => {
    const thickness = 5

    if (a === 0 && b === 1 && c === 2)
      return { top: 'calc(33% / 2)', left: 0, width: '100%', height: thickness }
    if (a === 3 && b === 4 && c === 5)
      return {
        top: '50%',
        left: 0,
        width: '100%',
        height: thickness,
        transform: 'translateY(-50%)'
      }
    if (a === 6 && b === 7 && c === 8)
      return {
        bottom: 'calc(33% / 2)',
        left: 0,
        width: '100%',
        height: thickness
      }
    if (a === 0 && b === 3 && c === 6)
      return { top: 0, left: 'calc(33% / 2)', width: thickness, height: '100%' }
    if (a === 1 && b === 4 && c === 7)
      return {
        top: 0,
        left: '50%',
        width: thickness,
        height: '100%',
        transform: 'translateX(-50%)'
      }
    if (a === 2 && b === 5 && c === 8)
      return {
        top: 0,
        right: 'calc(33% / 2)',
        width: thickness,
        height: '100%'
      }

    if (a === 0 && b === 4 && c === 8)
      return {
        top: 0,
        left: 0,
        width: '141.4%',
        height: thickness,
        transform: 'rotate(45deg)',
        transformOrigin: 'top left'
      }

    if (a === 2 && b === 4 && c === 6)
      return {
        top: 0,
        right: 0,
        width: '141.4%',
        height: thickness,
        transform: 'rotate(-45deg)',
        transformOrigin: 'top right'
      }

    return {}
  }

  return (
    <div
      style={{
        backgroundColor: 'red',
        position: 'absolute',
        ...getLineStyle()
      }}
    />
  )
}