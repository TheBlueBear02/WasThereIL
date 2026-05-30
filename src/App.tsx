import { HomeScreen } from './components/game/HomeScreen'
import { GameScreen } from './components/game/GameScreen'
import { ResultsScreen } from './components/game/ResultsScreen'
import { useGameSession } from './hooks/useGameSession'

function App() {
  const {
    screen,
    session,
    totalScore,
    startGame,
    submitGuess,
    nextRound,
    playAgain,
    goHome,
  } = useGameSession()

  return (
    <main className="mx-auto flex h-svh max-w-[430px] flex-col overflow-hidden bg-white px-4 pt-6 text-start text-stone-900">
      {screen === 'home' && <HomeScreen onPlay={startGame} />}
      {screen === 'game' && session && (
        <GameScreen
          session={session}
          onSubmitGuess={submitGuess}
          onNext={nextRound}
          onExit={goHome}
        />
      )}
      {screen === 'results' && session && (
        <ResultsScreen
          totalScore={totalScore}
          session={session}
          onPlayAgain={playAgain}
          onHome={goHome}
        />
      )}
    </main>
  )
}

export default App
