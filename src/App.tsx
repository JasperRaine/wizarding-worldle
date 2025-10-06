import { useState, useEffect } from 'react'
import styles from './App.module.css'
import { characters, type Character } from './characters'
import GuessInput from './components/GuessInput/GuessInput'
import RulesModal from './modals/RulesModal/RulesModal'
import GameWonMessage from './components/GameWonMessage/GameWonMessage'
import GameLostMessage from './components/GameLostMessage/GameLostMessage'
import GuessGrid from './components/GuessGrid/GuessGrid'
import StatisticsModal from './modals/StatisticsModal/StatisticsModal'
import SettingsModal from './modals/SettingsModal/SettingsModal'
import TrophiesModal from './modals/TrophiesModal/TrophiesModal'
import TrophyUnlockModal from './modals/TrophyUnlockModal/TrophyUnlockModal'
import Navbar from './components/Navbar/Navbar'
import { calculateTrophies, getNewlyUnlockedTrophies, type Trophy } from './utils/trophyUtils'

// Local storage keys
const GAME_STORAGE_KEY = 'wizarding-worldle-game-state'
const GAME_HISTORY_KEY = 'wizarding-worldle-game-history'
const DARK_MODE_KEY = 'wizarding-worldle-dark-mode'

// Interface for saved game state
interface GameState {
  guesses: Character[]
  attempts: number
  gameOver: boolean
  gameWon: boolean
  showGameOverMessage: boolean
  date: string // To check if it's a new day
}

// Interface for completed game record
interface GameRecord {
  date: string
  mysteryCharacter: Character
  guesses: Character[]
  attempts: number
  won: boolean
  completedAt: string // ISO timestamp
}

// Interface for game history
export interface GameHistory {
  games: GameRecord[]
  totalGames: number
  wins: number
  losses: number
  currentStreak: number
  maxStreak: number
}

function App() {
  const [guess, setGuess] = useState("")
  const [guesses, setGuesses] = useState<Character[]>([])
  const [attempts, setAttempts] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([])
  const [previewCharacter, setPreviewCharacter] = useState<Character | null>(null)
  const [animatingRow, setAnimatingRow] = useState<number | null>(null)
  const [showRulesModal, setShowRulesModal] = useState(false)
  const [showStatsModal, setShowStatsModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showTrophiesModal, setShowTrophiesModal] = useState(false)
  const [showTrophyUnlockModal, setShowTrophyUnlockModal] = useState(false)
  const [unlockedTrophies, setUnlockedTrophies] = useState<Trophy[]>([])
  const [previousTrophies, setPreviousTrophies] = useState<Trophy[]>([])

  const [showGameOverMessage, setShowGameOverMessage] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [gameHistory, setGameHistory] = useState<GameHistory>({
    games: [],
    totalGames: 0,
    wins: 0,
    losses: 0,
    currentStreak: 0,
    maxStreak: 0
  })

  // Function to save game state to local storage
  const saveGameState = (gameState: Partial<GameState>) => {
    const currentDate = new Date().toDateString()
    const stateToSave: GameState = {
      guesses,
      attempts,
      gameOver,
      gameWon,
      showGameOverMessage,
      date: currentDate,
      ...gameState
    }
    localStorage.setItem(GAME_STORAGE_KEY, JSON.stringify(stateToSave))
  }

  // Function to load game state from local storage
  const loadGameState = (): GameState | null => {
    try {
      const saved = localStorage.getItem(GAME_STORAGE_KEY)
      if (!saved) return null
      
      const gameState: GameState = JSON.parse(saved)
      const currentDate = new Date().toDateString()
      
      // If it's a new day, don't load the old game state
      if (gameState.date !== currentDate) {
        localStorage.removeItem(GAME_STORAGE_KEY)
        return null
      }
      
      return gameState
    } catch (error) {
      console.error('Error loading game state:', error)
      localStorage.removeItem(GAME_STORAGE_KEY)
      return null
    }
  }

  // Function to load game history from local storage
  const loadGameHistory = (): GameHistory => {
    try {
      const saved = localStorage.getItem(GAME_HISTORY_KEY)
      if (!saved) {
        return {
          games: [],
          totalGames: 0,
          wins: 0,
          losses: 0,
          currentStreak: 0,
          maxStreak: 0
        }
      }
      
      return JSON.parse(saved)
    } catch (error) {
      console.error('Error loading game history:', error)
      return {
        games: [],
        totalGames: 0,
        wins: 0,
        losses: 0,
        currentStreak: 0,
        maxStreak: 0
      }
    }
  }

  // Function to save game history to local storage
  const saveGameHistory = (history: GameHistory) => {
    try {
      localStorage.setItem(GAME_HISTORY_KEY, JSON.stringify(history))
    } catch (error) {
      console.error('Error saving game history:', error)
    }
  }

  // Function to add a completed game to history
  const addGameToHistory = (gameRecord: GameRecord) => {
    const history = loadGameHistory()
    
    // Check if we already have a game for this date
    const existingGameIndex = history.games.findIndex(game => game.date === gameRecord.date)
    
    if (existingGameIndex >= 0) {
      // Replace existing game for this date
      history.games[existingGameIndex] = gameRecord
    } else {
      // Add new game
      history.games.push(gameRecord)
    }
    
    // Sort games by date (newest first)
    history.games.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
    // Recalculate statistics
    history.totalGames = history.games.length
    history.wins = history.games.filter(game => game.won).length
    history.losses = history.games.filter(game => !game.won).length
    
    // Calculate current streak (consecutive wins from most recent)
    history.currentStreak = 0
    for (const game of history.games) {
      if (game.won) {
        history.currentStreak++
      } else {
        break
      }
    }
    
    // Calculate max streak
    let maxStreak = 0
    let currentStreak = 0
    for (const game of history.games) {
      if (game.won) {
        currentStreak++
        maxStreak = Math.max(maxStreak, currentStreak)
      } else {
        currentStreak = 0
      }
    }
    history.maxStreak = maxStreak
    
    saveGameHistory(history)
  }

  // Load dark mode state
  const loadDarkMode = (): boolean => {
    try {
      const saved = localStorage.getItem(DARK_MODE_KEY)
      return saved ? JSON.parse(saved) : false
    } catch (error) {
      console.error('Error loading dark mode state:', error)
      return false
    }
  }

  // Save dark mode state
  const saveDarkMode = (darkMode: boolean) => {
    try {
      localStorage.setItem(DARK_MODE_KEY, JSON.stringify(darkMode))
    } catch (error) {
      console.error('Error saving dark mode state:', error)
    }
  }

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    saveDarkMode(newDarkMode)
  }

  // Load game state and history on component mount
  useEffect(() => {
    const savedState = loadGameState()
    if (savedState) {
      setGuesses(savedState.guesses)
      setAttempts(savedState.attempts)
      setGameOver(savedState.gameOver)
      setGameWon(savedState.gameWon)
      setShowGameOverMessage(savedState.showGameOverMessage)
    }
    
    // Load game history
    const history = loadGameHistory()
    setGameHistory(history)
    
    // Capture trophy state at game start
    captureTrophyStateAtGameStart()

    // Load dark mode
    const darkMode = loadDarkMode()
    setIsDarkMode(darkMode)
  }, [])

  // Apply dark mode to root element
  useEffect(() => {
    const root = document.getElementById('root')
    if (root) {
      root.setAttribute('data-theme', isDarkMode ? 'dark' : 'light')
    }
  }, [isDarkMode])

  // Initialize previous trophies only once on mount
  useEffect(() => {
    const initialTrophies = calculateTrophies(gameHistory)
    setPreviousTrophies(initialTrophies)
  }, []) // Only run once on mount

  // Function to refresh game history (call after adding a new game)
  const refreshGameHistory = () => {
    const history = loadGameHistory()
    setGameHistory(history)
  }

  function handleGuessChange(value: string) {
    setGuess(value)
    if (value.length > 0) {
      const filtered = characters.filter(character => 
        character.name.toLowerCase().includes(value.toLowerCase())
      )
      setFilteredCharacters(filtered.slice(0, 5)) // Show max 5 suggestions
      setShowSuggestions(true)
      
      // Check if the input exactly matches a character name
      const exactMatch = characters.find(character => 
        character.name.toLowerCase() === value.toLowerCase()
      )
      setPreviewCharacter(exactMatch || null)
    } else {
      setShowSuggestions(false)
      setPreviewCharacter(null)
    }
  }

  function selectCharacter(character: Character) {
    setGuess(character.name)
    setPreviewCharacter(character)
    setShowSuggestions(false)
  }

  function handleSubmit() {
    if (gameOver || guess.trim() === "") return

    const guessedCharacter = characters.find(character => 
      character.name.toLowerCase() === guess.toLowerCase()
    )

    if (!guessedCharacter) {
      alert("Character not found! Please try again.")
      return
    }

    const newGuesses = [...guesses, guessedCharacter]
    const newAttempts = attempts + 1
    setGuesses(newGuesses)
    setAttempts(newAttempts)
    setGuess("")
    setPreviewCharacter(null)
    setShowSuggestions(false)
    
    // Save game state after each guess
    saveGameState({
      guesses: newGuesses,
      attempts: newAttempts
    })
    
    // Set the row that should animate (the one we just submitted)
    setAnimatingRow(attempts)
    
    // Clear the animating row after animation completes
    setTimeout(() => {
      setAnimatingRow(null)
      
      // Check if character guessed correctly or game is over
      if (guessedCharacter.name === mysteryCharacter.name) {
        setGameWon(true)
        setGameOver(true)
        setShowGameOverMessage(true)
        // Save final game state
        saveGameState({
          guesses: newGuesses,
          attempts: newAttempts,
          gameOver: true,
          gameWon: true,
          showGameOverMessage: true
        })
        // Add completed game to history
        addGameToHistory({
          date: new Date().toDateString(),
          mysteryCharacter,
          guesses: newGuesses,
          attempts: newAttempts,
          won: true,
          completedAt: new Date().toISOString()
        })
        // Get updated history and check for trophies
        const updatedHistory = loadGameHistory()
        checkForNewTrophiesWithUpdatedHistory(updatedHistory)
        // Refresh game history state
        refreshGameHistory()
      } else if (newAttempts >= 7) {
        setGameOver(true)
        setShowGameOverMessage(true)
        // Save final game state
        saveGameState({
          guesses: newGuesses,
          attempts: newAttempts,
          gameOver: true,
          gameWon: false,
          showGameOverMessage: true
        })
        // Add completed game to history
        addGameToHistory({
          date: new Date().toDateString(),
          mysteryCharacter,
          guesses: newGuesses,
          attempts: newAttempts,
          won: false,
          completedAt: new Date().toISOString()
        })
        // Get updated history and check for trophies
        const updatedHistory = loadGameHistory()
        checkForNewTrophiesWithUpdatedHistory(updatedHistory)
        // Refresh game history state
        refreshGameHistory()
      }
    }, 1000) // Animation duration + buffer
  }


  // Function to get today's mystery character based on date
  function getTodaysMysteryCharacter(): Character {
    const today = new Date()
    const dateString = today.toDateString() // e.g., "Mon Jan 15 2024"
    
    // Use date string as seed for consistent daily character
    let hash = 0
    for (let i = 0; i < dateString.length; i++) {
      const char = dateString.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    
    const characterIndex = Math.abs(hash) % characters.length
    return characters[characterIndex]
  }

  const mysteryCharacter = getTodaysMysteryCharacter()

  // Function to capture trophy state at the start of a new game
  const captureTrophyStateAtGameStart = () => {
    const currentTrophies = calculateTrophies(gameHistory)
    setPreviousTrophies(currentTrophies)
  }

  // Function to generate shareable results like Wordle
  function generateShareResults(): string {
    const today = new Date().toDateString()
    let result = `Wizarding Worldle ${today}\n`
    
    if (gameWon) {
      result += `${attempts}/7\n\n`
    } else {
      result += `X/7\n\n`
    }

    // Generate emoji grid
    guesses.forEach((character) => {
      const houseEmoji = character.house === mysteryCharacter.house ? '🟩' : '⬜'
      const bloodStatusEmoji = character.bloodStatus === mysteryCharacter.bloodStatus ? '🟩' : '⬜'
      const speciesEmoji = character.species === mysteryCharacter.species ? '🟩' : '⬜'
      const firstAppearanceEmoji = character.firstAppearance === mysteryCharacter.firstAppearance ? '🟩' : '⬜'
      const occupationEmoji = character.occupation === mysteryCharacter.occupation ? '🟩' : '⬜'
      
      result += `${houseEmoji}${bloodStatusEmoji}${speciesEmoji}${firstAppearanceEmoji}${occupationEmoji}\n`
    })

    return result
  }

  function shareResults() {
    const shareText = generateShareResults()
    if (navigator.share) {
      navigator.share({
        title: 'Wizarding Worldle Results',
        text: shareText
      })
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Results copied to clipboard!')
      })
    }
  }

  function clearLocalStorage() {
    localStorage.removeItem(GAME_STORAGE_KEY)
    localStorage.removeItem(GAME_HISTORY_KEY)
    localStorage.removeItem(DARK_MODE_KEY)
    
    // Reset all game state
    setGuesses([])
    setAttempts(0)
    setGameOver(false)
    setGameWon(false)
    setShowGameOverMessage(false)
    setIsDarkMode(false)
    setGameHistory({
      games: [],
      totalGames: 0,
      wins: 0,
      losses: 0,
      currentStreak: 0,
      maxStreak: 0
    })
  }


  const checkForNewTrophiesWithUpdatedHistory = (updatedHistory: GameHistory) => {
    const currentTrophies = calculateTrophies(updatedHistory)
    const newTrophies = getNewlyUnlockedTrophies(previousTrophies, currentTrophies)
    
    if (newTrophies.length > 0) {
      setUnlockedTrophies(newTrophies)
      setShowTrophyUnlockModal(true)
    }
    
    setPreviousTrophies(currentTrophies)
  }


  return (
    <>
      <div className={styles.container}>
        {/* Navigation Bar */}
        <Navbar
          onClearStorage={clearLocalStorage}
          onShowStats={() => setShowStatsModal(true)}
          onShowSettings={() => setShowSettingsModal(true)}
          onShowRules={() => setShowRulesModal(true)}
          onShowTrophies={() => setShowTrophiesModal(true)}
        />
        <GuessGrid
          guesses={guesses}
          attempts={attempts}
          gameOver={gameOver}
          previewCharacter={previewCharacter}
          animatingRow={animatingRow}
          mysteryCharacter={mysteryCharacter}
        />
        
        <GuessInput
          guess={guess}
          gameOver={gameOver}
          showSuggestions={showSuggestions}
          filteredCharacters={filteredCharacters}
          onGuessChange={handleGuessChange}
          onSubmit={handleSubmit}
          onSelectCharacter={selectCharacter}
          onShowSuggestions={setShowSuggestions}
        />
        {showGameOverMessage && gameWon && (
          <GameWonMessage
            mysteryCharacterName={mysteryCharacter.name}
            onShareResults={shareResults}
          />
        )}

        {showGameOverMessage && !gameWon && (
          <GameLostMessage
            mysteryCharacterName={mysteryCharacter.name}
            onShareResults={shareResults}
          />
        )}

        <RulesModal
          isOpen={showRulesModal}
          onClose={() => setShowRulesModal(false)}
        />

        <StatisticsModal
          isOpen={showStatsModal}
          onClose={() => setShowStatsModal(false)}
          gameHistory={gameHistory}
        />

        <SettingsModal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        />

        <TrophiesModal
          isOpen={showTrophiesModal}
          onClose={() => setShowTrophiesModal(false)}
          gameHistory={gameHistory}
        />
        
        <TrophyUnlockModal
          isOpen={showTrophyUnlockModal}
          onClose={() => setShowTrophyUnlockModal(false)}
          unlockedTrophies={unlockedTrophies}
          onViewAllTrophies={() => setShowTrophiesModal(true)}
        />
      </div>
    </>
  )
}

export default App
