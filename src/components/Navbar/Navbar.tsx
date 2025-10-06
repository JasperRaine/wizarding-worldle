import clsx from 'clsx'
import styles from './Navbar.module.css'
import { BarChart3, Settings, Trophy, BookOpen, Trash2 } from 'lucide-react'

interface NavbarProps {
  onClearStorage: () => void
  onShowStats: () => void
  onShowSettings: () => void
  onShowRules: () => void
  onShowTrophies: () => void
}

export default function Navbar({ 
  onClearStorage, 
  onShowStats, 
  onShowSettings, 
  onShowRules,
  onShowTrophies
}: NavbarProps) {
  return (
    <nav className={styles.nav}>
      <div className={styles.navTitle}>
        <h1 className={styles.title}>
          Wizarding Worldle 🪄
        </h1>
        <p className={styles.subtitle}>
          Guess the Harry Potter character!
        </p>
      </div>
      
      <div className={styles.navButtons}>
        <button
          onClick={onClearStorage}
          className={clsx(styles.navButton, styles.navButtonDanger)}
          title="Clear all game data"
        >
          <Trash2 size={22} />
        </button>
        <button
          onClick={onShowStats}
          className={styles.navButton}
          title="Statistics"
        >
          <BarChart3 size={22} />
        </button>
        <button
          onClick={onShowTrophies}
          className={styles.navButton}
          title="Trophies & Achievements"
        >
          <Trophy size={22} />
        </button>
        <button
          onClick={onShowSettings}
          className={styles.navButton}
          title="Settings"
        >
          <Settings size={22} />
        </button>
        <button
          onClick={onShowRules}
          className={styles.navButton}
          title="How to Play"
        >
          <BookOpen size={22} />
        </button>
      </div>
    </nav>
  )
}
