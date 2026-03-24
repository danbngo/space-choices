# Getting Started Checklist

## ✅ Initial Setup

- [x] Engine files created (core, utils, styles)
- [x] index.html created
- [x] Example game (Space Choices) is running
- [ ] **Next You:** Open index.html in your browser and play the demo

## 🎮 Play the Demo First

- [ ] Open `index.html` in a web browser
- [ ] Read through the Space Choices game example
- [ ] Click through all choices to see how it works
- [ ] Try the "Save Game" button (if available)
- [ ] Notice how stats update based on choices

This will help you understand how the engine works.

## 📋 Plan Your Game

Before writing code, plan:

- [ ] What is your game about? (Genre, setting, tone)
- [ ] What stats does your player have?
  - Example: `health, fuel, morale, reputation`
- [ ] How many main scenes/chapters?
- [ ] What are 3-5 key choices that define your game?
- [ ] What's the ending(s)?

Write this down! It helps when coding.

## 🛠️ Customize Stats

Edit `src/game.js`, in the `initializeGame()` function:

```javascript
StatsUtil.initialize({
    // Replace these with YOUR stats
    health: 100,
    fuel: 100,
    credits: 1000,
    reputation: 50,
    morale: 75
});
```

- [ ] Update stat names for your game
- [ ] Set reasonable starting values
- [ ] Decide min/max values for each

## 📝 Create Your First Scene

Still in `src/game.js`, create your opening scene:

```javascript
const sceneStart = {
    text: 'Write your opening narration here.',
    
    choices: [
        ChoicesUtil.make('Choice 1 text', 'nextScene'),
        ChoicesUtil.make('Choice 2 text', 'otherScene')
    ]
};
```

- [ ] Write your opening narrative
- [ ] Create 2-3 meaningful choices
- [ ] Name the next scenes (you'll create them next)

## 🔗 Create Connected Scenes

Create a scene for each choice:

```javascript
const nextScene = {
    text: 'What happens after choice 1...',
    
    choices: [
        ChoicesUtil.make('Next choice', 'anotherScene')
    ]
};
```

- [ ] Scene 1 created (from first choice)
- [ ] Scene 2 created (from second choice)
- [ ] Each has their own choices leading forward
- [ ] Think: How do these lead to your ending?

## 📊 Add Stat Changes

Make choices matter by affecting stats:

```javascript
ChoicesUtil.withStats(
    'Risky action text',
    {health: -20, morale: +10},
    'nextScene'
)
```

- [ ] Choices now have consequences
- [ ] Stats change based on player decisions
- [ ] Stats affect what choices are available

## 🎯 Register All Scenes

In `src/game.js`, in the `initializeGame()` function:

```javascript
game.registerScenes({
    start: sceneStart,
    nextScene: nextScene,
    otherScene: otherScene
    // Add all your scenes here
});
```

- [ ] All scenes registered
- [ ] No typos in scene names
- [ ] `game.start('start')` at the end

## 🧪 Test Your Game

Open index.html in browser:

- [ ] Game loads without errors (check console: F12)
- [ ] Opening text displays
- [ ] Choices appear and are clickable
- [ ] Stats panel shows your stats
- [ ] Clicking a choice changes the scene
- [ ] Stats update when expected

If something breaks, check [Browser DevTools](#browser-console).

## ✨ Add Conditional Choices

Show/hide choices based on stats:

```javascript
choices: () => {
    const options = [
        ChoicesUtil.make('Always available', 'scene1'),
        ChoicesUtil.requireStat(
            'Need 50 reputation',
            'reputation',
            '>=',
            50,
            'eliteScene'
        )
    ];
    return ChoicesUtil.filter(options);
}
```

- [ ] At least one conditional choice added
- [ ] Used `ChoicesUtil.requireStat()` or similar
- [ ] Used `ChoicesUtil.filter()` to remove unavailable choices

## 🎨 Customize Appearance

Edit `src/styles.css`:

- [ ] Change background colors (search: `background`)
- [ ] Change text colors (search: `color`)
- [ ] Change button colors (search: `choice-button`)
- [ ] Change fonts (search: `font-family`)

Test changes by refreshing browser.

## 💾 Add Save/Load

Add buttons to `index.html` (in `#game-container` div):

```html
<div style="margin-top: 20px; text-align: center;">
    <button onclick="game.save('save1)">Save Game</button>
    <button onclick="game.load('save1)">Load Game</button>
</div>
```

- [ ] Save button works
- [ ] Load button restores saved state
- [ ] Different save slots possible

## 📚 Expand the Story

Add more scenes and complexity:

- [ ] Scene count: 5+
- [ ] At least one branching point (multiple paths)
- [ ] Multiple endings based on choices
- [ ] Stat thresholds that open/close options
- [ ] Random or unpredictable outcomes

Reference `src/scenes/advanced_examples.js` for ideas.

## 🐛 Debug Issues

### Browser Console (F12)

```javascript
// Check current scene
game.getCurrentScene()

// Check all stats
StatsUtil.getAll()

// Manually set a stat
StatsUtil.set('health', 50)

// Load a specific scene
game.loadScene('myScene')

// Check if a scene exists
game.getScene('myScene')
```

### Common Issues

| Problem | Solution |
|---------|----------|
| Scene doesn't load | Check spelling in `game.registerScenes()` |
| Choices don't appear | Make sure `choices` array has items |
| Stats don't update | Use `StatsUtil` not `gameState` directly |
| Button doesn't work | Check `onSelect` and `next` properties |
| Conditional not working | Verify `condition` returns true/false |
| Styles look wrong | Clear browser cache (Ctrl+Shift+Del) |

## 🚀 Launch Checklist

Before showing others:

- [ ] All scenes have interesting text
- [ ] All choices are distinct options
- [ ] Stat changes make sense
- [ ] At least 2 different endings
- [ ] No broken links between scenes
- [ ] Game is playable from start to end
- [ ] Tested in multiple browsers
- [ ] Save/load works

## 📖 Reference Docs

When you need help:

| Need | File | Section |
|------|----|---------|
| Overview | README.md | Features, Core API |
| Getting started | QUICKSTART.md | Step-by-step |
| All methods | API_REFERENCE.md | Complete reference |
| File purposes | FILE_GUIDE.md | What each file does |
| Advanced patterns | src/scenes/advanced_examples.js | Code examples |

## 🎓 Learning Path

Recommended order to learn:

1. **First:** Play the demo (index.html)
2. **Second:** Read QUICKSTART.md
3. **Third:** Modify src/game.js to create simple 3-scene game
4. **Fourth:** Add conditional choices
5. **Fifth:** Add random outcomes
6. **Sixth:** Reference API_REFERENCE.md for advanced features
7. **Seventh:** Study src/scenes/advanced_examples.js

## 💡 Tips

### Keep It Simple At First
Start with 3-5 connected scenes. Expand later.

### Test Often
Refresh browser after each change. Test every scene.

### Use Meaningful Names
Good: `sceneDestinyChoice`, `fightMonster`
Bad: `scene1`, `s2`

### Comments Help Future You
```javascript
// Player discovered the truth - reputation increases
ChoicesUtil.withStats('..', {reputation: 20}, 'next')
```

### Backup Your Work
Before major changes, copy index.html and src/game.js

### Use Browser Console
F12 to open DevTools. Test changes quickly without reloading.

## 🎯 Your First Game Goal

Minimum viable game:
1. 5 interconnected scenes
2. 3-4 stats that matter
3. 2 different endings
4. At least one conditional choice
5. Each choice has visible consequences

**Time estimate:** 1-2 hours for first game

## What's Next After Your First Game?

- Add more scenes (10+)
- Create multiple story branches
- Implement special mechanics (combat, inventory, etc.)
- Polish UI with custom CSS
- Add background music/sound effects (guide coming)
- Package for distribution

---

## Quick Command Reference

Keep these handy while coding:

```javascript
// STATS
StatsUtil.set('health', 100)
StatsUtil.get('health')
StatsUtil.add('credits', 50)
StatsUtil.increment('level')

// CHOICES
ChoicesUtil.make(text, nextScene)
ChoicesUtil.withStats(text, {stats}, nextScene)
ChoicesUtil.requireStat(text, 'stat', '>=', 50, nextScene)
ChoicesUtil.filter(choicesArray)

// SCENES
game.registerScene(name, definition)
game.registerScenes({...})
game.loadScene('scene')
game.start('start')

// UI
gameUI.displayText(text)
gameUI.displayChoices(choices)
gameUI.showNotification(message)

// SAVE/LOAD
game.save('slot1')
game.load('slot1')
gameState.listSaves()
```

---

## You're Ready! 🚀

You have a complete game engine. Everything is set up.

**Next step:** Open `index.html` in your browser and start playing with the code!

The best way to learn is by experimenting. Don't be afraid to break things — you can always reload the page.

Happy game making! 🎮✨
