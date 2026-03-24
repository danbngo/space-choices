# File Structure Guide

## Main Entry Point
- **index.html** - Your game's main HTML file. Open this in a browser to play.

## Core Engine (Don't modify unless extending)
- **src/core/engine.js** - Main GameEngine class. Manages scenes, loading, and game flow.
- **src/core/state.js** - GameState class. Handles save/load, history, stat management.
- **src/core/ui.js** - GameUI class. Renders text, choices, stats to the screen.

## Utilities (Use these, but don't modify)
- **src/utils/stats.js** - StatsUtil convenience methods for stat manipulation.
- **src/utils/choices.js** - ChoicesUtil convenience methods for creating choices.

## Your Game (Modify these!)
- **src/game.js** - Your game definition. Scenes, stats, game loop starts here.

## Scene Examples (Reference)
- **src/scenes/template.js** - Scene template and examples to copy from.
- **src/scenes/advanced_examples.js** - Advanced patterns like combat systems, random encounters, time progression.

## Styling
- **src/styles.css** - UI styling. Modify for custom colors/fonts.

## Documentation
- **README.md** - Complete API documentation and feature list.
- **QUICKSTART.md** - Step-by-step guide to creating your game.
- **API_REFERENCE.md** - Complete API reference for all methods.
- **FILE_GUIDE.md** - This file (you're reading it!).

---

## Project Architecture

```
Space Choices Engine
│
├─ index.html (Entry Point)
│  └─ Loads all scripts in order
│
├─ Core Layer (Don't modify)
│  ├─ state.js (State + Save System)
│  ├─ ui.js (Rendering)
│  └─ engine.js (Game Logic)
│
├─ Utility Layer (Use, don't modify)
│  ├─ stats.js (Stat helpers)
│  └─ choices.js (Choice helpers)
│
└─ Game Layer (Modify this!)
   ├─ game.js (Your game definition)
   └─ styles.css (UI styling)
```

---

## Workflow

### Setting Up Your Game

1. **Define Stats** (src/game.js, initializeGame())
   ```javascript
   StatsUtil.initialize({health: 100, fuel: 50});
   ```

2. **Create Scenes** (src/game.js with scene definitions)
   ```javascript
   const myScene = {text: '...', choices: [...]};
   ```

3. **Register Scenes** (src/game.js, initializeGame())
   ```javascript
   game.registerScenes({myScene, otherScene});
   ```

4. **Start Game** (src/game.js, initializeGame())
   ```javascript
   game.start('start');
   ```

5. **Open index.html** in browser - Done!

### During Development

- Modify `src/game.js` to add/change scenes
- Modify `src/styles.css` for new colors/fonts
- Refresh browser to see changes (no build needed!)
- Use browser DevTools (F12) to debug
- Test choices and stat changes

### Creating More Content

If your game grows:

1. Create new files in `src/scenes/`
2. Define scene objects in those files
3. Load them in `index.html`
4. Register them in `game.registerScenes()`

Example structure for larger game:
```
src/
├─ game.js           (Initialization + Act 1)
├─ styles.css        (UI styling)
├─ scenes/
│  ├─ act2.js        (Scenes for Act 2)
│  ├─ act3.js        (Scenes for Act 3)
│  ├─ characters.js  (Character interactions)
│  └─ system.js      (Combat/Magic/etc)
└─ core/             (Don't touch)
```

Then in `index.html`:
```html
<!-- Load core -->
<script src="src/core/state.js"></script>
<script src="src/core/ui.js"></script>
<script src="src/core/engine.js"></script>
<script src="src/utils/stats.js"></script>
<script src="src/utils/choices.js"></script>

<!-- Load scenes -->
<script src="src/scenes/act2.js"></script>
<script src="src/scenes/act3.js"></script>

<!-- Your game -->
<script src="src/game.js"></script>
```

---

## What Each File Does

### index.html
- Loads all JavaScript files in order
- Displays the game UI (title, stats, text, choices)
- No modifications needed unless designing new UI

### src/core/engine.js
The GameEngine class:
- Manages scene loading and transitions
- Handles choice selection
- Tracks game history
- Provides save/load interface
- Calls scene setup functions

Don't modify unless you want to add new engine features.

### src/core/state.js
The GameState class:
- Stores all game data (stats, scene, history)
- Handles localStorage saves
- Manages stat increments/decrements
- Provides import/export functionality

Don't modify unless extending save system.

### src/core/ui.js
The GameUI class:
- Renders text to screen
- Displays choice buttons
- Shows/updates stats
- Animations and transitions
- Notifications

Don't modify unless customizing UI behavior.

### src/utils/stats.js
Convenience functions for stat management:
- `StatsUtil.set()`, `get()`, `add()`, `subtract()`
- `StatsUtil.checkCondition()`
- `StatsUtil.initialize()`
- Calls gameUI updates automatically

Use in your scenes to modify game state.

### src/utils/choices.js
Convenience functions for creating choices:
- `ChoicesUtil.make()` - Simple choices
- `ChoicesUtil.withStats()` - Choices affecting stats
- `ChoicesUtil.requireStat()` - Conditional choices
- `ChoicesUtil.random()` - Random outcomes
- `ChoicesUtil.filter()` - Remove unavailable choices

Use when defining scene choices.

### src/game.js
**You write most of this file.**

Contains:
- `initializeGame()` - Called on page load. Set up stats and scenes.
- Scene definitions - Each scene is an object with text and choices
- `game.registerScenes()` - Register all your scenes
- `game.start()` - Start the game

This is where your game logic lives.

### src/styles.css
CSS styling for the UI:
- Background colors and gradients
- Text colors and fonts
- Button styling and hover effects
- Animations (fade in, slide in)
- Responsive design

Modify to customize the look and feel.

### src/scenes/template.js
Reference file showing:
- Scene template structure
- Common choice types
- Conditional logic examples
- Dynamic text patterns

Copy from this file when creating new scenes.

### src/scenes/advanced_examples.js
Advanced patterns:
- Branching narratives
- Random encounters
- Reputation systems
- Stat-based gates
- Multi-phase combat
- Time progression
- Inventory systems
- Dynamic story trees

Reference when implementing complex mechanics.

### README.md
Complete documentation:
- Feature overview
- Project structure
- Full API documentation
- Usage examples
- Tips and patterns

Read when learning the engine.

### QUICKSTART.md
Step-by-step tutorial:
- How to run the game
- How to create your first scene
- Common patterns
- Debugging tips
- File organization for large projects

Start here if you're new.

### API_REFERENCE.md
Comprehensive API documentation:
- Every method of every class
- Parameters and return values
- Usage examples for each
- Common operations

Reference when writing code.

---

## Quick Reference

### To Add a New Stat
```javascript
StatsUtil.initialize({newStat: 0});
```

### To Change a Scene
```javascript
game.loadScene('sceneName');
```

### To Modify a Stat
```javascript
StatsUtil.add('stat', 10);
StatsUtil.subtract('stat', 5);
```

### To Create a Choice
```javascript
ChoicesUtil.make('Text', 'nextScene');
```

### To Save Game
```javascript
game.save('slot1');
```

### To Load Game
```javascript
game.load('slot1');
```

### To Show Message
```javascript
gameUI.showNotification('Hello!');
```

---

## Common Mistakes

### ❌ Mistake: Forgetting to register a scene
```javascript
// Wrong - scene exists but game doesn't know about it
const myScene = {...};
game.loadScene('myScene'); // Error!

// Right - register first
game.registerScenes({myScene});
game.loadScene('myScene');
```

### ❌ Mistake: Using gameState instead of StatsUtil
```javascript
// Inefficient - doesn't update UI
gameState.setStat('health', 50);

// Better - updates UI automatically
StatsUtil.set('health', 50);
```

### ❌ Mistake: Not filtering conditional choices
```javascript
// Wrong - might show unavailable choices
choices: () => {
    return [
        ChoicesUtil.requireStat('Need 50 level', 'level', '>=', 50, 'next')
    ];
}

// Right - filters out unavailable
choices: () => {
    const options = [
        ChoicesUtil.requireStat('Need 50 level', 'level', '>=', 50, 'next')
    ];
    return ChoicesUtil.filter(options);
}
```

### ❌ Mistake: Modifying core files
Changes to `src/core/` or `src/utils/` might break the engine. Only modify:
- `src/game.js`
- `src/styles.css`
- Create new files in `src/scenes/`

### ❌ Mistake: Forgetting index.html entry point
Game starts from `initializeGame()` called in `src/game.js`. Make sure it's called when page loads:
```javascript
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGame);
} else {
    initializeGame();
}
```

---

## Next Steps

1. ✅ You have the full engine running
2. 📖 Read QUICKSTART.md for your first tutorial
3. 🎮 Modify src/game.js to create your own game
4. 🎨 Customize src/styles.css
5. 📚 Reference API_REFERENCE.md for detailed docs
6. 🚀 Add more scenes in src/scenes/

Good luck building your space RPG! 🚀
