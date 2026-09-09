# ⚽ 1Win Penalty Game

A fun, interactive penalty kick game built with HTML, CSS, and JavaScript. Try to score as many goals as possible in 5 attempts!

## 🎮 Game Features

- **3x5 Goal Grid**: A goal divided into 15 cells arranged in 3 rows and 5 columns
- **5 Attempts**: You get 5 penalty kicks to score goals
- **60% Success Rate**: Each shot has a 60% chance to score (can be adjusted)
- **Score Tracking**: Real-time score and attempt counter
- **Visual Feedback**: 
  - Green cells for successful goals
  - Red cells for missed shots
  - Smooth animations and transitions
- **Responsive Design**: Works on desktop and mobile devices
- **Game Summary**: See your final score and performance rating

## 🚀 How to Play

1. Open `index.html` in your web browser
2. Click on any square in the goal grid to take a penalty kick
3. The game will randomly determine if your shot is a goal or a miss
4. Try to score as many goals as possible in 5 attempts
5. Click "New Game" to reset and play again

## 📊 Scoring

- **5/5 Goals**: 🏆 Perfect! All goals scored!
- **3-4 Goals**: 🥇 Excellent job!
- **2 Goals**: 🥈 Good effort!
- **0-1 Goals**: 🥉 Better luck next time!

## 📁 File Structure

```
1win-penalty-game/
├── index.html      # Main game HTML
├── style.css       # Game styling and animations
├── script.js       # Game logic and mechanics
└── README.md       # Documentation (this file)
```

## 🛠️ Technical Details

### HTML (`index.html`)
- Game container with score and attempts display
- 3x5 goal grid layout
- Ball animation element
- Game controls and results display

### CSS (`style.css`)
- Blue gradient background with penalty goal theme
- Grid-based goal layout (3 rows × 5 columns)
- Hover effects and animations
- Responsive design for mobile devices
- Color feedback (green for goals, red for misses)

### JavaScript (`script.js`)
- `PenaltyGame` class manages all game logic
- Event listeners for cell clicks
- Random goal/miss determination (60% success rate)
- Score and attempt tracking
- Game state management
- Reset functionality

## 🎯 Game Mechanics

1. Each cell click represents a penalty kick
2. The game randomly determines success (60% chance)
3. Successful shots turn green and add to score
4. Missed shots turn red
5. After 5 attempts, game ends with final score display
6. Click "New Game" to play again

## ⚙️ Customization

You can easily customize the game by modifying values in `script.js`:

```javascript
this.gridRows = 3;        // Number of rows
this.gridCols = 5;        // Number of columns
this.maxAttempts = 5;     // Number of attempts
```

Change the success rate in the `isGoal()` method:
```javascript
return Math.random() < 0.6;  // 0.6 = 60% success rate
```

## 🌐 Play Online

You can play this game online using GitHub Pages by visiting:
[https://vicboy123.github.io/1win-penalty-game/](https://vicboy123.github.io/1win-penalty-game/)

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to fork this repository and submit pull requests with improvements!

---

Enjoy the game! ⚽🎮
