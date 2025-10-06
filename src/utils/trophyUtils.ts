import type { GameHistory } from '../App'

export interface Trophy {
  id: string
  name: string
  description: string
  emoji: string
  unlocked: boolean
  category: 'streak' | 'accuracy' | 'variety' | 'special'
}

export const calculateTrophies = (gameHistory: GameHistory): Trophy[] => {
  const checkAllHouses = () => {
    const wonGames = gameHistory.games.filter(game => game.won)
    const houses = new Set(wonGames.map(game => game.mysteryCharacter.house))
    return houses.size >= 4
  }

  const checkSpeciesVariety = () => {
    const wonGames = gameHistory.games.filter(game => game.won)
    const species = new Set(wonGames.map(game => game.mysteryCharacter.species))
    return species.size >= 5
  }

  return [
    // Streak Trophies
    {
      id: 'first_game',
      name: 'First Game',
      description: 'Play your first game',
      emoji: '🎮',
      unlocked: gameHistory.totalGames >= 1,
      category: 'streak'
    },
    {
      id: 'first_win',
      name: 'First Victory',
      description: 'Win your first game',
      emoji: '🏆',
      unlocked: gameHistory.wins >= 1,
      category: 'streak'
    },
    {
      id: 'streak_3',
      name: 'Hot Streak',
      description: 'Win 3 games in a row',
      emoji: '🔥',
      unlocked: gameHistory.maxStreak >= 3,
      category: 'streak'
    },
    {
      id: 'streak_5',
      name: 'On Fire',
      description: 'Win 5 games in a row',
      emoji: '⚡',
      unlocked: gameHistory.maxStreak >= 5,
      category: 'streak'
    },
    {
      id: 'streak_10',
      name: 'Unstoppable',
      description: 'Win 10 games in a row',
      emoji: '💎',
      unlocked: gameHistory.maxStreak >= 10,
      category: 'streak'
    },

    // Accuracy Trophies
    {
      id: 'perfect_game',
      name: 'Perfect Game',
      description: 'Win a game in 1 guess',
      emoji: '🎯',
      unlocked: gameHistory.games.some(game => game.won && game.attempts === 1),
      category: 'accuracy'
    },
    {
      id: 'efficient_solver',
      name: 'Efficient Solver',
      description: 'Win 5 games in 3 guesses or less',
      emoji: '⚡',
      unlocked: gameHistory.games.filter(game => game.won && game.attempts <= 3).length >= 5,
      category: 'accuracy'
    },
    {
      id: 'master_detective',
      name: 'Master Detective',
      description: 'Win 10 games in 2 guesses or less',
      emoji: '🕵️',
      unlocked: gameHistory.games.filter(game => game.won && game.attempts <= 2).length >= 10,
      category: 'accuracy'
    },

    // Variety Trophies
    {
      id: 'house_explorer',
      name: 'House Explorer',
      description: 'Win games with characters from all 4 houses',
      emoji: '🏰',
      unlocked: checkAllHouses(),
      category: 'variety'
    },
    {
      id: 'species_expert',
      name: 'Species Expert',
      description: 'Win games with 5 different species',
      emoji: '🧙‍♂️',
      unlocked: checkSpeciesVariety(),
      category: 'variety'
    },

    // Special Trophies
    {
      id: 'dedicated_player',
      name: 'Dedicated Player',
      description: 'Play 50 games',
      emoji: '🎮',
      unlocked: gameHistory.totalGames >= 50,
      category: 'special'
    },
    {
      id: 'persistent_solver',
      name: 'Persistent Solver',
      description: 'Play 100 games',
      emoji: '💪',
      unlocked: gameHistory.totalGames >= 100,
      category: 'special'
    }
  ]
}

export const getNewlyUnlockedTrophies = (
  previousTrophies: Trophy[], 
  currentTrophies: Trophy[]
): Trophy[] => {
  // If no previous trophies, all unlocked trophies are "new"
  if (previousTrophies.length === 0) {
    return currentTrophies.filter(trophy => trophy.unlocked)
  }
  
  const previousUnlockedIds = new Set(
    previousTrophies.filter(trophy => trophy.unlocked).map(trophy => trophy.id)
  )
  
  return currentTrophies.filter(trophy => 
    trophy.unlocked && !previousUnlockedIds.has(trophy.id)
  )
}
