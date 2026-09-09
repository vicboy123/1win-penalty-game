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
        this.predictionAccuracy = 78; // Dynamic accuracy
        this.shotHistory = [];
        
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
                
                // Add hover prediction
                cell.addEventListener('mouseenter', () => this.showCellPrediction(cell));
                cell.addEventListener('mouseleave', () => this.hideCellPrediction(cell));
                
                goalGrid.appendChild(cell);
            }
        }
    }

    generatePrediction() {
        // Generate new prediction for this round
        this.predictedBlocks = [];
        const totalCells = this.gridRows * this.gridCols;
        const blockPercentage = 0.4;
        const cellsToBlock = Math.ceil(totalCells * blockPercentage);

        const blockedIndices = new Set();
        
        // Center area is higher risk
        const centerIndices = [5, 6, 7, 10, 11, 12];
        for (let i = 0; i < cellsToBlock; i++) {
            let index;
            if (Math.random() < 0.7 && blockedIndices.size < cellsToBlock) {
                index = centerIndices[Math.floor(Math.random() * centerIndices.length)];
            } else {
                index = Math.floor(Math.random() * totalCells);
            }
            blockedIndices.add(index);
        }
        
        this.predictedBlocks = Array.from(blockedIndices);
    }

    showCellPrediction(cell) {
        const index = parseInt(cell.dataset.index);
        const isDanger = this.predictedBlocks.includes(index);
        const probability = isDanger ? '30%' : '85%';
        const status = isDanger ? '⚠️ DANGER' : '✅ SAFE';
        
        // Show live prediction info
        cell.classList.add(isDanger ? 'danger-preview' : 'safe-preview');
        cell.setAttribute('data-tooltip', `${status} - ${probability} success`);
    }

    hideCellPrediction(cell) {
        cell.classList.remove('danger-preview', 'safe-preview');
        cell.removeAttribute('data-tooltip');
    }

    displayFullPrediction() {
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
        document.getElementById('showPredictionBtn').textContent = 'Hide Full Prediction';
    }

    hidePrediction() {
        const cells = document.querySelectorAll('.goal-cell');
        cells.forEach((cell) => {
            cell.classList.remove('safe', 'danger', 'prediction-active');
            cell.textContent = '';
        });
        
        this.predictionVisible = false;
        document.getElementById('showPredictionBtn').textContent = 'Show Full Prediction';
    }

    togglePrediction() {
        if (this.predictionVisible) {
            this.hidePrediction();
        } else {
            this.displayFullPrediction();
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
        
        // Success rates based on zone
        const successRate = isSafeZone ? 0.85 : 0.30;
        const scored = Math.random() < successRate;

        // Record shot for accuracy tracking
        this.shotHistory.push({
            cellIndex,
            isSafeZone,
            scored,
            predictedCorrectly: (isSafeZone && scored) || (!isSafeZone && !scored)
        });

        // Update prediction accuracy
        this.updatePredictionAccuracy();

        // Clear previous prediction visuals
        if (this.predictionVisible) {
            this.hidePrediction();
        }

        if (scored) {
            this.score++;
            cell.classList.add('scored');
            const shotType = isSafeZone ? 'Safe shot! 🎯' : 'Risky shot! 🔥';
            this.showResult(`⚽ GOAL! +1 ${shotType}`, 'success');
        } else {
            cell.classList.add('missed');
            const blockType = isSafeZone ? 'Keeper was lucky!' : 'Keeper blocked it! 🧤';
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

    updatePredictionAccuracy() {
        if (this.shotHistory.length === 0) return;
        
        const correctPredictions = this.shotHistory.filter(shot => shot.predictedCorrectly).length;
        this.predictionAccuracy = Math.round((correctPredictions / this.shotHistory.length) * 100);
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
        message += `Prediction Accuracy: ${this.predictionAccuracy}%\n`;
        
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
        this.shotHistory = [];
        this.predictionAccuracy = 78;
        
        document.getElementById('results').textContent = '';
        document.getElementById('results').className = 'results';
        document.getElementById('showPredictionBtn').textContent = 'Show Full Prediction';
        
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
