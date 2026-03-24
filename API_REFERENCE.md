# Vanilla Space RPG Engine - API Reference

## Global Objects

The engine exposes these global objects:
- `game` - Main game engine
- `gameState` - State management  
- `gameUI` - UI rendering
- `StatsUtil` - Stat utilities
- `ChoicesUtil` - Choice utilities

---

## game (GameEngine)

Main orchestrator for the game.

### Methods

#### `game.registerScene(name, definition)`
Register a single scene.

```javascript
game.registerScene('myScene', {
    text: 'Hello',
    choices: [ ChoicesUtil.make('Go', 'next') ]
});
```

#### `game.registerScenes(scenesObject)`
Register multiple scenes at once.

```javascript
game.registerScenes({
    scene1: definition1,
    scene2: definition2
});
```

#### `game.loadScene(sceneName)`
Load and render a scene. Calls setup() if defined.

```javascript
game.loadScene('forest');
```

#### `game.start(startingScene = 'start')`
Initialize game and load starting scene. Resets all state.

```javascript
game.start('intro');
```

#### `game.save(slotName = 'autosave')`
Save entire game state to localStorage.

```javascript
game.save('slot1');
game.save('checkpoint');
```

#### `game.load(slotName = 'autosave')`
Load game state from localStorage and restore it.

```javascript
game.load('slot1');
```

#### `game.getCurrentScene()`
Get name of current scene.

```javascript
const current = game.getCurrentScene(); // 'forest'
```

#### `game.isInScene(sceneName)`
Check if currently in a scene.

```javascript
if (game.isInScene('combat')) { /* ... */ }
```

#### `game.getScene(sceneName)`
Get scene definition object.

```javascript
const scene = game.getScene('forest');
```

#### `game.getStats()`
Get all stats object.

```javascript
const allStats = game.getStats();
// {health: 100, fuel: 50, ...}
```

#### `game.getStat(name)`
Get single stat value.

```javascript
const hp = game.getStat('health'); // 100
```

#### `game.getHistory()`
Get array of all player choices.

```javascript
const choices = game.getHistory();
// [{scene: 'start', choice: 'Go right', timestamp: 123...}, ...]
```

---

## gameState (GameState)

Low-level state management.

### State Structure

```javascript
{
    currentScene: 'start',
    stats: {health: 100, fuel: 50, ...},
    history: [{...}, ...],
    phase: 'default',
    metadata: {timestamp: ..., version: '1.0'}
}
```

### Methods

#### `gameState.getState()`
Get deep copy of entire state.

```javascript
const state = gameState.getState();
```

#### `gameState.setState(newState)`
Replace entire state (use cautiously).

```javascript
gameState.setState(savedState);
```

#### `gameState.setStat(name, value)`
Set stat to specific value.

```javascript
gameState.setStat('health', 100);
gameState.setStat('isAlive', true);
```

#### `gameState.getStat(name)`
Get stat value (returns 0 if not found).

```javascript
const fuel = gameState.getStat('fuel');
```

#### `gameState.incrementStat(name, amount = 1)`
Increase stat by amount, returns new value.

```javascript
gameState.incrementStat('level', 1);
gameState.incrementStat('gold', 50);
```

#### `gameState.decrementStat(name, amount = 1)`
Decrease stat by amount, returns new value.

```javascript
gameState.decrementStat('health', 20);
```

#### `gameState.setScene(sceneName)`
Set current scene (doesn't render).

```javascript
gameState.setScene('forest');
```

#### `gameState.getScene()`
Get current scene name.

```javascript
const current = gameState.getScene();
```

#### `gameState.setPhase(phaseName)`
Set game phase (for organization).

```javascript
gameState.setPhase('combat');
gameState.setPhase('exploration');
```

#### `gameState.getPhase()`
Get current phase.

```javascript
const phase = gameState.getPhase();
```

#### `gameState.addToHistory(entry)`
Record a decision.

```javascript
gameState.addToHistory({
    scene: 'forest',
    choice: 'Go left',
    timeSpent: 45000
});
```

#### `gameState.getHistory()`
Get all recorded decisions.

```javascript
const history = gameState.getHistory();
```

#### `gameState.initializeStats(statDefinitions)`
Set default values for stats (only fills undefined).

```javascript
gameState.initializeStats({
    health: 100,
    fuel: 50
});
```

#### `gameState.saveGame(slotName = 'autosave')`
Save to localStorage.

```javascript
gameState.saveGame('backup');
```

#### `gameState.loadGame(slotName = 'autosave')`
Load from localStorage, returns true/false.

```javascript
if (gameState.loadGame('backup')) {
    console.log('Loaded!');
}
```

#### `gameState.loadAllSaves()`
Get all save slots object.

```javascript
const saves = gameState.loadAllSaves();
// {autosave: {...}, slot1: {...}}
```

#### `gameState.getSave(slotName)`
Get specific save data.

```javascript
const save = gameState.getSave('slot1');
// {name: 'slot1', state: {...}, timestamp: ...}
```

#### `gameState.listSaves()`
Get array of save slot names.

```javascript
const names = gameState.listSaves();
// ['autosave', 'slot1', 'checkpoint']
```

#### `gameState.deleteSave(slotName)`
Delete a save slot.

```javascript
gameState.deleteSave('old_save');
```

#### `gameState.clearAllSaves()`
Delete all saves.

```javascript
gameState.clearAllSaves();
```

#### `gameState.exportState()`
Get JSON string of current state.

```javascript
const json = gameState.exportState();
```

#### `gameState.importState(jsonString)`
Load state from JSON string.

```javascript
gameState.importState(json);
```

#### `gameState.reset()`
Reset to initial state.

```javascript
gameState.reset();
```

---

## gameUI (GameUI)

Rendering and display control.

### Methods

#### `gameUI.displayText(text)`
Show narrative text.

```javascript
gameUI.displayText('You enter a dark forest...');
```

#### `gameUI.displayChoices(choices)`
Show choice buttons. Array of `{text, callback}`.

```javascript
gameUI.displayChoices([
    {text: 'Left', callback: () => game.loadScene('left')},
    {text: 'Right', callback: () => game.loadScene('right')}
]);
```

#### `gameUI.displayStats(statsObject)`
Render all stats panel.

```javascript
gameUI.displayStats({health: 100, fuel: 50});
```

#### `gameUI.clearChoices()`
Remove all choice buttons.

```javascript
gameUI.clearChoices();
```

#### `gameUI.updateStat(name, value)`
Update single stat display.

```javascript
gameUI.updateStat('health', 80);
```

#### `gameUI.setTitle(title)`
Change page title.

```javascript
gameUI.setTitle('Chapter 2: The Darkness');
```

#### `gameUI.clear()`
Clear all text and choices.

```javascript
gameUI.clear();
```

#### `gameUI.showNotification(message, duration = 3000)`
Show temporary notification popup.

```javascript
gameUI.showNotification('You gained 50 gold!');
gameUI.showNotification('Error!', 5000);
```

#### `gameUI.setChoicesEnabled(enabled)`
Enable/disable all choice buttons.

```javascript
gameUI.setChoicesEnabled(false); // Gray out
gameUI.setChoicesEnabled(true);  // Re-enable
```

#### `gameUI.fadeTransition(callback)`
Fade out, call callback, fade in.

```javascript
gameUI.fadeTransition(() => {
    // Change scene content here
    gameUI.displayText('New scene');
});
```

#### `gameUI.formatText(text)`
Apply markdown-like formatting. Used internally.

Supports:
- `**text**` → bold
- `*text*` → italic
- `\n` → newline

---

## StatsUtil

Stat management utilities.

### Methods

#### `StatsUtil.set(name, value)`
Set stat to value, update UI.

```javascript
StatsUtil.set('health', 100);
```

#### `StatsUtil.get(name)`
Get stat value.

```javascript
const hp = StatsUtil.get('health');
```

#### `StatsUtil.add(name, amount = 1)`
Increase stat, update UI.

```javascript
StatsUtil.add('gold', 50);
StatsUtil.add('level', 1);
```

#### `StatsUtil.subtract(name, amount = 1)`
Decrease stat, update UI.

```javascript
StatsUtil.subtract('health', 20);
```

#### `StatsUtil.increment(name)`
Shorthand for add(name, 1).

```javascript
StatsUtil.increment('level');
```

#### `StatsUtil.decrement(name)`
Shorthand for subtract(name, 1).

```javascript
StatsUtil.decrement('ammo');
```

#### `StatsUtil.initialize(statsObject)`
Set default stats (only fills undefined), update UI.

```javascript
StatsUtil.initialize({
    health: 100,
    mana: 50,
    level: 1
});
```

#### `StatsUtil.checkCondition(name, operator, value)`
Test if stat meets condition. Returns true/false.

Operators: `>`, `<`, `>=`, `<=`, `===`, `!==`

```javascript
if (StatsUtil.checkCondition('level', '>=', 10)) {
    // Player is level 10+
}
```

#### `StatsUtil.clamp(name, min, max)`
Limit stat between min and max.

```javascript
StatsUtil.clamp('health', 0, 100);
```

#### `StatsUtil.getAll()`
Get all stats as object.

```javascript
const stats = StatsUtil.getAll();
```

#### `StatsUtil.getMultiple(names)`
Get multiple stats.

```javascript
const {health, mana} = StatsUtil.getMultiple(['health', 'mana']);
```

#### `StatsUtil.setMultiple(statsObject)`
Set multiple stats at once.

```javascript
StatsUtil.setMultiple({health: 100, mana: 50});
```

#### `StatsUtil.modify(name, changes)`
Modify stat with operators.

```javascript
StatsUtil.modify('health', '+20');    // Add 20
StatsUtil.modify('health', '-5');     // Subtract 5
StatsUtil.modify('power', '*2');      // Double
StatsUtil.modify('cost', '/2');       // Halve
```

#### `StatsUtil.notify(name, change, icon = '')`
Show stat change notification.

```javascript
StatsUtil.notify('health', -20);
StatsUtil.notify('gold', 100, '💰');
```

---

## ChoicesUtil

Choice creation and filtering utilities.

### Methods

#### `ChoicesUtil.make(text, nextScene, onSelect = null)`
Create simple choice.

```javascript
ChoicesUtil.make('Go left', 'leftPath');
ChoicesUtil.make('Fight', 'combat', () => StatsUtil.add('level', 1));
```

#### `ChoicesUtil.conditional(text, condition, nextScene, onSelect = null)`
Create choice visible only if condition is true.

```javascript
ChoicesUtil.conditional(
    'Open the locked door',
    () => StatsUtil.checkCondition('lockpicking', '>=', 50),
    'secretRoom'
);
```

#### `ChoicesUtil.withStats(text, statChanges, nextScene)`
Create choice that modifies stats on selection.

```javascript
ChoicesUtil.withStats(
    'Drink the potion',
    {health: 30, stamina: -10},
    'nextScene'
);
```

#### `ChoicesUtil.requireStat(text, statName, operator, value, nextScene, onSelect = null)`
Create choice only available if stat meets threshold.

```javascript
ChoicesUtil.requireStat(
    'Charm the guard (need 70+ charisma)',
    'charisma',
    '>=',
    70,
    'guardsPath'
);
```

#### `ChoicesUtil.filter(choices)`
Remove unavailable choices (those with false conditions).

```javascript
const available = ChoicesUtil.filter(choicesArray);
```

#### `ChoicesUtil.random(text, outcomes, nextScene)`
Create choice with random outcome.

Outcomes: array of `{chance: 0.5, onSelect: callback, text: ''}`

```javascript
ChoicesUtil.random(
    'Roll the dice',
    [
        {chance: 0.5, onSelect: () => StatsUtil.add('gold', 100), text: 'Lucky!'},
        {chance: 0.5, onSelect: () => StatsUtil.subtract('gold', 50), text: 'Unlucky...'}
    ],
    'nextScene'
);
```

#### `ChoicesUtil.generate(template, items)`
Create multiple choices from template function.

```javascript
const choices = ChoicesUtil.generate(
    (item) => ChoicesUtil.make(item.name, item.scene),
    [{name: 'Attack', scene: 'combat'}, {name: 'Wait', scene: 'wait'}]
);
```

#### `ChoicesUtil.chain(choice, ...callbacks)`
Add multiple functions to execute on choice selection.

```javascript
const choice = ChoicesUtil.make('Click me', 'next');
ChoicesUtil.chain(
    choice,
    () => StatsUtil.add('gold', 100),
    () => gameUI.showNotification('Rich!'),
    () => StatsUtil.add('reputation', 5)
);
```

#### `ChoicesUtil.withConsequence(choice, consequenceText)`
Add notification text when choice is selected.

```javascript
const choice = ChoicesUtil.make('Open door', 'inside');
ChoicesUtil.withConsequence(choice, 'The door creaks ominously...');
```

---

## Scene Definition

A scene is an object with this structure:

```javascript
{
    // REQUIRED: Display text
    text: 'Your narrative',
    // OR dynamic:
    text: () => `Dynamic text with ${variables}`,
    
    // REQUIRED: Player choices
    choices: [
        {text: '...', next: '...', onSelect: () => {...}},
        // ... more choices
    ],
    // OR dynamic:
    choices: () => [...],
    
    // OPTIONAL: Runs when scene loads
    setup: () => {
        StatsUtil.add('morale', -10);
    },
    
    // OPTIONAL: Game phase label
    phase: 'exploration'
}
```

### Choice Object

```javascript
{
    // REQUIRED: Button text
    text: 'Click here',
    
    // REQUIRED: Next scene name
    next: 'nextSceneName',
    
    // OPTIONAL: Function ran when selected
    onSelect: () => {
        StatsUtil.add('gold', 100);
    },
    
    // OPTIONAL: Only appears if true
    condition: () => StatsUtil.get('level') >= 5
}
```

---

## Common Operations

### Check if Player is Rich
```javascript
if (StatsUtil.get('gold') > 1000) {
    // Show luxury options
}
```

### Show Different Text Based on Stats
```javascript
text: () => {
    if (StatsUtil.get('health') < 30) {
        return 'You feel weak...';
    } else if (StatsUtil.get('health') < 60) {
        return 'You feel decent.';
    } else {
        return 'You feel strong!';
    }
}
```

### Create Multiple Paths
```javascript
choices: () => {
    if (StatsUtil.checkCondition('strength', '>=', 70)) {
        return [ChoicesUtil.make('Force open', 'room')];
    } else {
        return [ChoicesUtil.make('Try to pick lock', 'locks')];
    }
}
```

### Temporary Message
```javascript
gameUI.showNotification('Quest complete!', 2000);
```

### Save After Important Choice
```javascript
{
    text: 'Continue?',
    next: 'pointOfNoReturn',
    onSelect: () => game.save('before_ending')
}
```

---

## Console Debugging

In DevTools console (F12):

```javascript
// Check state
game.getCurrentScene()
StatsUtil.getAll()
gameState.getHistory()

// Modify state
StatsUtil.set('health', 1000)
game.loadScene('myScene')
gameState.getStat('level')

// Save/Load
game.save('debug')
game.load('debug')

// View scene
game.getScene('myScene')

// Full state
gameState.getState()
```

