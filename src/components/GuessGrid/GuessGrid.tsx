import { type Character } from '../../characters'
import { useEffect, useRef, useState } from 'react'
import styles from './GuessGrid.module.css'
import clsx from 'clsx'

interface GuessGridProps {
  guesses: Character[]
  attempts: number
  gameOver: boolean
  previewCharacter: Character | null
  animatingRow: number | null
  mysteryCharacter: Character
}

export default function GuessGrid({
  guesses,
  attempts,
  gameOver,
  previewCharacter,
  animatingRow,
  mysteryCharacter
}: GuessGridProps) {
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])
  const [shouldAnimateRow, setShouldAnimateRow] = useState<number | null>(null)

  // Check if row is in viewport and scroll if needed before starting animation
  useEffect(() => {
    if (animatingRow !== null && rowRefs.current[animatingRow]) {
      const rowElement = rowRefs.current[animatingRow]
      if (!rowElement) return

      // Check if row is fully in viewport (entire row must be visible)
      const rect = rowElement.getBoundingClientRect()
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight
      const padding = 20 // Small padding for better UX
      
      // Row is fully in view if both top and bottom are within viewport with padding
      const isFullyInViewport = (
        rect.top >= padding &&
        rect.bottom <= viewportHeight - padding
      )

      if (!isFullyInViewport) {
        // Calculate how much we need to scroll to make the row fully visible
        let scrollOffset = 0
        
        if (rect.top < padding) {
          // Top is cut off, scroll up
          scrollOffset = rect.top - padding
        } else if (rect.bottom > viewportHeight - padding) {
          // Bottom is cut off, scroll down
          scrollOffset = rect.bottom - (viewportHeight - padding)
        }
        
        // Scroll row into view first, ensuring it's fully visible
        if (scrollOffset !== 0) {
          window.scrollBy({
            top: scrollOffset,
            behavior: 'smooth'
          })
        } else {
          // Fallback: use scrollIntoView if calculation didn't work
          rowElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
          })
        }
        
        // Wait for scroll to complete before starting animation
        // Scroll animation typically takes ~300-500ms, so wait a bit longer
        const scrollTimeout = setTimeout(() => {
          setShouldAnimateRow(animatingRow)
          
          // Clear animation state after animation fully completes
          // Longest animation: 0.5s delay + 0.6s duration = 1.1s total
          setTimeout(() => {
            setShouldAnimateRow(null)
          }, 1200) // Wait for full animation + buffer
        }, 500) // Adjust timing based on scroll duration

        return () => clearTimeout(scrollTimeout)
      } else {
        // Row is already in view, start animation immediately
        setShouldAnimateRow(animatingRow)
        
        // Clear animation state after animation fully completes
        // Longest animation: 0.5s delay + 0.6s duration = 1.1s total
        const clearAnimationTimeout = setTimeout(() => {
          setShouldAnimateRow(null)
        }, 1200) // Wait for full animation + buffer
        
        return () => clearTimeout(clearAnimationTimeout)
      }
    } else {
      // No row to animate, clear the animation state immediately
      setShouldAnimateRow(null)
    }
  }, [animatingRow])
  // Function to check for partial species match
  const checkSpeciesMatch = (guessSpecies: string, mysterySpecies: string): 'correct' | 'partial' | 'incorrect' => {
    // First check for exact match
    if (guessSpecies === mysterySpecies) {
      return 'correct'
    }
    
    // Check for partial matches using the "Human/Giant" format
    const guessLower = guessSpecies.toLowerCase()
    const mysteryLower = mysterySpecies.toLowerCase()
    
    // Split by "/" to get individual species components
    const guessSpeciesList = guessLower.split('/')
    const mysterySpeciesList = mysteryLower.split('/')
    
    // Check if any species from guess matches any species from mystery
    const hasPartialMatch = guessSpeciesList.some(guessSpecies => 
      mysterySpeciesList.includes(guessSpecies)
    )
    
    if (hasPartialMatch) {
      return 'partial'
    }
    
    return 'incorrect'
  }

  const getCellClass = (isEmpty: boolean, isPreviewRow: boolean, isCorrect: boolean, isAnimating: boolean, columnIndex: number, isPartial?: boolean) => {
    return clsx(styles.gridCell, {
      [styles.gridCellEmpty]: isEmpty && !isPreviewRow,
      [styles.gridCellPreview]: isPreviewRow,
      [styles.gridCellCorrect]: isCorrect,
      [styles.gridCellPartial]: isPartial,
      [styles.gridCellIncorrect]: !isCorrect && !isPartial && !isEmpty,
      [styles[`gridCellAnimatingCorrect${columnIndex}`]]: isAnimating && isCorrect,
      [styles[`gridCellAnimatingPartial${columnIndex}`]]: isAnimating && isPartial,
      [styles[`gridCellAnimating${columnIndex}`]]: isAnimating && !isCorrect && !isPartial
    })
  }

  return (
    <div className={styles.gridContainer}>
      {/* Header Row */}
      <div className={styles.gridHeader}>
        <div>House</div>
        <div>Blood Status</div>
        <div>Species</div>
        <div>First Appearance</div>
        <div>Occupation</div>
      </div>
      
      {/* Show all 7 rows - filled guesses and empty rows */}
      {Array.from({ length: 7 }, (_, index) => {
        const character = guesses[index]
        const isCurrentRow = index === attempts && !gameOver
        const isPreviewRow = Boolean(isCurrentRow && previewCharacter && !character)
        // Use shouldAnimateRow instead of animatingRow to delay animation until scroll completes
        const isAnimatingRow = Boolean(shouldAnimateRow === index)
        // If this row should animate but hasn't started yet (waiting for scroll), keep it empty
        const isWaitingForScroll = animatingRow === index && shouldAnimateRow !== index
        const displayCharacter = character && !isWaitingForScroll 
          ? character 
          : (isCurrentRow && previewCharacter && !isPreviewRow && !isAnimatingRow && !isWaitingForScroll 
              ? previewCharacter 
              : null)
        const isEmpty = !displayCharacter
        
        return (
          <div 
            key={index} 
            className={styles.gridRowContainer}
            ref={(el) => {
              rowRefs.current[index] = el
            }}
          >
            {/* Character Name Above Row - Always render to maintain consistent spacing */}
            <div className={clsx(styles.characterName, {
              [styles.characterNameAnimating]: displayCharacter && (isAnimatingRow || (index === attempts - 1 && gameOver))
            })}>
              {displayCharacter ? displayCharacter.name : ''}
            </div>
            
            {/* Grid Row */}
            <div className={styles.gridRow}>
              {/* House Column */}
              <div className={getCellClass(isEmpty, isPreviewRow, Boolean(displayCharacter?.house === mysteryCharacter.house), isAnimatingRow, 0)}>
                {(isEmpty && !isPreviewRow) || isPreviewRow ? '' : (isAnimatingRow ? <span className={styles.gridCellContent0}>{character.house}</span> : displayCharacter?.house)}
              </div>

              {/* Blood Status Column */}
              <div className={getCellClass(isEmpty, isPreviewRow, Boolean(displayCharacter?.bloodStatus === mysteryCharacter.bloodStatus), isAnimatingRow, 1)}>
                {(isEmpty && !isPreviewRow) || isPreviewRow ? '' : (isAnimatingRow ? <span className={styles.gridCellContent1}>{character.bloodStatus}</span> : displayCharacter?.bloodStatus)}
              </div>

              {/* Species Column */}
              <div className={(() => {
                if (isEmpty || isPreviewRow) {
                  return getCellClass(isEmpty, isPreviewRow, false, isAnimatingRow, 2)
                }
                const speciesMatch = checkSpeciesMatch(displayCharacter?.species || '', mysteryCharacter.species)
                const isCorrect = speciesMatch === 'correct'
                const isPartial = speciesMatch === 'partial'
                return getCellClass(isEmpty, isPreviewRow, isCorrect, isAnimatingRow, 2, isPartial)
              })()}>
                {(isEmpty && !isPreviewRow) || isPreviewRow ? '' : (isAnimatingRow ? <span className={styles.gridCellContent2}>{character.species}</span> : displayCharacter?.species)}
              </div>

              {/* First Appearance Column */}
              <div className={getCellClass(isEmpty, isPreviewRow, Boolean(displayCharacter?.firstAppearance === mysteryCharacter.firstAppearance), isAnimatingRow, 3)}>
                {(isEmpty && !isPreviewRow) || isPreviewRow ? '' : (isAnimatingRow ? <span className={styles.gridCellContent3}>{character.firstAppearance}</span> : displayCharacter?.firstAppearance)}
              </div>

              {/* Occupation Column */}
              <div className={getCellClass(isEmpty, isPreviewRow, Boolean(displayCharacter?.occupation === mysteryCharacter.occupation), isAnimatingRow, 4)}>
                {(isEmpty && !isPreviewRow) || isPreviewRow ? '' : (isAnimatingRow ? <span className={styles.gridCellContent4}>{character.occupation}</span> : displayCharacter?.occupation)}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
