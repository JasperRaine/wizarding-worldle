import type { GameHistory } from '../App'

export interface Trophy {
  id: string
  name: string
  description: string
  emoji: string
  unlocked: boolean
  category: 'streak' | 'total_wins' | 'misc'
}

export const calculateTrophies = (gameHistory: GameHistory): Trophy[] => {
  // Helper functions for specific character groups
  const checkTrio = () => {
    const wonGames = gameHistory.games.filter(game => game.won)
    const characterNames = new Set(wonGames.map(game => game.mysteryCharacter.name))
    return characterNames.has('Harry Potter') && 
           characterNames.has('Hermione Granger') && 
           characterNames.has('Ron Weasley')
  }

  const checkWeasleyFamily = () => {
    const wonGames = gameHistory.games.filter(game => game.won)
    const characterNames = new Set(wonGames.map(game => game.mysteryCharacter.name))
    const weasleyNames = ['Arthur Weasley', 'Molly Weasley', 'Bill Weasley', 'Charlie Weasley', 
                         'Percy Weasley', 'Fred Weasley', 'George Weasley', 'Ron Weasley', 'Ginny Weasley']
    return weasleyNames.every(name => characterNames.has(name))
  }

  const checkWeasleyTwins = () => {
    const wonGames = gameHistory.games.filter(game => game.won)
    const characterNames = new Set(wonGames.map(game => game.mysteryCharacter.name))
    return characterNames.has('Fred Weasley') && characterNames.has('George Weasley')
  }

  const checkMarauders = () => {
    const wonGames = gameHistory.games.filter(game => game.won)
    const characterNames = new Set(wonGames.map(game => game.mysteryCharacter.name))
    return characterNames.has('James Potter') && 
           characterNames.has('Sirius Black') && 
           characterNames.has('Remus Lupin') && 
           characterNames.has('Peter Pettigrew')
  }

  const checkMalfoyFamily = () => {
    const wonGames = gameHistory.games.filter(game => game.won)
    const characterNames = new Set(wonGames.map(game => game.mysteryCharacter.name))
    return characterNames.has('Lucius Malfoy') && 
           characterNames.has('Narcissa Malfoy') && 
           characterNames.has('Draco Malfoy')
  }

  const checkLastChanceWins = () => {
    const wonGames = gameHistory.games.filter(game => game.won && game.attempts === 6)
    return wonGames.length >= 3
  }

  return [
    // Streak Trophies
    {
      id: 'streak_3',
      name: '3 Day Streak',
      description: 'Win 3 games in a row',
      emoji: '🔥',
      unlocked: gameHistory.maxStreak >= 3,
      category: 'streak'
    },
    {
      id: 'streak_7',
      name: '7 Day Streak',
      description: 'Win 7 games in a row',
      emoji: '⚡',
      unlocked: gameHistory.maxStreak >= 7,
      category: 'streak'
    },
    {
      id: 'streak_14',
      name: '14 Day Streak',
      description: 'Win 14 games in a row',
      emoji: '💎',
      unlocked: gameHistory.maxStreak >= 14,
      category: 'streak'
    },
    {
      id: 'streak_30',
      name: '30 Day Streak',
      description: 'Win 30 games in a row',
      emoji: '👑',
      unlocked: gameHistory.maxStreak >= 30,
      category: 'streak'
    },
    {
      id: 'streak_90',
      name: '90 Day Streak',
      description: 'Win 90 games in a row',
      emoji: '🏆',
      unlocked: gameHistory.maxStreak >= 90,
      category: 'streak'
    },
    {
      id: 'streak_180',
      name: '180 Day Streak',
      description: 'Win 180 games in a row',
      emoji: '🌟',
      unlocked: gameHistory.maxStreak >= 180,
      category: 'streak'
    },
    {
      id: 'streak_365',
      name: '365 Day Streak',
      description: 'Win 365 games in a row',
      emoji: '💫',
      unlocked: gameHistory.maxStreak >= 365,
      category: 'streak'
    },

    // Total Wins Trophies
    {
      id: 'wins_1',
      name: 'First Victory',
      description: 'Win 1 game',
      emoji: '🎯',
      unlocked: gameHistory.wins >= 1,
      category: 'total_wins'
    },
    {
      id: 'wins_3',
      name: 'Getting Started',
      description: 'Win 3 games',
      emoji: '🏅',
      unlocked: gameHistory.wins >= 3,
      category: 'total_wins'
    },
    {
      id: 'wins_5',
      name: 'On a Roll',
      description: 'Win 5 games',
      emoji: '🥉',
      unlocked: gameHistory.wins >= 5,
      category: 'total_wins'
    },
    {
      id: 'wins_10',
      name: 'Dedicated Player',
      description: 'Win 10 games',
      emoji: '🥈',
      unlocked: gameHistory.wins >= 10,
      category: 'total_wins'
    },
    {
      id: 'wins_25',
      name: 'Expert Solver',
      description: 'Win 25 games',
      emoji: '🥇',
      unlocked: gameHistory.wins >= 25,
      category: 'total_wins'
    },
    {
      id: 'wins_50',
      name: 'Master Detective',
      description: 'Win 50 games',
      emoji: '💎',
      unlocked: gameHistory.wins >= 50,
      category: 'total_wins'
    },
    {
      id: 'wins_100',
      name: 'Legendary Player',
      description: 'Win 100 games',
      emoji: '👑',
      unlocked: gameHistory.wins >= 100,
      category: 'total_wins'
    },
    {
      id: 'wins_250',
      name: 'Wizarding Worldle Master',
      description: 'Win 250 games',
      emoji: '🏆',
      unlocked: gameHistory.wins >= 250,
      category: 'total_wins'
    },

    // Misc Trophies
    {
      id: 'perfect_game',
      name: 'Perfect Game',
      description: 'Win game in first guess',
      emoji: '🎯',
      unlocked: gameHistory.games.some(game => game.won && game.attempts === 1),
      category: 'misc'
    },
    {
      id: 'the_trio',
      name: 'The Trio',
      description: 'Correctly guess the trio',
      emoji: '👥',
      unlocked: checkTrio(),
      category: 'misc'
    },
    {
      id: 'the_weasley_family',
      name: 'The Weasley Family',
      description: 'Correctly guess all the Weasley family',
      emoji: '🧡',
      unlocked: checkWeasleyFamily(),
      category: 'misc'
    },
    {
      id: 'the_weasley_twins',
      name: 'The Weasley Twins',
      description: 'Correctly guess the Weasley twins',
      emoji: '👯',
      unlocked: checkWeasleyTwins(),
      category: 'misc'
    },
    {
      id: 'the_marauders',
      name: 'The Marauders',
      description: 'Correctly guess all 4 marauders',
      emoji: '🦌',
      unlocked: checkMarauders(),
      category: 'misc'
    },
    {
      id: 'the_malfoy_family',
      name: 'The Malfoy Family',
      description: 'Correctly guess all 3 Malfoy family members',
      emoji: '🐍',
      unlocked: checkMalfoyFamily(),
      category: 'misc'
    },
    {
      id: 'last_chance',
      name: 'Last Chance',
      description: 'Win 3 games on your final guess',
      emoji: '🎲',
      unlocked: checkLastChanceWins(),
      category: 'misc'
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

export interface NextTrophyProgress {
  trophy: Trophy | null
  current: number
  required: number
  progress: string // e.g., "1/3"
}

export const getNextTrophyProgress = (
  gameHistory: GameHistory,
  category: 'streak' | 'total_wins'
): NextTrophyProgress => {
  const trophies = calculateTrophies(gameHistory)
  const categoryTrophies = trophies.filter(t => t.category === category)
  
  // Find the first locked trophy in this category
  const nextTrophy = categoryTrophies.find(t => !t.unlocked)
  
  if (!nextTrophy) {
    // All trophies in this category are unlocked
    return {
      trophy: null,
      current: 0,
      required: 0,
      progress: 'Complete'
    }
  }
  
  // Extract the number from the trophy ID
  const extractNumber = (id: string): number => {
    const match = id.match(/\d+/)
    return match ? parseInt(match[0], 10) : 0
  }
  
  const required = extractNumber(nextTrophy.id)
  let current = 0
  
  if (category === 'streak') {
    current = gameHistory.maxStreak
  } else if (category === 'total_wins') {
    current = gameHistory.wins
  }
  
  return {
    trophy: nextTrophy,
    current,
    required,
    progress: `${current}/${required}`
  }
}

export const getMiscTrophyProgress = (
  gameHistory: GameHistory,
  trophyId: string
): { current: number; required: number; progress: string } | null => {
  const wonGames = gameHistory.games.filter(game => game.won)
  const characterNames = new Set(wonGames.map(game => game.mysteryCharacter.name))
  
  switch (trophyId) {
    case 'perfect_game': {
      const perfectGames = gameHistory.games.filter(game => game.won && game.attempts === 1)
      return {
        current: perfectGames.length,
        required: 1,
        progress: `${perfectGames.length}/1`
      }
    }
    
    case 'the_trio': {
      const trio = ['Harry Potter', 'Hermione Granger', 'Ron Weasley']
      const found = trio.filter(name => characterNames.has(name))
      return {
        current: found.length,
        required: 3,
        progress: `${found.length}/3`
      }
    }
    
    case 'the_weasley_family': {
      const weasleyNames = ['Arthur Weasley', 'Molly Weasley', 'Bill Weasley', 'Charlie Weasley', 
                           'Percy Weasley', 'Fred Weasley', 'George Weasley', 'Ron Weasley', 'Ginny Weasley']
      const found = weasleyNames.filter(name => characterNames.has(name))
      return {
        current: found.length,
        required: 9,
        progress: `${found.length}/9`
      }
    }
    
    case 'the_weasley_twins': {
      const twins = ['Fred Weasley', 'George Weasley']
      const found = twins.filter(name => characterNames.has(name))
      return {
        current: found.length,
        required: 2,
        progress: `${found.length}/2`
      }
    }
    
    case 'the_marauders': {
      const marauders = ['James Potter', 'Sirius Black', 'Remus Lupin', 'Peter Pettigrew']
      const found = marauders.filter(name => characterNames.has(name))
      return {
        current: found.length,
        required: 4,
        progress: `${found.length}/4`
      }
    }
    
    case 'the_malfoy_family': {
      const malfoys = ['Lucius Malfoy', 'Narcissa Malfoy', 'Draco Malfoy']
      const found = malfoys.filter(name => characterNames.has(name))
      return {
        current: found.length,
        required: 3,
        progress: `${found.length}/3`
      }
    }
    
    case 'last_chance': {
      const lastChanceWins = gameHistory.games.filter(game => game.won && game.attempts === 6)
      return {
        current: lastChanceWins.length,
        required: 3,
        progress: `${lastChanceWins.length}/3`
      }
    }
    
    default:
      return null
  }
}

export interface TrophyCharacter {
  name: string
  guessed: boolean
}

export const getTrophyCharacters = (
  gameHistory: GameHistory,
  trophyId: string
): TrophyCharacter[] | null => {
  const wonGames = gameHistory.games.filter(game => game.won)
  const characterNames = new Set(wonGames.map(game => game.mysteryCharacter.name))
  
  let characterList: string[] = []
  
  switch (trophyId) {
    case 'the_trio':
      characterList = ['Harry Potter', 'Hermione Granger', 'Ron Weasley']
      break
    case 'the_weasley_family':
      characterList = ['Arthur Weasley', 'Molly Weasley', 'Bill Weasley', 'Charlie Weasley', 
                       'Percy Weasley', 'Fred Weasley', 'George Weasley', 'Ron Weasley', 'Ginny Weasley']
      break
    case 'the_weasley_twins':
      characterList = ['Fred Weasley', 'George Weasley']
      break
    case 'the_marauders':
      characterList = ['James Potter', 'Sirius Black', 'Remus Lupin', 'Peter Pettigrew']
      break
    case 'the_malfoy_family':
      characterList = ['Lucius Malfoy', 'Narcissa Malfoy', 'Draco Malfoy']
      break
    default:
      return null
  }
  
  return characterList.map(name => ({
    name,
    guessed: characterNames.has(name)
  }))
}
