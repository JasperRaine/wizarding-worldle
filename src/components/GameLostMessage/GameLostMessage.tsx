import Button from '../Button/Button'
import styles from '../../App.module.css'

interface GameLostMessageProps {
  mysteryCharacterName: string
  onShareResults: () => void
}

export default function GameLostMessage({ mysteryCharacterName, onShareResults }: GameLostMessageProps) {
  const handleBuyButterBeer = () => {
    window.open('https://buymeacoffee.com/jasper2025', '_blank')
  }

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
      <div className={styles.donationMessage}>
        If you enjoyed the game, consider helping to fund my next trip to the Three Broomsticks! 🍺
      </div>
      <Button 
        onClick={handleBuyButterBeer} 
        color="primary"
        style={{ marginTop: '8px', backgroundColor: '#fd0', borderColor: '#fd0', color: 'var(--text-primary)' }}
      >
        🍺 Buy me a butter beer
      </Button>
    </div>
  )
}
