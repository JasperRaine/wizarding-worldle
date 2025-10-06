import Modal from '../../components/Modal/Modal'
import styles from './SettingsModal.module.css'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  isDarkMode: boolean
  onToggleDarkMode: () => void
}

export default function SettingsModal({ isOpen, onClose, isDarkMode, onToggleDarkMode }: SettingsModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Settings"
    >
          {/* Dark Mode Toggle */}
          <div className={styles.settingItem}>
            <div className={styles.settingLabel}>Dark Mode</div>
            <label className={styles.toggleSwitch}>
              <input
                type="checkbox"
                checked={isDarkMode}
                onChange={onToggleDarkMode}
              />
              <span className={styles.toggleSlider}></span>
            </label>
          </div>

          {/* Additional Settings Placeholder */}
          <div style={{
            padding: '16px 0',
            color: 'var(--text-secondary)',
            fontStyle: 'italic'
          }}>
            More settings coming soon...
          </div>
    </Modal>
  )
}