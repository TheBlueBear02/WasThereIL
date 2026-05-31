import { HomeScreen } from './components/game/HomeScreen'
import { GameScreen } from './components/game/GameScreen'
import { ResultsScreen } from './components/game/ResultsScreen'
import { DesktopSideBackground } from './components/layout/DesktopSideBackground'
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
    <div className="relative min-h-svh md:bg-stone-50/80">
      <DesktopSideBackground />
      <main className="relative z-10 mx-auto flex h-svh max-w-[430px] flex-col overflow-hidden bg-white px-4 pt-6 text-start text-stone-900">
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
    </div>
  )
}

export default App
