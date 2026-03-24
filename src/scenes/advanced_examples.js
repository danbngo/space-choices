/**
 * ADVANCED PATTERNS & TECHNIQUES
 * Examples of sophisticated game mechanics
 */

// ============================================
// 1. BRANCHING NARRATIVES
// ============================================

const sceneWithBranching = {
    text: 'A mysterious figure approaches...',
    
    choices: () => [
        {
            text: '🗣️ Talk to them',
            onSelect: () => {
                // Set flag for later handling
                gameState.setStat('metMysteriousFigure', 1);
            },
            next: 'mysterieSlowReveals'
        },
        ChoicesUtil.make('🏃 Run away', 'escapeScene')
    ]
};

// ============================================
// 2. RANDOM ENCOUNTERS
// ============================================

const sceneRandomEncounter = {
    text: 'You venture into unknown space...',
    
    setup: () => {
        const random = Math.random();
        
        if (random < 0.3) {
            gameState.setStat('encounteredType', 'pirate');
            gameUI.showNotification('⚠️ Pirate ship detected!');
        } else if (random < 0.6) {
            gameState.setStat('encounteredType', 'merchant');
            gameUI.showNotification('🚢 Merchant vessel incoming');
        } else {
            gameState.setStat('encounteredType', 'station');
            gameUI.showNotification('🌍 Space station discovered');
        }
    },
    
    text: () => {
        const type = gameState.getStat('encounteredType') ?? 'unknown';
        const encounters = {
            pirate: 'A pirate ship locks weapons on you!',
            merchant: 'A merchant vessel hails you on comms.',
            station: 'A massive space station appears on your scanners.'
        };
        return encounters[type] || 'Something approaches...';
    },
    
    choices: () => {
        const type = gameState.getStat('encounteredType');
        
        if (type === 'pirate') {
            return [
                ChoicesUtil.make('Fight', 'combat'),
                ChoicesUtil.make('Flee', 'escape')
            ];
        } else if (type === 'merchant') {
            return [
                ChoicesUtil.make('Trade', 'trading'),
                ChoicesUtil.make('Ignore', 'continue')
            ];
        } else {
            return [
                ChoicesUtil.make('Dock', 'station'),
                ChoicesUtil.make('Stay in space', 'continue')
            ];
        }
    }
};

// ============================================
// 3. CUMULATIVE CHOICES (Reputation System)
// ============================================

const buildingReputation = {
    text: () => {
        const rep = StatsUtil.get('reputation');
        let status = 'Unknown';
        
        if (rep >= 90) status = '⭐⭐⭐⭐⭐ Legendary';
        else if (rep >= 70) status = '⭐⭐⭐⭐ Famous';
        else if (rep >= 50) status = '⭐⭐⭐ Known';
        else if (rep >= 25) status = '⭐⭐ Rising';
        else if (rep >= 1) status = '⭐ Nobody';
        else status = '💀 Wanted';
        
        return `Your reputation: ${status} (${rep})`;
    },
    
    choices: () => [
        {
            text: 'Help the colony (builds reputation)',
            onSelect: () => StatsUtil.add('reputation', 15),
            next: 'aftermath'
        },
        {
            text: 'Rob the colony (loses reputation)',
            onSelect: () => {
                StatsUtil.add('reputation', -20);
                StatsUtil.add('credits', 300);
            },
            next: 'aftermath'
        }
    ]
};

// ============================================
// 4. STAT-BASED GATES
// ============================================

const sceneWithStatGates = {
    text: 'You approach a locked door. What do you try?',
    
    choices: () => {
        const options = [];
        
        // Always available
        options.push(ChoicesUtil.make('Pick the lock (standard)', 'roomInside'));
        
        // Requires strength (tech skill)
        options.push(
            ChoicesUtil.requireStat(
                'Force it open (need 60+ strength)',
                'strength',
                '>=',
                60,
                'roomInside',
                () => StatsUtil.add('health', -5)
            )
        );
        
        // Requires intellect
        options.push(
            ChoicesUtil.requireStat(
                'Hack the lock (need 70+ intellect)',
                'intellect',
                '>=',
                70,
                'roomInside',
                () => StatsUtil.add('morale', 10)
            )
        );
        
        // Requires stealth
        options.push(
            ChoicesUtil.requireStat(
                'Sneak past (need 80+ stealth)',
                'stealth',
                '>=',
                80,
                'roomInside'
            )
        );
        
        options.push(ChoicesUtil.make('Leave', 'previousRoom'));
        
        return ChoicesUtil.filter(options);
    }
};

// ============================================
// 5. CONSEQUENCE CHAINS
// ============================================

const chainedConsequences = {
    text: 'A critical decision point...',
    
    choices: () => [
        {
            text: '💣 Destroy the reactor',
            next: 'ending',
            onSelect: () => {
                // Chain of consequences
                StatsUtil.add('morale', -20);
                gameState.addToHistory({action: 'destroyed_reactor'});
                
                if (StatsUtil.get('reputation') >= 50) {
                    gameUI.showNotification('Your reputation cannot save you now.');
                    StatsUtil.add('reputation', -30);
                }
                
                StatsUtil.add('health', -40);
                
                setTimeout(() => {
                    gameUI.showNotification('The explosion is massive.');
                }, 300);
            }
        },
        {
            text: '🤝 Try to negotiate',
            next: 'negotiation',
            onSelect: () => {
                if (Math.random() > 0.5) {
                    StatsUtil.add('credits', 500);
                    gameUI.showNotification('They agree to pay you off!');
                } else {
                    StatsUtil.add('health', -20);
                    gameUI.showNotification('They refused and attacked!');
                }
            }
        }
    ]
};

// ============================================
// 6. INVENTORY/ITEM SYSTEM
// ============================================

const itemSystem = {
    text: () => {
        const inventory = gameState.getState().inventory || [];
        const text = `**Your inventory:**\n`;
        return text + (inventory.length > 0 ? inventory.join(', ') : '(empty)');
    },
    
    choices: () => [
        {
            text: 'Pick up the glowing artifact',
            next: 'currentScene',
            onSelect: () => {
                const inventory = gameState.getState().inventory || [];
                inventory.push('Golden Artifact');
                gameState.getState().inventory = inventory;
                gameUI.showNotification('Added: Golden Artifact');
            }
        },
        {
            text: 'Drop an item',
            next: 'currentScene',
            onSelect: () => {
                const inventory = gameState.getState().inventory || [];
                if (inventory.length > 0) {
                    inventory.pop();
                    gameUI.showNotification('Item dropped.');
                }
            }
        }
    ]
};

// ============================================
// 7. TIME-BASED PROGRESSION
// ============================================

const timeProgressionExample = {
    text: () => {
        const turn = gameState.getStat('turn') || 0;
        return `**Day ${turn + 1}**\n\nYou continue your journey...`;
    },
    
    choices: () => [
        {
            text: 'Rest and recover',
            next: 'dayPasses',
            onSelect: () => {
                StatsUtil.increment('turn');
                StatsUtil.add('health', 20);
                StatsUtil.add('fuel', -5);
                
                if (StatsUtil.get('turn') >= 10) {
                    gameState.setScene('ending');
                }
            }
        },
        {
            text: 'Push hard',
            next: 'dayPasses',
            onSelect: () => {
                StatsUtil.increment('turn');
                StatsUtil.add('health', -10);
                StatsUtil.add('fuel', -15);
            }
        }
    ]
};

// ============================================
// 8. DYNAMIC STORY BASED ON HISTORY
// ============================================

const historyReactiveScene = {
    text: () => {
        const history = gameState.getHistory();
        const hasAttacked = history.some(entry => 
            entry.choice && entry.choice.includes('Attack')
        );
        const hasMade = history.length;
        
        const intro = 'A final scene...';
        const context = hasAttacked 
            ? '\nThe people fear you.'
            : '\nThe people trust you.';
        
        return intro + context + `\n\nYou\'ve made ${hasMade} major choices.`;
    },
    
    choices: () => [
        ChoicesUtil.make('Finish the game', 'end')
    ]
};

// ============================================
// 9. MULTI-PHASE COMBAT
// ============================================

const multiPhaseCombat = {
    text: () => {
        const phase = gameState.getStat('combatPhase') ?? 1;
        const enemyHealth = gameState.getStat('enemyHealth') ?? 100;
        
        const phaseTexts = {
            1: 'The enemy charges at you!',
            2: 'The enemy is weakened but still dangerous!',
            3: 'The enemy is barely standing!'
        };
        
        return `${phaseTexts[phase]}\nEnemy Health: ${enemyHealth}%`;
    },
    
    choices: () => {
        const phase = gameState.getStat('combatPhase') ?? 1;
        const enemyHealth = gameState.getStat('enemyHealth') ?? 100;
        
        if (enemyHealth <= 0) {
            return [ChoicesUtil.make('Victory!', 'afterCombat')];
        }
        
        return [
            {
                text: 'Attack',
                next: 'multiPhaseCombat',
                onSelect: () => {
                    const damage = Math.random() * 40;
                    StatsUtil.add('enemyHealth', -damage);
                    StatsUtil.add('health', -Math.random() * 15);
                    
                    if (StatsUtil.get('enemyHealth') < 0) {
                        StatsUtil.set('enemyHealth', 0);
                    }
                }
            },
            ChoicesUtil.make('Retreat', 'escape')
        ];
    }
};

// ============================================
// 10. ASYNC PATTERNS (Using setTimeout)
// ============================================

const dramaticReveal = {
    text: 'The door slowly opens...',
    
    setup: () => {
        // Prevent clicking while dramatic moment unfolds
        gameUI.setChoicesEnabled(false);
        
        setTimeout(() => {
            gameUI.displayText('You see... **THE TRUTH**. The galaxy trembles...');
        }, 1500);
        
        setTimeout(() => {
            gameUI.setChoicesEnabled(true);
        }, 3000);
    },
    
    choices: () => [
        ChoicesUtil.make('Process this information', 'reflection')
    ]
};

// Register all these scenes to use them:
// game.registerScenes({
//     multiPhase: multiPhaseCombat,
//     reputation: buildingReputation,
//     dramaticReveal: dramaticReveal,
//     // ... etc
// });
