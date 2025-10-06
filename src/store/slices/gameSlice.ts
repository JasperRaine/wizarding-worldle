import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { type Character } from '../../characters'
import { characters } from '../../characters'

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

interface GameState {
  // Current game
  currentGuess: string
  guesses: Character[]
  attempts: number
  gameOver: boolean
  gameWon: boolean
  mysteryCharacter: Character
  
  // Input & suggestions
  showSuggestions: boolean
  filteredCharacters: Character[]
  previewCharacter: Character | null
  
  // Animation
  animatingRow: number | null
  showGameOverMessage: boolean
}

const initialState: GameState = {
  currentGuess: '',
  guesses: [],
  attempts: 0,
  gameOver: false,
  gameWon: false,
  mysteryCharacter: getTodaysMysteryCharacter(),
  showSuggestions: false,
  filteredCharacters: [],
  previewCharacter: null,
  animatingRow: null,
  showGameOverMessage: false,
}

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setCurrentGuess: (state, action: PayloadAction<string>) => {
      state.currentGuess = action.payload
      
      // Update suggestions when guess changes
      if (action.payload.length > 0) {
        const filtered = characters.filter(character => 
          character.name.toLowerCase().includes(action.payload.toLowerCase())
        )
        state.filteredCharacters = filtered.slice(0, 5) // Show max 5 suggestions
        state.showSuggestions = true
        
        // Check if the input exactly matches a character name
        const exactMatch = characters.find(character => 
          character.name.toLowerCase() === action.payload.toLowerCase()
        )
        state.previewCharacter = exactMatch || null
      } else {
        state.showSuggestions = false
        state.previewCharacter = null
      }
    },
    
    selectCharacter: (state, action: PayloadAction<Character>) => {
      state.currentGuess = action.payload.name
      state.previewCharacter = action.payload
      state.showSuggestions = false
    },
    
    submitGuess: (state) => {
      if (state.gameOver || state.currentGuess.trim() === "") return
      
      const guessedCharacter = characters.find(character => 
        character.name.toLowerCase() === state.currentGuess.toLowerCase()
      )
      
      if (!guessedCharacter) return
      
      const newGuesses = [...state.guesses, guessedCharacter]
      const newAttempts = state.attempts + 1
      
      state.guesses = newGuesses
      state.attempts = newAttempts
      state.currentGuess = ''
      state.previewCharacter = null
      state.showSuggestions = false
      state.animatingRow = state.attempts
      
      // Check if game is won or lost
      if (guessedCharacter.name === state.mysteryCharacter.name) {
        state.gameWon = true
        state.gameOver = true
        state.showGameOverMessage = true
      } else if (newAttempts >= 7) {
        state.gameOver = true
        state.showGameOverMessage = true
      }
    },
    
    clearAnimatingRow: (state) => {
      state.animatingRow = null
    },
    
    toggleSuggestions: (state, action: PayloadAction<boolean>) => {
      state.showSuggestions = action.payload
    },
    
    resetGame: (state) => {
      state.currentGuess = ''
      state.guesses = []
      state.attempts = 0
      state.gameOver = false
      state.gameWon = false
      state.showSuggestions = false
      state.filteredCharacters = []
      state.previewCharacter = null
      state.animatingRow = null
      state.showGameOverMessage = false
      state.mysteryCharacter = getTodaysMysteryCharacter()
    },
    
    loadGameState: (state, action: PayloadAction<Partial<GameState>>) => {
      return { ...state, ...action.payload }
    },
  },
})

export const {
  setCurrentGuess,
  selectCharacter,
  submitGuess,
  clearAnimatingRow,
  toggleSuggestions,
  resetGame,
  loadGameState,
} = gameSlice.actions

export default gameSlice.reducer
