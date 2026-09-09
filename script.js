class PenaltyGame {
    constructor() {
        this.score = 0;
        this.attempts = 0;
        this.maxAttempts = 5;
        this.gridRows = 3;
        this.gridCols = 5;
        this.gameOver = false;
        this.predictionVisible = false;
        this.predictedBlocks = [];
        this.predictionAccuracy = 75; // 75% accuracy for predictions
        
        this.init();
    }

    init() {
        this.createGrid();
        this.generatePrediction();
        this.addEventListeners();
        this.updateDisplay();
    }

    createGrid() {
        const goalGrid = document.getElementById('goalGrid');
        goalGrid.innerHTML = '';
        
        for (let i = 0; i < this.gridRows; i++) {
            for (let j = 0; j < this.gridCols; j++) {
                const cell = document.createElement('div');
                cell.className = 'goal-cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.dataset.index = i * this.gridCols + j;
                goalGrid.appendChild(cell);
            }
        }
    }

    generatePrediction() {
        // Calculate which cells the goalkeeper will block based on probability
        this.predictedBlocks = [];
        const totalCells = this.gridRows * this.gridCols;
        const blockPercentage = 0.4; // Goalkeeper can block 40% of the goal
        const cellsToBlock = Math.ceil(totalCells * blockPercentage);

        // Use probability distribution - corners are safer, center is more dangerous
        const blockedIndices = new Set();
        
        // Add center and nearby cells with higher probability
        const centerIndices = [5, 6, 7, 10, 11, 12]; // Center area of 3x5 grid
        for (let i = 0; i < cellsToBlock; i++) {
            let index;
            if (Math.random() < 0.7 && blockedIndices.size < cellsToBlock) {
                // 70% chance to block center area
                index = centerIndices[Math.floor(Math.random() * centerIndices.length)];
            } else {
                // 30% chance to block any area
                index = Math.floor(Math.random() * totalCells);
            }
            blockedIndices.add(index);
        }
        
        this.predictedBlocks = Array.from(blockedIndices);
    }

    displayPrediction() {
        const cells = document.querySelectorAll('.goal-cell');
        cells.forEach((cell, index) => {
            cell.classList.remove('safe', 'danger', 'prediction-active');
            
            if (this.predictedBlocks.includes(index)) {
                cell.classList.add('danger', 'prediction-active');
                cell.textContent = '🚫';
            } else {
                cell.classList.add('safe', 'prediction-active');
                cell.textContent = '✓';
            }
        });
        
        this.predictionVisible = true;
        document.getElementById('showPredictionBtn').textContent = 'Hide Prediction';
    }

    hidePrediction() {
        const cells = document.querySelectorAll('.goal-cell');
        cells.forEach((cell) => {
            cell.classList.remove('safe', 'danger', 'prediction-active');
            cell.textContent = '';
        });
        
        this.predictionVisible = false;
        document.getElementById('showPredictionBtn').textContent = 'Show Prediction';
    }

    togglePrediction() {
        if (this.predictionVisible) {
            this.hidePrediction();
        } else {
            this.displayPrediction();
        }
    }

    addEventListeners() {
        const cells = document.querySelectorAll('.goal-cell');
        cells.forEach(cell => {
            cell.addEventListener('click', () => this.shootBall(cell));
        });

        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
        document.getElementById('showPredictionBtn').addEventListener('click', () => this.togglePrediction());
    }

    shootBall(cell) {
        if (this.gameOver || this.attempts >= this.maxAttempts) {
            return;
        }

        this.attempts++;
        const cellIndex = parseInt(cell.dataset.index);
        const isSafeZone = !this.predictedBlocks.includes(cellIndex);
        
        // If shooting in safe zone: 85% chance to score
        // If shooting in danger zone: 30% chance to score
        const successRate = isSafeZone ? 0.85 : 0.30;
        const scored = Math.random() < successRate;

        // Clear previous prediction visuals
        if (this.predictionVisible) {
            this.hidePrediction();
        }

        if (scored) {
            this.score++;
            cell.classList.add('scored');
            const shotType = isSafeZone ? 'Safe shot! 🏃' : 'Risky shot! 🔥';
            this.showResult(`⚽ GOAL! +1 ${shotType}`, 'success');
        } else {
            cell.classList.add('missed');
            const blockType = isSafeZone ? 'Keeper was lucky!' : 'Keeper blocked it!';
            this.showResult(`❌ MISS! ${blockType}`, 'failure');
        }

        this.updateDisplay();

        // Check if game is over
        if (this.attempts >= this.maxAttempts) {
            this.endGame();
        }

        // Disable clicking after shot
        this.disableCells();

        // Re-enable after animation
        setTimeout(() => {
            this.enableCells();
        }, 600);
    }

    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('attempts').textContent = this.attempts;
        document.getElementById('accuracy').textContent = this.predictionAccuracy;
    }

    showResult(message, className) {
        const resultsDiv = document.getElementById('results');
        resultsDiv.textContent = message;
        resultsDiv.className = `results ${className}`;
        
        setTimeout(() => {
            resultsDiv.textContent = '';
            resultsDiv.className = 'results';
        }, 2000);
    }

    endGame() {
        this.gameOver = true;
        const resultsDiv = document.getElementById('results');
        
        let message = `🎮 Game Over!\n`;
        message += `Final Score: ${this.score}/${this.maxAttempts}\n`;
        
        if (this.score === this.maxAttempts) {
            message += '🏆 Perfect! All goals scored!';
        } else if (this.score >= 3) {
            message += '🥇 Excellent job!';
        } else if (this.score >= 2) {
            message += '🥈 Good effort!';
        } else {
            message += '🥉 Better luck next time!';
        }
        
        resultsDiv.innerHTML = message.replace(/\n/g, '<br>');
        resultsDiv.className = 'results gameover';
        
        this.disableCells();
    }

    disableCells() {
        const cells = document.querySelectorAll('.goal-cell');
        cells.forEach(cell => {
            cell.style.pointerEvents = 'none';
            cell.style.opacity = '0.7';
        });
    }

    enableCells() {
        if (!this.gameOver) {
            const cells = document.querySelectorAll('.goal-cell');
            cells.forEach(cell => {
                cell.style.pointerEvents = 'auto';
                cell.style.opacity = '1';
            });
        }
    }

    resetGame() {
        this.score = 0;
        this.attempts = 0;
        this.gameOver = false;
        this.predictionVisible = false;
        
        document.getElementById('results').textContent = '';
        document.getElementById('results').className = 'results';
        document.getElementById('showPredictionBtn').textContent = 'Show Prediction';
        
        this.generatePrediction();
        this.createGrid();
        this.addEventListeners();
        this.updateDisplay();
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new PenaltyGame();
});