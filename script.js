class PenaltyGame {
    constructor() {
        this.score = 0;
        this.attempts = 0;
        this.maxAttempts = 5;
        this.gridRows = 3;
        this.gridCols = 5;
        this.gameOver = false;
        
        this.init();
    }

    init() {
        this.createGrid();
        this.addEventListeners();
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

    addEventListeners() {
        const cells = document.querySelectorAll('.goal-cell');
        cells.forEach(cell => {
            cell.addEventListener('click', () => this.shootBall(cell));
        });

        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
    }

    shootBall(cell) {
        if (this.gameOver || this.attempts >= this.maxAttempts) {
            return;
        }

        this.attempts++;
        const scored = this.isGoal();

        if (scored) {
            this.score++;
            cell.classList.add('scored');
            this.showResult('⚽ GOAL! +1', 'success');
        } else {
            cell.classList.add('missed');
            this.showResult('❌ MISS!', 'failure');
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

    isGoal() {
        // 60% chance to score (can be adjusted)
        return Math.random() < 0.6;
    }

    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('attempts').textContent = this.attempts;
    }

    showResult(message, className) {
        const resultsDiv = document.getElementById('results');
        resultsDiv.textContent = message;
        resultsDiv.className = `results ${className}`;
        
        setTimeout(() => {
            resultsDiv.textContent = '';
            resultsDiv.className = 'results';
        }, 1500);
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
        
        document.getElementById('results').textContent = '';
        document.getElementById('results').className = 'results';
        
        this.createGrid();
        this.addEventListeners();
        this.updateDisplay();
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new PenaltyGame();
});
