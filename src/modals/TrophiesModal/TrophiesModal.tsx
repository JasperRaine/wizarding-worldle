import { useState, useEffect, useCallback } from 'react'
import Modal from '../../components/Modal/Modal'
import styles from './TrophiesModal.module.css'
import { calculateTrophies, getNextTrophyProgress, getMiscTrophyProgress, getTrophyCharacters, type Trophy } from '../../utils/trophyUtils'
import type { GameHistory } from '../../App'
import clsx from 'clsx'

interface TrophiesModalProps {
  isOpen: boolean
  onClose: () => void
  gameHistory: GameHistory
}


export default function TrophiesModal({ isOpen, onClose, gameHistory }: TrophiesModalProps) {
  const [trophies, setTrophies] = useState<Trophy[]>([])
  const [expandedTrophies, setExpandedTrophies] = useState<Set<string>>(new Set())
  const [collapsingTrophies, setCollapsingTrophies] = useState<Set<string>>(new Set())

  const updateTrophies = useCallback(() => {
    const allTrophies = calculateTrophies(gameHistory)
    setTrophies(allTrophies)
  }, [gameHistory])

  const toggleTrophy = (trophyId: string) => {
    const isCurrentlyExpanded = expandedTrophies.has(trophyId)
    
    if (isCurrentlyExpanded) {
      // Start collapsing animation
      setCollapsingTrophies(prev => new Set(prev).add(trophyId))
      // Remove from expanded after animation completes
      setTimeout(() => {
        setExpandedTrophies(prev => {
          const newSet = new Set(prev)
          newSet.delete(trophyId)
          return newSet
        })
        setCollapsingTrophies(prev => {
          const newSet = new Set(prev)
          newSet.delete(trophyId)
          return newSet
        })
      }, 300) // Match animation duration
    } else {
      // Remove from collapsing if it was collapsing
      setCollapsingTrophies(prev => {
        const newSet = new Set(prev)
        newSet.delete(trophyId)
        return newSet
      })
      // Add to expanded
      setExpandedTrophies(prev => new Set(prev).add(trophyId))
    }
  }

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
    { key: 'streak' as const, name: 'Streak', emoji: '🔥' },
    { key: 'total_wins' as const, name: 'Total Wins', emoji: '🏆' },
    { key: 'misc' as const, name: 'Misc', emoji: '⭐' }
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
            
            // Get next trophy progress for streak and total_wins categories
            const nextTrophyProgress = (category.key === 'streak' || category.key === 'total_wins')
              ? getNextTrophyProgress(gameHistory, category.key)
              : null
            
            return (
              <div key={category.key} className={styles.trophyCategory}>
                <h3 className={styles.categoryTitle}>
                  {category.emoji} {category.name}
                  <span className={styles.categoryProgress}>
                    ({unlockedInCategory}/{categoryTrophies.length})
                  </span>
                </h3>
                
                <div className={styles.trophyGrid}>
                  {categoryTrophies.map(trophy => {
                    const isNextTrophy = nextTrophyProgress?.trophy?.id === trophy.id
                    let progressData = null
                    let showProgress = false
                    const trophyCharacters = getTrophyCharacters(gameHistory, trophy.id)
                    const isExpandable = trophyCharacters !== null
                    const isExpanded = expandedTrophies.has(trophy.id)
                    
                    // Get progress for streak/total_wins (next trophy only) or misc (all trophies)
                    if (category.key === 'misc') {
                      progressData = getMiscTrophyProgress(gameHistory, trophy.id)
                      showProgress = progressData !== null && !trophy.unlocked
                    } else {
                      showProgress = isNextTrophy && nextTrophyProgress !== null && !trophy.unlocked
                      if (showProgress && nextTrophyProgress) {
                        progressData = {
                          current: nextTrophyProgress.current,
                          required: nextTrophyProgress.required,
                          progress: nextTrophyProgress.progress
                        }
                      }
                    }
                    
                    return (
                      <div 
                        key={trophy.id} 
                        className={clsx(styles.trophyItem, {
                          [styles.trophyUnlocked]: trophy.unlocked,
                          [styles.trophyLocked]: !trophy.unlocked,
                          [styles.trophyNext]: isNextTrophy,
                          [styles.trophyExpandable]: isExpandable
                        })}
                      >
                        <div className={styles.trophyEmoji}>
                          {trophy.unlocked ? trophy.emoji : '🔒'}
                        </div>
                        <div className={styles.trophyInfo}>
                          <div 
                            className={clsx(styles.trophyHeader, {
                              [styles.trophyHeaderClickable]: isExpandable
                            })}
                            onClick={isExpandable ? () => toggleTrophy(trophy.id) : undefined}
                          >
                            <div className={styles.trophyName}>
                              {trophy.name}
                            </div>
                            <div className={styles.trophyDescription}>
                              {(() => {
                                // Show description for unlocked trophies
                                if (trophy.unlocked) {
                                  return trophy.description
                                }
                                // Show description for misc trophies (even when locked)
                                if (category.key === 'misc') {
                                  return trophy.description
                                }
                                // Show description for total_wins trophies (even when locked)
                                if (category.key === 'total_wins') {
                                  return trophy.description
                                }
                                // Show description for next trophy in streak (even when locked)
                                if (isNextTrophy) {
                                  return trophy.description
                                }
                                // Default message for other locked trophies
                                return 'Keep playing to unlock!'
                              })()}
                            </div>
                            {isExpandable && (
                              <div className={clsx(styles.expandIcon, {
                                [styles.expanded]: isExpanded
                              })}>
                                ▶
                              </div>
                            )}
                          </div>
                          {showProgress && progressData && (
                            <div className={styles.trophyProgressContainer}>
                              <div className={styles.trophyProgressText}>
                                {progressData.progress}
                              </div>
                              <div className={styles.progressBarContainer}>
                                <div 
                                  className={styles.progressBar}
                                  style={{ width: `${Math.min((progressData.current / progressData.required) * 100, 100)}%` }}
                                />
                              </div>
                            </div>
                          )}
                          {isExpandable && (isExpanded || collapsingTrophies.has(trophy.id)) && trophyCharacters && (
                            <div className={clsx(styles.trophyCharactersList, {
                              [styles.trophyCharactersListExpanding]: isExpanded && !collapsingTrophies.has(trophy.id),
                              [styles.trophyCharactersListCollapsing]: collapsingTrophies.has(trophy.id)
                            })}>
                              {trophyCharacters.map((char, index) => (
                                <div 
                                  key={index} 
                                  className={clsx(styles.characterItem, {
                                    [styles.characterGuessed]: char.guessed
                                  })}
                                >
                                  <span className={styles.characterCheck}>
                                    {char.guessed ? '✓' : '○'}
                                  </span>
                                  <span className={styles.characterName}>{char.name}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
    </Modal>
  )
}
