# 🪄 Wizarding Worldle

A Harry Potter-themed Wordle-style game where you guess characters from the wizarding world! Built with React, TypeScript, and Vite.

## 🎮 How to Play

Guess the Harry Potter character in 7 tries! Each guess reveals clues about the mystery character:

- **Hogwarts House** - Which house they belong to
- **Blood Status** - Pure-blood, Half-blood, or Muggle-born
- **Species** - Human, Giant, House-elf, etc.
- **First Appearance** - Which book/movie they first appeared in
- **Occupation** - Their job or role in the wizarding world

## 🏆 Features

- **Daily Challenge** - New character every day
- **Smart Suggestions** - Autocomplete with character names
- **Trophy System** - Unlock achievements as you play
- **Statistics Tracking** - Track your win streak and accuracy
- **Dark Mode** - Toggle between light and dark themes
- **Responsive Design** - Works on desktop and mobile

## 🚀 Live Demo

Play the game at: [https://jasperraine.github.io/wizarding-worldle/](https://jasperraine.github.io/wizarding-worldle/)

## 🛠️ Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/JasperRaine/wizarding-worldle.git
cd wizarding-worldle

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Deployment

This project is automatically deployed to GitHub Pages using GitHub Actions. Every push to the `main` branch triggers a new deployment.

### Manual Deployment

If you need to deploy manually:

```bash
# Build the project
npm run build

# The dist/ folder contains the built files
# Upload the contents of dist/ to your hosting provider
```

## 🎯 Game Mechanics

- **Green** = Correct match
- **Yellow** = Partial match (for species like "Human/Giant")
- **Gray** = Incorrect

## 🏆 Trophy Categories

- **Streak Trophies** - Win multiple games in a row
- **Accuracy Trophies** - Win games in fewer guesses
- **Variety Trophies** - Win with characters from different houses/species
- **Special Trophies** - Play many games and show dedication

## 🛠️ Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **CSS Modules** - Scoped styling
- **Lucide React** - Icon library
- **GitHub Actions** - CI/CD

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
