/**
 * State Management System
 * Handles game state, save/load functionality, and history tracking
 */

class GameState {
    constructor() {
        this.state = {
            currentScene: 'start',
            stats: {},
            history: [],
            phase: 'default',
            metadata: {
                timestamp: Date.now(),
                version: '1.0'
            }
        };
        this.saveSlots = this.loadAllSaves();
    }

    /**
     * Get current state
     */
    getState() {
        return JSON.parse(JSON.stringify(this.state));
    }

    /**
     * Set entire state (use cautiously)
     */
    setState(newState) {
        this.state = newState;
    }

    /**
     * Set a specific stat value
     */
    setStat(name, value) {
        this.state.stats[name] = value;
    }

    /**
     * Get a stat value
     */
    getStat(name) {
        return this.state.stats[name] ?? 0;
    }

    /**
     * Increment a stat by amount
     */
    incrementStat(name, amount = 1) {
        this.state.stats[name] = (this.state.stats[name] ?? 0) + amount;
        return this.state.stats[name];
    }

    /**
     * Decrement a stat by amount
     */
    decrementStat(name, amount = 1) {
        this.state.stats[name] = (this.state.stats[name] ?? 0) - amount;
        return this.state.stats[name];
    }

    /**
     * Set current scene
     */
    setScene(sceneName) {
        this.state.currentScene = sceneName;
    }

    /**
     * Get current scene
     */
    getScene() {
        return this.state.currentScene;
    }

    /**
     * Set game phase
     */
    setPhase(phaseName) {
        this.state.phase = phaseName;
    }

    /**
     * Get current phase
     */
    getPhase() {
        return this.state.phase;
    }

    /**
     * Add to history (for tracking decisions)
     */
    addToHistory(entry) {
        this.state.history.push({
            timestamp: Date.now(),
            ...entry
        });
    }

    /**
     * Get history
     */
    getHistory() {
        return this.state.history;
    }

    /**
     * Initialize stats with defaults
     */
    initializeStats(statDefinitions) {
        for (const [name, value] of Object.entries(statDefinitions)) {
            if (!(name in this.state.stats)) {
                this.state.stats[name] = value;
            }
        }
    }

    /**
     * Save game to localStorage
     */
    saveGame(slotName = 'autosave') {
        const saveData = {
            name: slotName,
            state: this.state,
            timestamp: Date.now()
        };
        const saves = this.loadAllSaves();
        saves[slotName] = saveData;
        localStorage.setItem('gameState_saves', JSON.stringify(saves));
        this.saveSlots = saves;
        return true;
    }

    /**
     * Load game from localStorage
     */
    loadGame(slotName = 'autosave') {
        const saves = this.loadAllSaves();
        if (saves[slotName]) {
            this.state = saves[slotName].state;
            return true;
        }
        return false;
    }

    /**
     * Load all save slots
     */
    loadAllSaves() {
        const saves = localStorage.getItem('gameState_saves');
        return saves ? JSON.parse(saves) : {};
    }

    /**
     * Get specific save
     */
    getSave(slotName) {
        return this.saveSlots[slotName] ?? null;
    }

    /**
     * List all save names
     */
    listSaves() {
        return Object.keys(this.saveSlots);
    }

    /**
     * Delete save
     */
    deleteSave(slotName) {
        delete this.saveSlots[slotName];
        localStorage.setItem('gameState_saves', JSON.stringify(this.saveSlots));
        return true;
    }

    /**
     * Clear all saves
     */
    clearAllSaves() {
        this.saveSlots = {};
        localStorage.removeItem('gameState_saves');
        return true;
    }

    /**
     * Export game state as JSON
     */
    exportState() {
        return JSON.stringify(this.state, null, 2);
    }

    /**
     * Import game state from JSON
     */
    importState(jsonString) {
        try {
            this.state = JSON.parse(jsonString);
            return true;
        } catch (e) {
            console.error('Failed to import state:', e);
            return false;
        }
    }

    /**
     * Reset to initial state
     */
    reset() {
        this.state = {
            currentScene: 'start',
            stats: {},
            history: [],
            phase: 'default',
            metadata: {
                timestamp: Date.now(),
                version: '1.0'
            }
        };
    }
}

// Global game state instance
const gameState = new GameState();
