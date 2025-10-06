import type { GameHistory } from '../../App'
import Modal from '../../components/Modal/Modal'
import styles from './StatisticsModal.module.css'
import clsx from 'clsx'

interface StatisticsModalProps {
  isOpen: boolean
  onClose: () => void
  gameHistory: GameHistory
}

export default function StatisticsModal({ isOpen, onClose, gameHistory }: StatisticsModalProps) {
  const winRate = gameHistory.totalGames > 0 ? Math.round((gameHistory.wins / gameHistory.totalGames) * 100) : 0

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Statistics"
    >
          {/* Main Stats Grid */}
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{gameHistory.totalGames}</div>
              <div className={styles.statLabel}>Games Played</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{winRate}%</div>
              <div className={styles.statLabel}>Win Rate</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{gameHistory.currentStreak}</div>
              <div className={styles.statLabel}>Current Streak</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{gameHistory.maxStreak}</div>
              <div className={styles.statLabel}>Max Streak</div>
            </div>
          </div>

          {/* Win/Loss Breakdown */}
          <div className={styles.statsSection}>
            <h3 className={styles.statsSectionTitle}>Game Results</h3>
            <div className={styles.statsRow}>
              <span>Wins:</span>
              <span className={styles.statsValue}>{gameHistory.wins}</span>
            </div>
            <div className={styles.statsRow}>
              <span>Losses:</span>
              <span className={styles.statsValue}>{gameHistory.losses}</span>
            </div>
          </div>

          {/* Recent Games */}
          <div className={styles.recentGames}>
            <h3 className={styles.recentGamesTitle}>Recent Games</h3>
            {gameHistory.games.length > 0 ? (
              <div className={styles.recentGamesList}>
                {gameHistory.games
                  .slice()
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 10)
                  .map((game, index) => (
                  <div key={index} className={styles.recentGameItem}>
                    <div className={styles.recentGameDate}>
                      {new Date(game.date).toLocaleDateString()}
                    </div>
                    <div className={styles.recentGameCharacter}>
                      {game.mysteryCharacter.name}
                    </div>
                    <div className={styles.recentGameResult}>
                      <span className={styles.recentGameAttempts}>
                        {game.attempts}/7
                      </span>
                      <span className={clsx(styles.recentGameIcon, {
                        [styles.won]: game.won,
                        [styles.lost]: !game.won
                      })}>
                        {game.won ? '✓' : '✗'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noGames}>
                No games played yet. Start playing to see your statistics!
              </div>
            )}
          </div>
    </Modal>
  )
}