/**
 * Scene Template
 * Copy this file and modify to create new scenes easily
 */

const sceneTemplate = {
    // ==========================================
    // REQUIRED: Display text
    // Can be a string or a function that returns a string
    // ==========================================
    text: 'Your story begins here...',
    
    // Or use a function for dynamic text:
    // text: () => {
    //     const health = StatsUtil.get('health');
    //     return `You are currently at ${health}% health.`;
    // },
    
    // ==========================================
    // REQUIRED: Choices presented to player
    // Can be an array or a function that returns an array
    // ==========================================
    choices: [
        // Simple choice
        ChoicesUtil.make('Choose option 1', 'nextSceneName'),
        
        // Choice with stat changes
        ChoicesUtil.withStats('Attack (costs health)', {health: -20}, 'combatScene'),
        
        // Conditional choice (only appears if stats meet requirements)
        ChoicesUtil.requireStat('Negotiate (need 60+rep)', 'reputation', '>=', 60, 'diplomaticScene'),
        
        // Custom choice with callback
        {
            text: 'Custom choice with code',
            next: 'nextScene',
            onSelect: () => {
                // Your code here
                StatsUtil.add('morale', 5);
                gameUI.showNotification('Something happened!');
            }
        }
    ],
    
    // Or use a function for dynamic choices:
    // choices: () => {
    //     const options = [
    //         ChoicesUtil.make('Always available', 'scene1'),
    //         ChoicesUtil.requireStat('Conditional', 'health', '>', 50, 'scene2')
    //     ];
    //     return ChoicesUtil.filter(options);
    // },
    
    // ==========================================
    // OPTIONAL: Called when scene loads
    // ==========================================
    setup: () => {
        // Trigger effects when entering scene
        // StatsUtil.add('fuel', -10);
        // gameUI.showNotification('You entered a dangerous area!');
    },
    
    // ==========================================
    // OPTIONAL: Set game phase
    // Useful for tracking context (combat, travel, etc.)
    // ==========================================
    phase: 'exploration'
};

// To use this template:
// 1. Copy everything from const sceneTemplate = { ... }
// 2. Rename 'sceneTemplate' to your scene name
// 3. In your game.js, add it to game.registerScenes()

// Example scenes below:

const sceneEmpty = {
    text: 'Enter your scene text here.',
    choices: [
        ChoicesUtil.make('Go somewhere', 'anotherScene')
    ]
};

const sceneBattle = {
    text: () => `
**COMBAT!**

Enemy approaching! Your health: ${StatsUtil.get('health')}%
    `,
    
    phase: 'combat',
    
    setup: () => {
        StatsUtil.add('morale', -10);
    },
    
    choices: () => {
        const choices = [
            {
                text: 'Attack',
                next: 'afterBattle',
                onSelect: () => {
                    if (Math.random() > 0.4) {
                        StatsUtil.add('credits', 100);
                        gameUI.showNotification('Victory!');
                    } else {
                        StatsUtil.add('health', -25);
                        gameUI.showNotification('You got hit hard!');
                    }
                }
            },
            {
                text: 'Defend',
                next: 'afterBattle',
                onSelect: () => {
                    StatsUtil.add('health', -10);
                }
            },
            ChoicesUtil.requireStat('Run away (needs 50+ fuel)', 'fuel', '>=', 50, 'escape', () => {
                StatsUtil.subtract('fuel', 20);
            })
        ];
        
        return ChoicesUtil.filter(choices);
    }
};

const sceneWithConditions = {
    text: `You stand at a crossroads.`,
    
    choices: () => {
        const options = [
            // Rich person's choice
            StatsUtil.get('credits') >= 500 
                ? ChoicesUtil.make('Take the expensive path', 'luxuryScene')
                : ChoicesUtil.make('You cannot afford the expensive path...', 'currentScene'),
            
            // Based on reputation
            ChoicesUtil.requireStat(
                'The guild welcomes you (need reputation 75+)',
                'reputation',
                '>=',
                75,
                'guildScene'
            ),
            
            // Always available
            ChoicesUtil.make('Take the simple path', 'simpleScene')
        ];
        
        return ChoicesUtil.filter(options);
    }
};
