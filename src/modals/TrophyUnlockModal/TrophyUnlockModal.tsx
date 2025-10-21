import { useEffect, useState } from 'react'
import Modal from '../../components/Modal/Modal'
import styles from './TrophyUnlockModal.module.css'
import type { Trophy } from '../../utils/trophyUtils'

interface TrophyUnlockModalProps {
  isOpen: boolean
  onClose: () => void
  unlockedTrophies: Trophy[]
  onViewAllTrophies?: () => void
}

export default function TrophyUnlockModal({ 
  isOpen, 
  onClose, 
  unlockedTrophies,
  onViewAllTrophies
}: TrophyUnlockModalProps) {
  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    if (isOpen && unlockedTrophies.length > 0) {
      // Trigger animation after a short delay
      const timer = setTimeout(() => setShowAnimation(true), 100)
      return () => clearTimeout(timer)
    } else {
      setShowAnimation(false)
    }
  }, [isOpen, unlockedTrophies])

  const getCelebrationMessage = () => {
    if (unlockedTrophies.length === 1) {
      return "🏆 New Trophy Unlocked!"
    } else {
      return `🏆 ${unlockedTrophies.length} New Trophies Unlocked!`
    }
  }

  const getCategoryEmoji = (category: Trophy['category']) => {
    switch (category) {
      case 'streak': return '🔥'
      case 'total_wins': return '🏆'
      case 'misc': return '⭐'
      default: return '🏆'
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={getCelebrationMessage()}
      className={styles.celebrationModal}
    >
      <div className={styles.celebrationContent}>
        {/* Confetti Animation */}
        <div className={styles.confetti}>
          {[...Array(8)].map((_, i) => (
            <div 
              key={i} 
              className={`${styles.confettiPiece} ${showAnimation ? styles.animate : ''}`}
              style={{
                '--delay': `${i * 0.1}s`,
                '--x': `${Math.random() * 100}%`,
                '--rotation': `${Math.random() * 360}deg`
              } as React.CSSProperties}
            >
              {['✨', '⭐', '💫', '🌟'][Math.floor(Math.random() * 4)]}
            </div>
          ))}
        </div>

        {/* Trophy Display */}
        <div className={styles.trophyDisplay}>
          {unlockedTrophies.map((trophy, index) => (
            <div 
              key={trophy.id} 
              className={`${styles.trophyCard} ${showAnimation ? styles.trophyReveal : ''}`}
              style={{ '--delay': `${index * 0.2}s` } as React.CSSProperties}
            >
              <div className={styles.trophyHeader}>
                <div className={styles.trophyEmoji}>{trophy.emoji}</div>
                <div className={styles.trophyCategory}>
                  {getCategoryEmoji(trophy.category)}
                </div>
              </div>
              
              <div className={styles.trophyInfo}>
                <h3 className={styles.trophyName}>{trophy.name}</h3>
                <p className={styles.trophyDescription}>{trophy.description}</p>
              </div>
              
              <div className={styles.trophyGlow}></div>
            </div>
          ))}
        </div>

        {/* Celebration Message */}
        <div className={`${styles.celebrationMessage} ${showAnimation ? styles.messageReveal : ''}`}>
          <p>Congratulations! You've earned a new achievement!</p>
          {unlockedTrophies.length > 1 && (
            <p className={styles.multipleTrophies}>
              Amazing! You unlocked {unlockedTrophies.length} trophies at once! 🎉
            </p>
          )}
        </div>

        {/* Action Button */}
        <div className={`${styles.actionButtons} ${showAnimation ? styles.buttonsReveal : ''}`}>
          <button 
            className={styles.viewTrophiesButton}
            onClick={() => {
              onClose()
              onViewAllTrophies?.()
            }}
          >
            View All Trophies
          </button>
        </div>
      </div>
    </Modal>
  )
}
