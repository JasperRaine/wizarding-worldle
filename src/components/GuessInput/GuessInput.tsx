import { useState, useEffect } from 'react'
import { type Character } from '../../characters'
import Button from '../Button/Button'
import styles from './GuessInput.module.css'

interface GuessInputProps {
  guess: string
  gameOver: boolean
  showSuggestions: boolean
  filteredCharacters: Character[]
  onGuessChange: (value: string) => void
  onSubmit: () => void
  onSelectCharacter: (character: Character) => void
  onShowSuggestions: (show: boolean) => void
  onInputFocusChange?: (focused: boolean) => void
}

export default function GuessInput({
  guess,
  gameOver,
  showSuggestions,
  filteredCharacters,
  onGuessChange,
  onSubmit,
  onSelectCharacter,
  onShowSuggestions,
  onInputFocusChange
}: GuessInputProps) {
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  useEffect(() => {
    // Use Visual Viewport API to detect keyboard height and keep input above it
    if (typeof window === 'undefined' || !window.visualViewport) {
      return // Fallback for browsers without Visual Viewport API support
    }

    const viewport = window.visualViewport
    
    const updateKeyboardHeight = () => {
      // Calculate keyboard height as difference between window and visual viewport
      const heightDiff = window.innerHeight - viewport.height
      // Only consider it a keyboard if difference is significant (> 50px)
      // This prevents false positives from small viewport changes
      setKeyboardHeight(heightDiff > 50 ? heightDiff : 0)
    }

    // Initial calculation
    updateKeyboardHeight()

    // Listen for viewport resize (keyboard open/close)
    // 'resize' event fires when keyboard opens/closes, 'scroll' is not needed here
    viewport.addEventListener('resize', updateKeyboardHeight)

    return () => {
      viewport.removeEventListener('resize', updateKeyboardHeight)
    }
  }, [])

  if (gameOver) return null

  return (
    <div 
      className={styles.inputContainer}
      style={{
        bottom: keyboardHeight > 0 ? `${keyboardHeight}px` : undefined
      }}
    >
      {showSuggestions && filteredCharacters.length > 0 && (
        <div className={styles.suggestions}>
          {filteredCharacters.map((character, index) => (
            <div
              key={index}
              onClick={() => onSelectCharacter(character)}
              className={styles.suggestionItem}
            >
              {character.name}
            </div>
          ))}
        </div>
      )}
      
      <div className={styles.inputRow}>
        <input 
          type="text" 
          value={guess} 
          onChange={(e) => onGuessChange(e.target.value)}
          placeholder="Enter character name..."
          onKeyPress={(e) => e.key === 'Enter' && onSubmit()}
          onFocus={() => {
            onInputFocusChange?.(true)
            if (guess.length > 0) {
              onShowSuggestions(true);
            }
          }}
          onBlur={() => {
            onInputFocusChange?.(false)
            setTimeout(() => onShowSuggestions(false), 200)
          }}
          className={styles.input}
        />
        <Button onClick={onSubmit} color="primary">
          Submit
        </Button>
      </div>
    </div>
  )
}
