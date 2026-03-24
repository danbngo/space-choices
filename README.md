# Space Choices - Game Engine

A vanilla JavaScript choice-based RPG game engine inspired by Twine. Perfect for creating space exploration games, text adventures, and narrative-driven experiences.

## Features

- ✨ **No Dependencies** - Pure vanilla JavaScript, no build tools required
- 🎮 **Scene-Based System** - Define game scenes with text, stats, and choices
- 💾 **Save/Load System** - localStorage-based game saves
- 📊 **Stat Management** - Track and modify game variables
- 🎯 **Choice System** - Conditional, stat-affecting, and random choices
- 🎨 **Twine-Like UI** - Beautiful, ethereal space-themed interface
- 📱 **Responsive Design** - Works on desktop and mobile

## Project Structure

```
space choices/
├── index.html                 # Main entry point
├── src/
│   ├── styles.css            # Game styling
│   ├── game.js               # Your game definition
│   ├── core/
│   │   ├── engine.js         # Main game engine
│   │   ├── state.js          # State management & save system
│   │   └── ui.js             # UI rendering system
│   └── utils/
│       ├── stats.js          # Stat utilities
│       └── choices.js        # Choice utilities
└── README.md                 # This file
```

## Quick Start

1. Open `index.html` in your browser
2. The example game will start automatically
3. Modify `src/game.js` to create your own game

## Core API

### Game Engine (`game`)

```javascript
// Start game from a scene
game.start('startScene');

// Load a scene
game.loadScene('sceneName');

// Save/Load games
game.save('slotName');
game.load('slotName');

// Get current state
game.getCurrentScene();
game.getStats();
game.getStat('health');
```

### State Management (`gameState`)

```javascript
// Stat management
gameState.setStat('health', 100);
gameState.getStat('health');
gameState.incrementStat('fuel', 20);
gameState.decrementStat('fuel', 5);

// Game phase
gameState.setPhase('combat');
gameState.getPhase();

// History tracking
gameState.addToHistory({scene: 'start', choice: 'Attack'});
gameState.getHistory();

// Save system
gameState.saveGame('myslot');
gameState.loadGame('myslot');
gameState.listSaves();
gameState.deleteSave('myslot');
```

### UI System (`gameUI`)

```javascript
// Display content
gameUI.displayText('Your story here...');
gameUI.displayChoices(choicesArray);
gameUI.displayStats(statsObject);

// Updates
gameUI.updateStat('health', newValue);
gameUI.setTitle('New Title');

// Utilities
gameUI.showNotification('Something happened!');
gameUI.setChoicesEnabled(false);
gameUI.clear();
```

### Stats Utilities (`StatsUtil`)

```javascript
// Basic operations
StatsUtil.set('health', 100);
StatsUtil.get('health');
StatsUtil.add('fuel', 20);
StatsUtil.subtract('fuel', 10);
StatsUtil.increment('credits');
StatsUtil.decrement('reputation');

// Initialization
StatsUtil.initialize({
    health: 100,
    fuel: 50,
    credits: 1000
});

// Conditions
if (StatsUtil.checkCondition('health', '>', 50)) {
    // Do something
}

// Utilities
StatsUtil.clamp('health', 0, 100);
StatsUtil.getAll();
StatsUtil.setMultiple({health: 100, fuel: 100});
StatsUtil.modify('health', -20); // Can use: +5, -3, *2, /2
```

### Choices Utilities (`ChoicesUtil`)

```javascript
// Simple choice
ChoicesUtil.make(text, nextScene, onSelectCallback);

// With stat changes
ChoicesUtil.withStats(text, {health: -10, fuel: -5}, nextScene);

// Conditional (appears only if condition true)
ChoicesUtil.conditional(text, () => condition, nextScene, onSelect);

// Require stat value
ChoicesUtil.requireStat(text, 'reputation', '>=', 50, nextScene);

// Random outcomes
ChoicesUtil.random(text, [
    {chance: 0.5, onSelect: () => {...}, text: 'Success!'},
    {chance: 0.5, onSelect: () => {...}, text: 'Failed!'}
], nextScene);

// Generate multiple choices
ChoicesUtil.generate(
    (item) => ({text: item.name, next: item.target}),
    itemsArray
);

// Filter out unavailable choices
const available = ChoicesUtil.filter(choicesArray);

// Chain multiple actions
ChoicesUtil.chain(choice, action1, action2, action3);
```

## Creating a Scene

A scene is an object with text, choices, and optional setup:

```javascript
const myScene = {
    // Text to display (string or function)
    text: 'This is the narrative text...',
    // Or:
    text: () => `Dynamic text with ${variable}`,
    
    // Choices array or function returning array
    choices: [
        ChoicesUtil.make('Choice 1 text', 'nextScene'),
        ChoicesUtil.make('Choice 2 text', 'otherScene')
    ],
    // Or:
    choices: () => {
        if (someCondition) {
            return [/*...*/];
        }
        return [/*...*/];
    },
    
    // Optional: Setup code run when scene loads
    setup: () => {
        // Trigger some effects
        StatsUtil.add('morale', -10);
    },
    
    // Optional: Game phase
    phase: 'combat'
};

// Register the scene
game.registerScene('mySceneName', myScene);

// Or register multiple at once
game.registerScenes({
    scene1: sceneDefinition1,
    scene2: sceneDefinition2
});
```

## Text Formatting

The UI supports simple formatting:

```javascript
const text = `
You encounter a **bold statement**.
You feel *some emotion*.
This is\n a newline.
`;
```

- `**text**` → bold
- `*text*` → italic
- `\n` → newline

## Save System

Games are automatically saved to localStorage. Direct access:

```javascript
// List all saves
const saves = gameState.listSaves();

// Get specific save
const save = gameState.getSave('myslot');

// Export/Import
const json = gameState.exportState();
gameState.importState(json);

// Clear saves
gameState.clearAllSaves();
```

## Tips

### Conditional Choices
Use `ChoicesUtil.filter()` to show/hide choices based on stats:

```javascript
choices: () => {
    const options = [
        ChoicesUtil.make('Always available', 'next1'),
        ChoicesUtil.requireStat('Need 50 reputation', 'reputation', '>=', 50, 'next2')
    ];
    return ChoicesUtil.filter(options);
}
```

### Dynamic Text
Use functions for text that changes based on game state:

```javascript
text: () => {
    const health = StatsUtil.get('health');
    return health < 30 
        ? 'You feel weak and injured...'
        : 'You feel strong and ready.';
}
```

### Choice Consequences
Combine choice stats changes with notifications:

```javascript
{
    text: 'Risk it all in combat',
    onSelect: () => {
        StatsUtil.add('health', -30);
        gameUI.showNotification('You took heavy damage!');
    },
    next: 'combatResult'
}
```

## Example Game Loop

```javascript
// 1. Initialize stats
StatsUtil.initialize({health: 100, fuel: 100});

// 2. Register scenes
game.registerScenes({
    start: scene1,
    combat: scene2,
    escape: scene3
});

// 3. Start the game
game.start('start');

// 4. User clicks a choice
// - onSelect callbacks execute
// - Stats update
// - Next scene loads automatically
```

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## License

Free to use and modify!

---

Built with vanilla JavaScript - no dependencies, just imagination! Happy storytelling! 🚀
