import type { Middleware } from '@reduxjs/toolkit'
import type { RootState } from '../index'

// Local storage keys
const GAME_STORAGE_KEY = 'wizarding-worldle-game-state'
const GAME_HISTORY_KEY = 'wizarding-worldle-game-history'
const DARK_MODE_KEY = 'wizarding-worldle-dark-mode'

// Interface for saved game state
interface SavedGameState {
  guesses: any[]
  attempts: number
  gameOver: boolean
  gameWon: boolean
  showGameOverMessage: boolean
  date: string
}

export const persistenceMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  const result = next(action)
  const state = store.getState()

  // Save game state to localStorage
  if (typeof action === 'object' && action !== null && 'type' in action && typeof action.type === 'string' && action.type.startsWith('game/')) {
    const gameState = state.game
    const currentDate = new Date().toDateString()
    
    const stateToSave: SavedGameState = {
      guesses: gameState.guesses,
      attempts: gameState.attempts,
      gameOver: gameState.gameOver,
      gameWon: gameState.gameWon,
      showGameOverMessage: gameState.showGameOverMessage,
      date: currentDate,
    }
    
    localStorage.setItem(GAME_STORAGE_KEY, JSON.stringify(stateToSave))
  }

  // Save app state to localStorage
  if (typeof action === 'object' && action !== null && 'type' in action && typeof action.type === 'string' && action.type.startsWith('app/')) {
    const appState = state.app
    
    // Save dark mode preference
    localStorage.setItem(DARK_MODE_KEY, JSON.stringify(appState.isDarkMode))
    
    // Save game history
    localStorage.setItem(GAME_HISTORY_KEY, JSON.stringify(appState.gameHistory))
  }

  return result
}

// Helper functions to load from localStorage
export const loadGameStateFromStorage = () => {
  try {
    const saved = localStorage.getItem(GAME_STORAGE_KEY)
    if (saved) {
      const gameState = JSON.parse(saved)
      const currentDate = new Date().toDateString()
      
      // Only load if it's from today
      if (gameState.date === currentDate) {
        return gameState
      }
    }
  } catch (error) {
    console.error('Error loading game state:', error)
  }
  return null
}

export const loadAppStateFromStorage = () => {
  try {
    const darkMode = localStorage.getItem(DARK_MODE_KEY)
    const gameHistory = localStorage.getItem(GAME_HISTORY_KEY)
    
    return {
      isDarkMode: darkMode ? JSON.parse(darkMode) : false,
      gameHistory: gameHistory ? JSON.parse(gameHistory) : {
        games: [],
        totalGames: 0,
        wins: 0,
        losses: 0,
        currentStreak: 0,
        maxStreak: 0,
      },
    }
  } catch (error) {
    console.error('Error loading app state:', error)
    return {
      isDarkMode: false,
      gameHistory: {
        games: [],
        totalGames: 0,
        wins: 0,
        losses: 0,
        currentStreak: 0,
        maxStreak: 0,
      },
    }
  }
}
