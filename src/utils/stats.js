/**
 * Stats Utilities
 * Helper functions for stat management during gameplay
 */

const StatsUtil = {
    /**
     * Set a stat to a specific value
     */
    set(name, value) {
        gameState.setStat(name, value);
        gameUI.updateStat(name, value);
        return value;
    },

    /**
     * Get a stat value
     */
    get(name) {
        return gameState.getStat(name);
    },

    /**
     * Increment a stat by amount
     */
    add(name, amount = 1) {
        const newValue = gameState.incrementStat(name, amount);
        gameUI.updateStat(name, newValue);
        return newValue;
    },

    /**
     * Decrement a stat by amount
     */
    subtract(name, amount = 1) {
        const newValue = gameState.decrementStat(name, amount);
        gameUI.updateStat(name, newValue);
        return newValue;
    },

    /**
     * Increment by 1 (shorthand for add)
     */
    increment(name) {
        return this.add(name, 1);
    },

    /**
     * Decrement by 1 (shorthand for subtract)
     */
    decrement(name) {
        return this.subtract(name, 1);
    },

    /**
     * Initialize multiple stats at once
     */
    initialize(statsObject) {
        gameState.initializeStats(statsObject);
        gameUI.displayStats(gameState.getState().stats);
    },

    /**
     * Check if stat meets a condition
     */
    checkCondition(name, operator, value) {
        const statValue = gameState.getStat(name);
        switch (operator) {
            case '>': return statValue > value;
            case '<': return statValue < value;
            case '>=': return statValue >= value;
            case '<=': return statValue <= value;
            case '===': return statValue === value;
            case '!==': return statValue !== value;
            default: return false;
        }
    },

    /**
     * Clamp stat between min and max
     */
    clamp(name, min, max) {
        const current = gameState.getStat(name);
        const clamped = Math.max(min, Math.min(max, current));
        gameState.setStat(name, clamped);
        gameUI.updateStat(name, clamped);
        return clamped;
    },

    /**
     * Get all stats as object
     */
    getAll() {
        return gameState.getState().stats;
    },

    /**
     * Get multiple stats by name
     */
    getMultiple(names) {
        const result = {};
        names.forEach(name => {
            result[name] = gameState.getStat(name);
        });
        return result;
    },

    /**
     * Set multiple stats at once
     */
    setMultiple(statsObject) {
        for (const [name, value] of Object.entries(statsObject)) {
            gameState.setStat(name, value);
        }
        gameUI.displayStats(gameState.getState().stats);
    },

    /**
     * Apply stat modifications with effects
     */
    modify(name, changes) {
        // changes can be: +5, -3, *2, /2
        const current = gameState.getStat(name);
        let newValue = current;

        if (typeof changes === 'number') {
            newValue = current + changes;
        } else if (typeof changes === 'string') {
            if (changes.startsWith('+')) {
                newValue = current + parseInt(changes);
            } else if (changes.startsWith('-')) {
                newValue = current + parseInt(changes);
            } else if (changes.startsWith('*')) {
                newValue = current * parseInt(changes.substring(1));
            } else if (changes.startsWith('/')) {
                newValue = current / parseInt(changes.substring(1));
            }
        }

        newValue = Math.floor(newValue);
        gameState.setStat(name, newValue);
        gameUI.updateStat(name, newValue);
        return newValue;
    },

    /**
     * Display stat change notification
     */
    notify(name, change, icon = '') {
        const operator = change > 0 ? '+' : '';
        const color = change > 0 ? '#00ff00' : '#ff6b6b';
        gameUI.showNotification(`${icon} ${gameState.name || name}: ${operator}${change}`);
    }
};
