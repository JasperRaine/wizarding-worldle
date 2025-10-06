import { type ReactNode } from 'react'
import styles from './Modal.module.css'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  className?: string
}

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  className 
}: ModalProps) {
  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div 
        className={`${styles.modal} ${className || ''}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label={`Close ${title.toLowerCase()} modal`}
          >
            ×
          </button>
        </div>
        
        <div className={styles.modalContent}>
          {children}
        </div>
      </div>
    </div>
  )
}
