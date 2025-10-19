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
}

export default function GuessInput({
  guess,
  gameOver,
  showSuggestions,
  filteredCharacters,
  onGuessChange,
  onSubmit,
  onSelectCharacter,
  onShowSuggestions
}: GuessInputProps) {
  if (gameOver) return null

  return (
    <div className={styles.inputContainer}>
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
          onBlur={() => setTimeout(() => onShowSuggestions(false), 200)}
          onFocus={() => guess.length > 0 && onShowSuggestions(true)}
          className={styles.input}
        />
        <Button onClick={onSubmit} color="primary">
          Submit
        </Button>
      </div>
    </div>
  )
}
