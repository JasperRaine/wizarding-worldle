import Modal from '../../components/Modal/Modal'
import styles from './RulesModal.module.css'

interface RulesModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function RulesModal({ isOpen, onClose }: RulesModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="How to Play"
    >
          <p style={{marginBottom: '16px'}}>
            <strong>Guess the Harry Potter character in 7 tries!</strong>
          </p>
          
          <p style={{marginBottom: '16px'}}>
            Each guess reveals information about the mystery character across 5 categories:
          </p>
          
          <ul className={styles.rulesList}>
            <li><strong>House:</strong> Hogwarts house (Gryffindor, Slytherin, Ravenclaw, Hufflepuff, etc.)</li>
            <li><strong>Blood Status:</strong> Pure-blood, Half-blood, Muggle-born, etc.</li>
            <li><strong>Species:</strong> Human, Werewolf, Half-giant, etc.</li>
            <li><strong>First Appearance:</strong> Which book/movie they first appeared in</li>
            <li><strong>Occupation:</strong> Their job or role in the wizarding world</li>
          </ul>
          
          <p style={{marginBottom: '16px'}}>
            <strong>Color coding:</strong>
          </p>
          <ul className={styles.rulesList}>
            <li>🟢 <strong>Green:</strong> Correct match!</li>
            <li>⚪ <strong>Gray:</strong> Incorrect</li>
          </ul>
          
          <p className={styles.rulesGoodLuck}>
            Good luck! ⚡
          </p>
    </Modal>
  )
}
