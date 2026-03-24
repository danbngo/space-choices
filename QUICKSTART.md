# Quick Start Guide

## Running the Game

1. Open `index.html` in any modern web browser
2. The demo Space Choices game will start automatically
3. Click through the choices to experience the game

That's it! No build process, no server, no dependencies.

## Creating Your Game

### Step 1: Define Your Stats

In `src/game.js`, modify the `initializeGame()` function:

```javascript
function initializeGame() {
    // Define what stats your game tracks
    StatsUtil.initialize({
        health: 100,
        sanity: 50,
        money: 1000,
        // Add any stats you need
    });
    
    // Register scenes (see Step 2)
    game.registerScenes({
        start: sceneStart,
        // ... more scenes
    });
    
    game.start('start');
}
```

### Step 2: Create Scenes

Each scene has narrative text and choices:

```javascript
const myFirstScene = {
    // What text appears
    text: 'You wake up in a strange place.',
    
    // What choices does the player have?
    choices: [
        ChoicesUtil.make('Look around', 'exploratory'),
        ChoicesUtil.make('Panic', 'panic')
    ]
};

const exploratory = {
    text: 'You see an old workshop.',
    
    choices: () => {
        const health = StatsUtil.get('health');
        
        return [
            ChoicesUtil.make('Use tools', 'crafting'),
            health > 50
                ? ChoicesUtil.make('Run - you feel strong enough', 'escape')
                : ChoicesUtil.make('Too weak to run', 'currentScene')
        ];
    }
};
```

### Step 3: Add Stat Changes

When a choice is made, change the player's stats:

```javascript
const combatScene = {
    text: 'You face a monster!',
    
    choices: [
        {
            text: 'Fight',
            next: 'aftermath',
            onSelect: () => {
                // Change stats when this choice is picked
                if (Math.random() > 0.5) {
                    StatsUtil.add('health', -20);
                    gameUI.showNotification('You got hurt!');
                } else {
                    StatsUtil.add('gold', 50);
                    gameUI.showNotification('Victory!');
                }
            }
        },
        ChoicesUtil.make('Flee', 'escape')
    ]
};
```

### Step 4: Use Conditional Choices

Show/hide choices based on player progress:

```javascript
const treasureScene = {
    text: 'You find a locked chest.',
    
    choices: () => {
        const options = [
            // This choice is available to everyone
            ChoicesUtil.make('Leave it', 'nextScene'),
            
            // This choice needs >50 lockpicking skill
            ChoicesUtil.requireStat(
                'Pick the lock',
                'lockpicking',
                '>=',
                50,
                'treasureObtained'
            ),
            
            // This choice needs a lot of strength
            ChoicesUtil.requireStat(
                'Smash it open',
                'strength',
                '>=',
                80,
                'treasureObtained',
                () => StatsUtil.add('health', -15)
            )
        ];
        
        // Filter removes unavailable choices
        return ChoicesUtil.filter(options);
    }
};
```

## Common Patterns

### Pattern 1: Multiple Endings Based on Stats

```javascript
const finalScene = {
    text: () => {
        const gold = StatsUtil.get('gold');
        const reputation = StatsUtil.get('reputation');
        
        if (gold > 5000 && reputation > 80) {
            return 'You became legendary! Hailed as a hero.';
        } else if (gold > 1000) {
            return 'You became moderately wealthy.';
        } else {
            return 'You survive, barely.';
        }
    },
    
    choices: [ChoicesUtil.make('Play Again', 'start')]
};
```

### Pattern 2: Random Events

```javascript
const randomEvent = {
    text: () => {
        const random = Math.random();
        const type = random < 0.5 ? 'good' : 'bad';
        gameState.setStat('lastEventType', type);
        
        return type === 'good' 
            ? 'Something wonderful happens!'
            : 'Oh no, disaster strikes!';
    },
    
    choices: () => {
        const type = gameState.getStat('lastEventType');
        
        return [
            type === 'good'
                ? ChoicesUtil.make('Celebrate', 'party')
                : ChoicesUtil.make('Recover', 'recover')
        ];
    }
};
```

### Pattern 3: Passage of Time

```javascript
const dayPasses = {
    text: () => `Day ${StatsUtil.get('dayNumber') || 1}`,
    
    choices: [
        {
            text: 'Continue',
            next: 'nextScene',
            onSelect: () => {
                StatsUtil.increment('dayNumber');
                StatsUtil.add('food', -1);
                StatsUtil.add('fuel', -5);
                
                // Game over if supplies run out
                if (StatsUtil.get('food') <= 0) {
                    game.loadScene('gameOver');
                }
            }
        }
    ]
};
```

### Pattern 4: Save/Load UI

You can add save buttons to `index.html`:

```html
<button onclick="game.save('slot1')">Save Game</button>
<button onclick="game.load('slot1')">Load Game</button>
```

Or create a save menu scene:

```javascript
const saveMenu = {
    text: 'Save your game?',
    
    choices: [
        {
            text: 'Save to Slot 1',
            next: 'currentScene',
            onSelect: () => game.save('slot1')
        },
        {
            text: 'Load from Slot 1',
            next: 'currentScene',
            onSelect: () => game.load('slot1')
        },
        ChoicesUtil.make('Back', 'currentScene')
    ]
};
```

## Tips & Tricks

### Tip 1: Use Template Literals for Better Text

```javascript
text: () => `
**Chapter 3: The Revelation**

You stand before the gates.
Health: ${StatsUtil.get('health')}%
Reputation: ${StatsUtil.get('reputation')}

What will you do?
`
```

### Tip 2: Chain Actions

```javascript
const choice = ChoicesUtil.make('Destroy it', 'nextScene');
ChoicesUtil.chain(choice,
    () => StatsUtil.add('morale', -20),
    () => StatsUtil.add('guilt', 50),
    () => gameUI.showNotification('You can\'t undo this...')
);
```

### Tip 3: Complex Conditions

```javascript
choices: () => {
    const hasKey = gameState.getStat('hasKey') === 1;
    const health = StatsUtil.get('health');
    const gold = StatsUtil.get('gold');
    
    const options = [
        hasKey
            ? ChoicesUtil.make('Unlock the door', 'secret')
            : ChoicesUtil.make('Door is locked', 'currentScene'),
        
        health > 50 && gold > 100
            ? ChoicesUtil.make('Hire a guide', 'guided')
            : ChoicesUtil.make('Go alone', 'alone')
    ];
    
    return ChoicesUtil.filter(options);
}
```

### Tip 4: Drama and Delays

```javascript
const dramaticMoment = {
    text: 'The sky darkens...',
    
    setup: () => {
        gameUI.setChoicesEnabled(false);
        
        setTimeout(() => {
            gameUI.displayText('An ancient power awakens from the depths...');
        }, 1500);
        
        setTimeout(() => {
            gameUI.displayText('The ground shakes with terrible force...');
        }, 3000);
        
        setTimeout(() => {
            gameUI.setChoicesEnabled(true);
        }, 4500);
    },
    
    choices: [ChoicesUtil.make('Face it', 'battle')]
};
```

## File Organization

As your game grows:

```
src/
├── game.js                 # Main game initialization
├── scenes/
│   ├── act1.js            # Scenes 1-5
│   ├── act2.js            # Scenes 6-12
│   └── act3.js            # Final scenes
└── core/                  # Don't modify these
```

In each act file:

```javascript
const sceneA = { /* ... */ };
const sceneB = { /* ... */ };
const sceneC = { /* ... */ };

// At bottom of file
if (typeof game !== 'undefined') {
    game.registerScenes({
        sceneA, sceneB, sceneC
    });
}
```

Then load in `index.html`:

```html
<script src="src/core/engine.js"></script>
<script src="src/core/state.js"></script>
<script src="src/core/ui.js"></script>
<script src="src/utils/stats.js"></script>
<script src="src/utils/choices.js"></script>

<!-- Load your scene files -->
<script src="src/scenes/act1.js"></script>
<script src="src/scenes/act2.js"></script>
<script src="src/scenes/act3.js"></script>

<script src="src/game.js"></script>
```

## Debugging

Open browser DevTools (F12) and try:

```javascript
// Check current scene
game.getCurrentScene()

// View all stats
StatsUtil.getAll()

// View game history
gameState.getHistory()

// Manually set a stat
StatsUtil.set('health', 50)

// Test a scene
game.loadScene('myScene')
```

## Next Steps

1. **Start Small** - Make 5 interconnected scenes first
2. **Add Stats** - Track the player's progress through stats
3. **Create Consequences** - Stat changes should matter
4. **Build Branches** - Add conditional choices
5. **Playtest** - See how choices shape the story
6. **Expand** - Add more scenes, more complexity

For advanced patterns, check `src/scenes/advanced_examples.js`

Good luck! 🚀
