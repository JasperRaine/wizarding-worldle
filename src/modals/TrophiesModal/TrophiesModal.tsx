import { useState, useEffect, useCallback } from 'react'
import Modal from '../../components/Modal/Modal'
import styles from './TrophiesModal.module.css'
import { calculateTrophies, type Trophy } from '../../utils/trophyUtils'
import type { GameHistory } from '../../App'
import clsx from 'clsx'

interface TrophiesModalProps {
  isOpen: boolean
  onClose: () => void
  gameHistory: GameHistory
}


export default function TrophiesModal({ isOpen, onClose, gameHistory }: TrophiesModalProps) {
  const [trophies, setTrophies] = useState<Trophy[]>([])

  const updateTrophies = useCallback(() => {
    const allTrophies = calculateTrophies(gameHistory)
    setTrophies(allTrophies)
  }, [gameHistory])

  useEffect(() => {
    if (isOpen) {
      updateTrophies()
    }
  }, [isOpen, updateTrophies])


  const getUnlockedCount = () => {
    return trophies.filter(trophy => trophy.unlocked).length
  }

  const getTrophiesByCategory = (category: Trophy['category']) => {
    return trophies.filter(trophy => trophy.category === category)
  }

  const categories = [
    { key: 'streak' as const, name: 'Streaks', emoji: '🔥' },
    { key: 'accuracy' as const, name: 'Accuracy', emoji: '🎯' },
    { key: 'variety' as const, name: 'Variety', emoji: '🌟' },
    { key: 'special' as const, name: 'Special', emoji: '⭐' }
  ]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🏆 Trophies & Achievements"
    >
          <div className={styles.trophyStats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{getUnlockedCount()}</span>
              <span className={styles.statLabel}>Unlocked</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{trophies.length}</span>
              <span className={styles.statLabel}>Total</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>
                {Math.round((getUnlockedCount() / trophies.length) * 100)}%
              </span>
              <span className={styles.statLabel}>Complete</span>
            </div>
          </div>

          {categories.map(category => {
            const categoryTrophies = getTrophiesByCategory(category.key)
            const unlockedInCategory = categoryTrophies.filter(t => t.unlocked).length
            
            return (
              <div key={category.key} className={styles.trophyCategory}>
                <h3 className={styles.categoryTitle}>
                  {category.emoji} {category.name}
                  <span className={styles.categoryProgress}>
                    ({unlockedInCategory}/{categoryTrophies.length})
                  </span>
                </h3>
                
                <div className={styles.trophyGrid}>
                  {categoryTrophies.map(trophy => (
                    <div 
                      key={trophy.id} 
                      className={clsx(styles.trophyItem, {
                        [styles.trophyUnlocked]: trophy.unlocked,
                        [styles.trophyLocked]: !trophy.unlocked
                      })}
                    >
                      <div className={styles.trophyEmoji}>
                        {trophy.unlocked ? trophy.emoji : '🔒'}
                      </div>
                      <div className={styles.trophyInfo}>
                        <div className={styles.trophyName}>
                          {trophy.unlocked ? trophy.name : '???'}
                        </div>
                        <div className={styles.trophyDescription}>
                          {trophy.unlocked ? trophy.description : 'Keep playing to unlock!'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
    </Modal>
  )
}
