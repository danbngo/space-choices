/**
 * UI Rendering System
 * Handles all visual display and updates
 */

class GameUI {
    constructor() {
        this.textDisplay = document.getElementById('text-display');
        this.choicesContainer = document.getElementById('choices-container');
        this.statsPanel = document.getElementById('stats-panel');
        this.gameTitle = document.getElementById('game-title');
    }

    /**
     * Display main text/narrative
     */
    displayText(text) {
        if (this.textDisplay) {
            this.textDisplay.innerHTML = this.formatText(text);
        }
    }

    /**
     * Format text (simple markdown-like support)
     */
    formatText(text) {
        // Convert **bold** to <strong>
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Convert *italic* to <em>
        text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
        // Convert line breaks
        text = text.replace(/\n/g, '<br>');
        return text;
    }

    /**
     * Display choices
     */
    displayChoices(choices) {
        if (!this.choicesContainer) return;
        
        this.choicesContainer.innerHTML = '';
        
        choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.className = 'choice-button';
            button.innerHTML = choice.text;
            button.onclick = choice.callback;
            this.choicesContainer.appendChild(button);
        });
    }

    /**
     * Clear choices
     */
    clearChoices() {
        if (this.choicesContainer) {
            this.choicesContainer.innerHTML = '';
        }
    }

    /**
     * Display stats
     */
    displayStats(stats) {
        if (!this.statsPanel) return;
        
        this.statsPanel.innerHTML = '';
        
        for (const [name, value] of Object.entries(stats)) {
            const statDiv = document.createElement('div');
            statDiv.className = 'stat';
            statDiv.innerHTML = `
                <div class="stat-label">${this.formatStatName(name)}</div>
                <div class="stat-value">${value}</div>
            `;
            this.statsPanel.appendChild(statDiv);
        }
    }

    /**
     * Format stat name for display (e.g., 'fuel_level' -> 'Fuel Level')
     */
    formatStatName(name) {
        return name
            .replace(/_/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    /**
     * Update a single stat display
     */
    updateStat(name, value) {
        // Re-render all stats - could optimize later with direct element targeting
        const stats = gameState.getState().stats;
        this.displayStats(stats);
    }

    /**
     * Set page title
     */
    setTitle(title) {
        if (this.gameTitle) {
            this.gameTitle.textContent = title;
        }
    }

    /**
     * Clear everything
     */
    clear() {
        this.displayText('');
        this.clearChoices();
    }

    /**
     * Show notification/message
     */
    showNotification(message, duration = 3000) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #001100;
            color: #00ff00;
            padding: 15px 20px;
            border: 2px solid #00ff00;
            box-shadow: 0 0 20px rgba(0, 255, 0, 0.8);
            font-weight: bold;
            font-family: 'Courier New', monospace;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }

    /**
     * Enable/disable all choice buttons
     */
    setChoicesEnabled(enabled) {
        const buttons = this.choicesContainer?.querySelectorAll('.choice-button');
        if (buttons) {
            buttons.forEach(btn => {
                btn.disabled = !enabled;
                btn.style.opacity = enabled ? '1' : '0.5';
                btn.style.cursor = enabled ? 'pointer' : 'not-allowed';
            });
        }
    }

    /**
     * Fade out current content and fade in new
     */
    fadeTransition(callback) {
        if (this.textDisplay) {
            this.textDisplay.style.opacity = '0.5';
        }
        if (this.choicesContainer) {
            this.choicesContainer.style.opacity = '0.5';
        }

        setTimeout(() => {
            callback();
            if (this.textDisplay) {
                this.textDisplay.style.opacity = '1';
            }
            if (this.choicesContainer) {
                this.choicesContainer.style.opacity = '1';
            }
        }, 150);
    }
}

// Global UI instance
const gameUI = new GameUI();

// Add slideIn/slideOut animations to stylesheet
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);
