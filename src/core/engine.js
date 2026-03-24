/**
 * Game Engine
 * Main orchestrator for scenes, choices, and game flow
 */

class GameEngine {
    constructor() {
        this.scenes = {};
        this.currentSceneData = null;
        this.isProcessing = false;
    }

    /**
     * Register a scene definition
     */
    registerScene(name, sceneDefinition) {
        this.scenes[name] = sceneDefinition;
    }

    /**
     * Register multiple scenes
     */
    registerScenes(scenesObject) {
        for (const [name, definition] of Object.entries(scenesObject)) {
            this.registerScene(name, definition);
        }
    }

    /**
     * Load and render a scene
     */
    loadScene(sceneName) {
        if (this.isProcessing) return;
        if (!this.scenes[sceneName]) {
            console.error(`Scene not found: ${sceneName}`);
            return;
        }

        this.isProcessing = true;
        gameState.setScene(sceneName);
        
        const sceneDefinition = this.scenes[sceneName];
        this.currentSceneData = sceneDefinition;

        // Call scene setup if it exists
        if (sceneDefinition.setup) {
            sceneDefinition.setup();
        }

        // Update phase if specified
        if (sceneDefinition.phase) {
            gameState.setPhase(sceneDefinition.phase);
        }

        // Render the scene
        gameUI.fadeTransition(() => {
            this.renderScene(sceneDefinition);
            this.isProcessing = false;
        });
    }

    /**
     * Render a scene to the UI
     */
    renderScene(sceneDefinition) {
        // Display text/narrative
        if (sceneDefinition.text) {
            const displayText = typeof sceneDefinition.text === 'function' 
                ? sceneDefinition.text() 
                : sceneDefinition.text;
            gameUI.displayText(displayText);
        }

        // Display stats
        const stats = gameState.getState().stats;
        gameUI.displayStats(stats);

        // Display choices
        if (sceneDefinition.choices) {
            const choices = typeof sceneDefinition.choices === 'function'
                ? sceneDefinition.choices()
                : sceneDefinition.choices;
            
            const formattedChoices = choices.map((choice, index) => ({
                text: choice.text,
                callback: () => this.handleChoice(choice, index)
            }));
            gameUI.displayChoices(formattedChoices);
        } else {
            gameUI.clearChoices();
        }
    }

    /**
     * Handle a choice selection
     */
    handleChoice(choice, index) {
        if (this.isProcessing) return;

        // Add to history
        gameState.addToHistory({
            scene: gameState.getScene(),
            choice: choice.text,
            choiceIndex: index
        });

        // Execute choice callback
        if (choice.onSelect) {
            choice.onSelect();
        }

        // Navigate to next scene
        if (choice.next) {
            this.loadScene(choice.next);
        }
    }

    /**
     * Start the game
     */
    start(startingScene = 'start') {
        gameState.reset();
        this.loadScene(startingScene);
    }

    /**
     * Get current scene name
     */
    getCurrentScene() {
        return gameState.getScene();
    }

    /**
     * Check if currently in a scene
     */
    isInScene(sceneName) {
        return gameState.getScene() === sceneName;
    }

    /**
     * Get scene definition
     */
    getScene(sceneName) {
        return this.scenes[sceneName] ?? null;
    }

    /**
     * Get game history
     */
    getHistory() {
        return gameState.getHistory();
    }

    /**
     * Save game
     */
    save(slotName = 'autosave') {
        const success = gameState.saveGame(slotName);
        if (success) {
            gameUI.showNotification(`Game saved to slot: ${slotName}`);
        }
        return success;
    }

    /**
     * Load game
     */
    load(slotName = 'autosave') {
        const success = gameState.loadGame(slotName);
        if (success) {
            this.loadScene(gameState.getScene());
            gameUI.showNotification(`Game loaded from slot: ${slotName}`);
        } else {
            gameUI.showNotification('No save found in this slot', 2000);
        }
        return success;
    }

    /**
     * Get current stats
     */
    getStats() {
        return gameState.getState().stats;
    }

    /**
     * Get a specific stat
     */
    getStat(name) {
        return gameState.getStat(name);
    }
}

// Global engine instance
const game = new GameEngine();
