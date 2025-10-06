import Button from '../Button/Button'
import styles from '../../App.module.css'

interface GameWonMessageProps {
  mysteryCharacterName: string
  onShareResults: () => void
}

export default function GameWonMessage({ mysteryCharacterName, onShareResults }: GameWonMessageProps) {
  return (
    <div className={styles.gameWon}>
      🎉 Congratulations! You guessed today's character: {mysteryCharacterName}!
      <br />
      <Button 
        onClick={onShareResults} 
        color="success"
        style={{ marginTop: '10px' }}
      >
        📤 Share Results
      </Button>
    </div>
  )
}
