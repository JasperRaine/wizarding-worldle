import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { type Character } from '../../characters'
import { type Trophy } from '../../utils/trophyUtils'

// Interface for completed game record
export interface GameRecord {
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

interface AppState {
  // UI Modals
  modals: {
    rules: boolean
    stats: boolean
    settings: boolean
    trophies: boolean
    trophyUnlock: boolean
  }
  
  // Settings
  isDarkMode: boolean
  
  // Game History
  gameHistory: GameHistory
  
  // Trophy System
  unlockedTrophies: Trophy[]
  previousTrophies: Trophy[]
}

const initialState: AppState = {
  modals: {
    rules: false,
    stats: false,
    settings: false,
    trophies: false,
    trophyUnlock: false,
  },
  isDarkMode: false,
  gameHistory: {
    games: [],
    totalGames: 0,
    wins: 0,
    losses: 0,
    currentStreak: 0,
    maxStreak: 0,
  },
  unlockedTrophies: [],
  previousTrophies: [],
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    // Modal actions
    toggleModal: (state, action: PayloadAction<{ modal: keyof AppState['modals']; show: boolean }>) => {
      state.modals[action.payload.modal] = action.payload.show
    },
    
    closeAllModals: (state) => {
      state.modals = {
        rules: false,
        stats: false,
        settings: false,
        trophies: false,
        trophyUnlock: false,
      }
    },
    
    // Settings actions
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode
    },
    
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload
    },
    
    // Game history actions
    updateGameHistory: (state, action: PayloadAction<GameHistory>) => {
      state.gameHistory = action.payload
    },
    
    addGameToHistory: (state, action: PayloadAction<GameRecord>) => {
      const newGame = action.payload
      const updatedGames = [...state.gameHistory.games, newGame]
      
      // Calculate new statistics
      const totalGames = updatedGames.length
      const wins = updatedGames.filter(game => game.won).length
      const losses = totalGames - wins
      
      // Calculate current streak
      let currentStreak = 0
      for (let i = updatedGames.length - 1; i >= 0; i--) {
        if (updatedGames[i].won) {
          currentStreak++
        } else {
          break
        }
      }
      
      // Calculate max streak
      let maxStreak = 0
      let tempStreak = 0
      for (const game of updatedGames) {
        if (game.won) {
          tempStreak++
          maxStreak = Math.max(maxStreak, tempStreak)
        } else {
          tempStreak = 0
        }
      }
      
      state.gameHistory = {
        games: updatedGames,
        totalGames,
        wins,
        losses,
        currentStreak,
        maxStreak,
      }
    },
    
    // Trophy actions
    setUnlockedTrophies: (state, action: PayloadAction<Trophy[]>) => {
      state.unlockedTrophies = action.payload
    },
    
    setPreviousTrophies: (state, action: PayloadAction<Trophy[]>) => {
      state.previousTrophies = action.payload
    },
    
    clearUnlockedTrophies: (state) => {
      state.unlockedTrophies = []
    },
    
    // Load app state from localStorage
    loadAppState: (state, action: PayloadAction<Partial<AppState>>) => {
      return { ...state, ...action.payload }
    },
  },
})

export const {
  toggleModal,
  closeAllModals,
  toggleDarkMode,
  setDarkMode,
  updateGameHistory,
  addGameToHistory,
  setUnlockedTrophies,
  setPreviousTrophies,
  clearUnlockedTrophies,
  loadAppState,
} = appSlice.actions

export default appSlice.reducer
