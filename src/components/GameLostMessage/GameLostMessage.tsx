import Button from '../Button/Button'
import styles from '../../App.module.css'

interface GameLostMessageProps {
  mysteryCharacterName: string
  onShareResults: () => void
}

export default function GameLostMessage({ mysteryCharacterName, onShareResults }: GameLostMessageProps) {
  return (
    <div className={styles.gameLost}>
      😔 Game Over! Today's character was: {mysteryCharacterName}
      <br />
      <Button 
        onClick={onShareResults} 
        color="secondary"
        style={{ marginTop: '10px' }}
      >
        📤 Share Results
      </Button>
    </div>
  )
}
