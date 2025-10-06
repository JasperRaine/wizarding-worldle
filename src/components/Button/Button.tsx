import type { ReactNode } from 'react'
import styles from './Button.module.css'
import clsx from 'clsx'

interface ButtonProps {
  children: ReactNode
  onClick: () => void
  color?: 'primary' | 'success' | 'secondary'
  disabled?: boolean
  style?: React.CSSProperties
}

export default function Button({ 
  children, 
  onClick, 
  color = 'primary', 
  disabled = false,
  style = {}
}: ButtonProps) {
  const getButtonClass = () => {
    return clsx(styles.button, {
      [styles.buttonPrimary]: color === 'primary',
      [styles.buttonSecondary]: color === 'secondary',
      [styles.buttonSuccess]: color === 'success'
    })
  }

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={getButtonClass()}
      style={style}
    >
      {children}
    </button>
  )
}
