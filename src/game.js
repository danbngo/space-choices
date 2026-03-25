/**
 * game.js
 * Board game demo — ship markers, a dice pool, and a card hand.
 * Delete / replace the scene definitions below to build your own game.
 */

// ============================================================
// PERSISTENT GAME OBJECTS
// These live outside gameState so they survive scene reloads.
// ============================================================

const hull    = new Marker({ label: 'HULL',    value: 10, max: 10, color: '#00ff00', style: 'bar'   });
const shields = new Marker({ label: 'SHIELDS', value: 4,  max: 5,  color: '#00aaff', style: 'pips'  });
const fuel    = new Marker({ label: 'FUEL',    value: 8,  max: 10, color: '#ffaa00', style: 'bar'   });
const credits = new Marker({ label: 'CREDITS', value: 1200,        color: '#ffff00', style: 'badge' });

const dicePool = [new Die(6), new Die(6), new Die(8), new Die(20)];

// ── Card definitions ─────────────────────────────────────────

const ALL_CARDS = [
    new Card({ title: 'ASTEROID BELT',   text: 'A dense field of tumbling rock and ice rings the jump point.',   value: 5, borderColor: '#ff6600' }),
    new Card({ title: 'SPACE STATION',   text: 'Refuel, repair, and resupply. But nothing here is free.',        value: 3, borderColor: '#00aaff' }),
    new Card({ title: 'PIRATE AMBUSH',   text: 'Lock weapons. They demand your cargo before they fire.',          value: 8, borderColor: '#ff2222' }),
    new Card({ title: 'NEBULA DRIFT',    text: 'Sensors fail inside the cloud. Navigation is guesswork.',         value: 2, borderColor: '#aa00ff' }),
    new Card({ title: 'DISTRESS SIGNAL', text: 'A ship is broadcasting on all channels. Reward unknown.',         value: 4, borderColor: '#ffff00' }),
    new Card({ title: 'DERELICT HULK',   text: 'Salvage opportunity. Someone — or something — got here first.',   value: 6, borderColor: '#888888' }),
    new Card({ title: 'WARP GATE',       text: 'An unlisted jump gate. One-way. Destination uncertain.',          value: 1, borderColor: '#00ffcc' }),
    new Card({ title: 'SOLAR STORM',     text: 'Radiation spikes. Shields drain fast. Navigate or take the hit.', value: 7, borderColor: '#ff4400' }),
];

function dealHand(n = 4) {
    const deck = ALL_CARDS.map(c => c.clone());
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck.slice(0, n);
}

// ── Board render ─────────────────────────────────────────────

function renderBoard(hand) {
    board.clear();
    board.showMarkers([hull, shields, fuel, credits], { label: 'SHIP STATUS' });
    board.showDice(dicePool,                           { label: 'DICE POOL'   });
    board.showCardRow(hand,                            { label: 'HAND'        });
}

// ============================================================
// SCENES
// ============================================================

const sceneStart = {
    text: `**SPACE CHOICES — BOARD ENGINE**\n\nClick any die to roll it. Use [ ROLL ALL ] to roll the pool.\nHover a card to inspect it.\n\nSelect an action below to test the board systems.`,

    setup() {
        renderBoard(dealHand(4));
    },

    choices: [
        {
            text: '[ DEAL NEW HAND ]',
            next: 'start',
            onSelect: () => {}
        },
        {
            text: '[ TAKE DAMAGE  — hull -2, shields -1 ]',
            next: 'start',
            onSelect: () => { hull.decrement(2); shields.decrement(1); }
        },
        {
            text: '[ REPAIR SHIP  — hull +3, costs 200cr ]',
            next: 'start',
            onSelect: () => { hull.increment(3); credits.decrement(200); }
        },
        {
            text: '[ REFUEL       — fuel +4, costs 150cr ]',
            next: 'start',
            onSelect: () => { fuel.increment(4); credits.decrement(150); }
        },
        {
            text: '[ COLLECT CARGO — credits +300 ]',
            next: 'start',
            onSelect: () => { credits.increment(300); }
        },
        {
            text: '[ VIEW FULL ENCOUNTER DECK ]',
            next: 'deck'
        },
        {
            text: '[ RESET GAME ]',
            next: 'start',
            onSelect: () => {
                hull.setValue(10);
                shields.setValue(4);
                fuel.setValue(8);
                credits.setValue(1200);
                dicePool.forEach(d => d.reset());
            }
        }
    ]
};

const sceneDeck = {
    text: `**ENCOUNTER DECK** — All ${ALL_CARDS.length} card types.`,

    setup() {
        board.clear();
        board.showCardGrid(ALL_CARDS.map(c => c.clone()), 4, { label: 'ENCOUNTER CARDS' });
    },

    choices: [
        { text: '[ BACK ]', next: 'start' }
    ]
};

// ============================================================
// INIT
// ============================================================

function initializeGame() {
    game.registerScenes({
        start: sceneStart,
        deck:  sceneDeck,
    });
    game.start('start');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGame);
} else {
    initializeGame();
}
