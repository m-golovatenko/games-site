import { FC, useEffect, useRef, useState } from 'react'

interface Segment {
  x: number
  y: number
}

const DIRECTIONS = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right'
} as const

type Direction = (typeof DIRECTIONS)[keyof typeof DIRECTIONS]

const KEY_TO_DIRECTION: Record<string, Direction> = {
  ArrowUp: DIRECTIONS.UP,
  ArrowDown: DIRECTIONS.DOWN,
  ArrowLeft: DIRECTIONS.LEFT,
  ArrowRight: DIRECTIONS.RIGHT
}

export const Snake: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isGameRunning, setIsGameRunning] = useState(false)
  const [score, setScore] = useState(0)

  const scoreRef = useRef<number>(0)
  const snakeRef = useRef<Segment[]>([])
  const gridSize = 20
  const intervalRef = useRef<number | null>(null)
  const directionRef = useRef<Direction>(DIRECTIONS.UP)
  const foodRef = useRef<{ x: number; y: number } | null>(null)
  const gameSpeedRef = useRef(150)

  const startGame = () => {
    snakeRef.current = [{ x: 200, y: 200 }]
    foodRef.current = getRandomFoodPosition()

    gameSpeedRef.current = 150

    console.log('gameSpeedRef', gameSpeedRef)
    directionRef.current = DIRECTIONS.RIGHT

    scoreRef.current = 0
    setScore(0)

    setIsGameRunning(true)

    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = window.setInterval(gameLoop, 150)
  }

  const getRandomFoodPosition = () => {
    return {
      x:
        Math.floor(Math.random() * (canvasRef.current!.width / gridSize)) *
        gridSize,
      y:
        Math.floor(Math.random() * (canvasRef.current!.height / gridSize)) *
        gridSize
    }
  }

  const gameOver = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsGameRunning(false)
    alert(`Game Over! Your score is ${scoreRef.current}!`)
  }

  const gameLoop = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = 'red'
    if (foodRef.current) {
      ctx.fillRect(foodRef.current.x, foodRef.current.y, gridSize, gridSize)
    }

    ctx.fillStyle = 'green'

    snakeRef.current.forEach((segment) => {
      ctx.fillRect(segment.x, segment.y, gridSize, gridSize)
    })

    let head = { ...snakeRef.current[0] }

    if (directionRef.current === DIRECTIONS.UP) head.y -= gridSize
    if (directionRef.current === DIRECTIONS.DOWN) head.y += gridSize
    if (directionRef.current === DIRECTIONS.RIGHT) head.x += gridSize
    if (directionRef.current === DIRECTIONS.LEFT) head.x -= gridSize

    if (
      head.x < 0 ||
      head.x >= canvas.width ||
      head.y < 0 ||
      head.y >= canvas.height
    ) {
      gameOver()
      return
    }

    for (let i = 1; i < snakeRef.current.length; i++) {
      if (
        head.x === snakeRef.current[i].x &&
        head.y === snakeRef.current[i].y
      ) {
        gameOver()
        return
      }
    }

    snakeRef.current.unshift(head)

    if (head.x === foodRef.current?.x && head.y === foodRef.current.y) {
      foodRef.current = getRandomFoodPosition()
      scoreRef.current += 1
      setScore(scoreRef.current)

      if (gameSpeedRef.current > 50) gameSpeedRef.current -= 5
      console.log('gameSpeedRef 2', gameSpeedRef)
    } else {
      snakeRef.current.pop()
    }
  }

  const changeDirection = (e: KeyboardEvent) => {
    const newDirection = KEY_TO_DIRECTION[e.key]
    if (!newDirection) return

    if (
      (newDirection === DIRECTIONS.UP &&
        directionRef.current !== DIRECTIONS.DOWN) ||
      (newDirection === DIRECTIONS.DOWN &&
        directionRef.current !== DIRECTIONS.UP) ||
      (newDirection === DIRECTIONS.LEFT &&
        directionRef.current !== DIRECTIONS.RIGHT) ||
      (newDirection === DIRECTIONS.RIGHT &&
        directionRef.current !== DIRECTIONS.LEFT)
    ) {
      directionRef.current = newDirection
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', changeDirection)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <div className={'flex flex-col gap-3 h-[calc(100vh-128px)] items-center'}>
      <h1>Snake</h1>

      <p>Score: {score}</p>

      <canvas
        width={400}
        height={400}
        className={'w-[400px] h-[400px]'}
        ref={canvasRef}
        style={{ border: '1px solid black' }}
      />

      {!isGameRunning ? (
        <button onClick={startGame}>Начать игру</button>
      ) : (
        <div className={'w-full h-10'}></div>
      )}
    </div>
  )
}