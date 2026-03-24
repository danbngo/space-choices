/**
 * Choices Utilities
 * Helper functions for creating and managing choices
 */

const ChoicesUtil = {
    /**
     * Create a simple choice
     */
    make(text, nextScene, onSelect = null) {
        return {
            text,
            next: nextScene,
            onSelect
        };
    },

    /**
     * Create a choice with a condition (only appears if condition is true)
     */
    conditional(text, condition, nextScene, onSelect = null) {
        return {
            text,
            condition,
            next: nextScene,
            onSelect,
            isAvailable: () => condition()
        };
    },

    /**
     * Create a choice that modifies stats then goes to next scene
     */
    withStats(text, statChanges, nextScene) {
        return {
            text,
            next: nextScene,
            onSelect: () => {
                for (const [statName, change] of Object.entries(statChanges)) {
                    StatsUtil.add(statName, change);
                }
            }
        };
    },

    /**
     * Create a choice with a stat check (only available if condition passes)
     */
    requireStat(text, statName, operator, value, nextScene, onSelect = null) {
        return {
            text: `${text} (${gameState.getStat(statName)} ${operator} ${value})`,
            condition: () => StatsUtil.checkCondition(statName, operator, value),
            next: nextScene,
            onSelect
        };
    },

    /**
     * Filter choices - remove those with conditions that aren't met
     */
    filter(choices) {
        return choices.filter(choice => {
            if (choice.condition && !choice.condition()) {
                return false;
            }
            if (choice.isAvailable && !choice.isAvailable()) {
                return false;
            }
            return true;
        });
    },

    /**
     * Create styled text for a choice
     */
    styled(text, style = {}) {
        return text; // Could be extended for more complex styling
    },

    /**
     * Group related choices
     */
    group(groupName, choices) {
        return {
            group: groupName,
            choices
        };
    },

    /**
     * Create a choice that opens a branching dialog
     */
    branch(text, branches, finalNext) {
        // branches = [ {text: "...", onSelect: ..., next: "..."}, ... ]
        return {
            text,
            next: finalNext,
            children: branches
        };
    },

    /**
     * Add consequence text to a choice
     */
    withConsequence(choice, consequenceText) {
        const originalOnSelect = choice.onSelect;
        choice.onSelect = () => {
            if (originalOnSelect) {
                originalOnSelect();
            }
            gameUI.showNotification(consequenceText);
        };
        return choice;
    },

    /**
     * Create a random outcome choice
     */
    random(text, outcomes, nextScene) {
        // outcomes = [ {chance: 0.5, onSelect: ..., text: "..."}, ... ]
        return {
            text,
            next: nextScene,
            onSelect: () => {
                const random = Math.random();
                let cumulative = 0;
                
                for (const outcome of outcomes) {
                    cumulative += outcome.chance;
                    if (random <= cumulative) {
                        if (outcome.onSelect) outcome.onSelect();
                        if (outcome.text) gameUI.showNotification(outcome.text);
                        return;
                    }
                }
            }
        };
    },

    /**
     * Create multiple similar choices from a template
     */
    generate(template, items) {
        // template = (item) => ({text: item.name, next: item.next, ...})
        return items.map(item => template(item));
    },

    /**
     * Chain multiple onSelect actions
     */
    chain(choice, ...callbacks) {
        const originalOnSelect = choice.onSelect;
        choice.onSelect = () => {
            if (originalOnSelect) originalOnSelect();
            callbacks.forEach(cb => cb());
        };
        return choice;
    }
};
