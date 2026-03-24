/**
 * Game Definition - Space Choices RPG
 * Example implementation showing how to use the game engine
 */

// Initialize game
function initializeGame() {
    // Set up initial stats
    StatsUtil.initialize({
        health: 100,
        fuel: 100,
        credits: 1000,
        reputation: 50,
        morale: 75
    });

    // Register scenes
    game.registerScenes({
        start: sceneStart,
        spaceTravel: sceneSpaceTravel,
        spaceCombat: sceneSpaceCombat,
        refuge: sceneRefuge,
        ending: sceneEnding
    });

    // Start the game
    game.start('start');
}

// ============================================
// SCENE DEFINITIONS
// ============================================

const sceneStart = {
    text: `You wake up in the captain's chair of your beaten-up starship. 
The *Stellar Wanderer*. Your ship. The only home you've known for the last 5 years.

The navigation console blinks urgently. An **emergency distress signal** echoes through the void. 
It's coming from somewhere deep in the Crimson Nebula—dangerous territory, but the credits would be good.
Your fuel tank is running low, and your crew is restless.

What do you do?`,
    
    phase: 'default',
    
    choices: () => [
        ChoicesUtil.withStats(
            'Head toward the distress signal - potential profit and glory',
            { fuel: -20, morale: 10 },
            'spaceTravel'
        ),
        ChoicesUtil.withStats(
            'Ignore it and plot a course to the nearest space station',
            { fuel: -15 },
            'spaceTravel'
        ),
        ChoicesUtil.make(
            'Investigate the signal in detail first',
            'spaceTravel'
        )
    ]
};

const sceneSpaceTravel = {
    text: () => {
        const fuel = StatsUtil.get('fuel');
        const health = StatsUtil.get('health');
        
        return `**Status Report:**
Your ship is traveling through the vast emptiness of space.

*Fuel Level:* ${fuel}%
*Hull Integrity:* ${health}%
*Credits:* ${StatsUtil.get('credits')} ⚡

The stars drift past your viewport, infinite and silent. Your crew members look to you for guidance.
As you scan the sensors, three distinct situations demand your attention...`;
    },
    
    phase: 'travel',
    
    choices: () => {
        const choices = [
            ChoicesUtil.make(
                '🎯 Encounter a small asteroid field - risky shortcut',
                'spaceCombat'
            ),
            ChoicesUtil.make(
                '🚨 Receive a distress call from a luxury yacht',
                'spaceCombat'
            ),
            ChoicesUtil.requireStat(
                '📡 Find an abandoned research station (Reputation required)',
                'reputation',
                '>=',
                60,
                'refuge'
            ),
            ChoicesUtil.withStats(
                '⛽ Head to the nearest space station',
                { fuel: -30 },
                'spaceTravel'
            )
        ];
        
        return ChoicesUtil.filter(choices);
    }
};

const sceneSpaceCombat = {
    text: () => {
        return `**COMBAT ENGAGED!**

Your sensors blare with warnings. A **pirate interceptor** has locked weapons on your position!

Your crew scrambles to their stations. You have seconds to decide.
Your current resources:
- **Health:** ${StatsUtil.get('health')}%
- **Fuel:** ${StatsUtil.get('fuel')}%
- **Credits:** ${StatsUtil.get('credits')} ⚡`;
    },
    
    phase: 'combat',
    
    choices: () => {
        const health = StatsUtil.get('health');
        const fuel = StatsUtil.get('fuel');
        
        const choices = [
            {
                text: '⚡ Return fire - aggressive stance',
                onSelect: () => {
                    StatsUtil.add('health', -20);
                    StatsUtil.add('credits', 300);
                    StatsUtil.add('reputation', 5);
                    gameUI.showNotification('Combat victorious! You took damage but won credits.');
                },
                next: 'spaceTravel'
            },
            {
                text: '🛡️ Raise shields and maneuver - defensive',
                onSelect: () => {
                    StatsUtil.add('health', -8);
                    StatsUtil.add('fuel', -15);
                    StatsUtil.add('reputation', 2);
                },
                next: 'spaceTravel'
            },
            {
                text: '🚀 Boost engines and run - escape',
                condition: () => fuel > 20,
                onSelect: () => {
                    StatsUtil.subtract('fuel', 25);
                    StatsUtil.add('morale', -10);
                },
                next: 'spaceTravel'
            },
            {
                text: '💬 Try to negotiate - risky gamble',
                onSelect: () => {
                    if (Math.random() > 0.5) {
                        StatsUtil.add('credits', 200);
                        gameUI.showNotification('They accepted your offer!');
                    } else {
                        StatsUtil.add('health', -30);
                        gameUI.showNotification('They opened fire!');
                    }
                },
                next: 'spaceTravel'
            }
        ];
        
        return ChoicesUtil.filter(choices);
    }
};

const sceneRefuge = {
    text: () => `You discover the **abandoned Osiris Research Station** drifting silently in the void.

As you approach, you detect faint power signals. The station might contain valuable research data, 
ancient technology, or... something worse.

The airlock beckons. Your crew looks to you. Will you risk investigation?`,
    
    phase: 'exploration',
    
    choices: () => [
        {
            text: '🔍 Dock and investigate thoroughly',
            onSelect: () => {
                const loot = Math.floor(Math.random() * 500) + 300;
                StatsUtil.add('credits', loot);
                StatsUtil.add('health', -15);
                gameUI.showNotification(`Found ${loot} credits in supplies!`);
            },
            next: 'ending'
        },
        {
            text: '📡 Scan remotely for valuable data',
            onSelect: () => {
                StatsUtil.add('credits', 400);
                StatsUtil.add('reputation', 10);
            },
            next: 'ending'
        },
        {
            text: '⚠️ Mark location and leave',
            onSelect: () => {
                StatsUtil.add('fuel', 20);
            },
            next: 'ending'
        }
    ]
};

const sceneEnding = {
    text: () => {
        const credits = StatsUtil.get('credits');
        const health = StatsUtil.get('health');
        const reputation = StatsUtil.get('reputation');
        
        let message = `**MISSION SUMMARY**\n\n`;
        message += `Your ship has found relative safety. Your journey through the Crimson Nebula concludes.\n\n`;
        message += `**Final Stats:**\n`;
        message += `Credits: ${credits}\n`;
        message += `Ship Health: ${health}%\n`;
        message += `Reputation: ${reputation}\n\n`;
        
        if (credits > 2000) {
            message += `You're becoming a wealthy captain! The galaxy takes notice.`;
        } else if (health < 50) {
            message += `Your ship needs repairs. This adventure cost you dearly.`;
        } else if (reputation > 80) {
            message += `Your legend grows across the stars.`;
        } else {
            message += `You survive another day in the vast expanse.`;
        }
        
        return message;
    },
    
    choices: () => [
        {
            text: '🔄 Play Again',
            onSelect: () => game.start('start')
        },
        {
            text: '💾 Save Game',
            onSelect: () => game.save('save1')
        }
    ]
};

// Start the game when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGame);
} else {
    initializeGame();
}
