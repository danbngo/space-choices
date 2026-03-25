/**
 * BoardDisplay
 * Manages the #board-display area: shows cards, dice, and markers
 * in labeled sections, rows, or grids.
 *
 * The container is looked up lazily on each access, so it is safe
 * to create a BoardDisplay instance before DOMContentLoaded.
 */
class BoardDisplay {
    /**
     * @param {string} containerId - id of the HTML container element
     */
    constructor(containerId) {
        this._containerId = containerId;
    }

    /** @returns {HTMLElement|null} */
    get container() {
        return document.getElementById(this._containerId);
    }

    /**
     * Remove all board content.
     * @returns {BoardDisplay} this (chainable)
     */
    clear() {
        if (this.container) this.container.innerHTML = '';
        return this;
    }

    /**
     * Display a single card.
     * @param {Card} card
     * @param {Object} [options]
     * @param {string} [options.label] - Section header text
     * @returns {BoardDisplay}
     */
    showCard(card, options = {}) {
        const section = this._section(options.label ?? '');
        section.appendChild(card.toElement());
        return this;
    }

    /**
     * Display a horizontal scrollable row of cards.
     * @param {Card[]} cards
     * @param {Object} [options]
     * @param {string} [options.label]
     * @returns {BoardDisplay}
     */
    showCardRow(cards, options = {}) {
        const section = this._section(options.label ?? '');
        const row = document.createElement('div');
        row.className = 'board-row';
        cards.forEach(c => row.appendChild(c.toElement()));
        section.appendChild(row);
        return this;
    }

    /**
     * Display a grid of cards.
     * @param {Card[]} cards
     * @param {number} [cols=3]  - Number of columns
     * @param {Object} [options]
     * @param {string} [options.label]
     * @returns {BoardDisplay}
     */
    showCardGrid(cards, cols = 3, options = {}) {
        const section = this._section(options.label ?? '');
        const grid = document.createElement('div');
        grid.className = 'board-grid';
        grid.style.gridTemplateColumns = `repeat(${cols}, auto)`;
        cards.forEach(c => grid.appendChild(c.toElement()));
        section.appendChild(grid);
        return this;
    }

    /**
     * Display dice with an optional Roll All button.
     * @param {Die[]} dice
     * @param {Object} [options]
     * @param {string}  [options.label]
     * @param {boolean} [options.rollAllBtn=true]
     * @returns {BoardDisplay}
     */
    showDice(dice, options = {}) {
        const section = this._section(options.label ?? '');
        const row = document.createElement('div');
        row.className = 'board-row board-dice-row';

        dice.forEach(d => row.appendChild(d.toElement()));

        if (options.rollAllBtn !== false) {
            const btn = document.createElement('button');
            btn.className = 'dice-roll-btn';
            btn.textContent = '[ ROLL ALL ]';
            btn.onclick = () => dice.forEach(d => d.roll());
            row.appendChild(btn);
        }

        section.appendChild(row);
        return this;
    }

    /**
     * Display a row of markers.
     * @param {Marker[]} markers
     * @param {Object} [options]
     * @param {string} [options.label]
     * @returns {BoardDisplay}
     */
    showMarkers(markers, options = {}) {
        const section = this._section(options.label ?? '');
        const row = document.createElement('div');
        row.className = 'board-row board-markers-row';
        markers.forEach(m => row.appendChild(m.toElement()));
        section.appendChild(row);
        return this;
    }

    /**
     * Display any mix of Card / Die / Marker objects in a single row.
     * @param {Array<Card|Die|Marker>} elements
     * @param {Object} [options]
     * @param {string} [options.label]
     * @returns {BoardDisplay}
     */
    showRow(elements, options = {}) {
        const section = this._section(options.label ?? '');
        const row = document.createElement('div');
        row.className = 'board-row';
        elements.forEach(el => {
            if (el && typeof el.toElement === 'function') {
                row.appendChild(el.toElement());
            } else if (el instanceof HTMLElement) {
                row.appendChild(el);
            }
        });
        section.appendChild(row);
        return this;
    }

    // ── Private ──────────────────────────────────────────────────

    /**
     * Append a labeled section wrapper to the container and return it.
     * @param {string} label
     * @returns {HTMLElement}
     */
    _section(label) {
        const section = document.createElement('div');
        section.className = 'board-section';
        if (label) {
            const labelEl = document.createElement('div');
            labelEl.className = 'board-section-label';
            labelEl.textContent = label;
            section.appendChild(labelEl);
        }
        this.container?.appendChild(section);
        return section;
    }
}

// Global board instance — backed by <div id="board-display">
const board = new BoardDisplay('board-display');
