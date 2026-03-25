/**
 * Die
 * A die with an arbitrary number of sides (minimum 3).
 *
 * Rendered elements are tracked so that calling roll() updates every
 * element that is still in the document, without needing external refs.
 * Stale / detached elements are pruned automatically.
 */
class Die {
    /**
     * @param {number} [sides=6] - Number of sides (must be >= 3)
     */
    constructor(sides = 6) {
        if (!Number.isInteger(sides) || sides < 3) {
            throw new Error(`Die must have at least 3 sides (got ${sides}).`);
        }
        this.sides  = sides;
        this.value  = null;         // null = not yet rolled
        this._tracked = [];         // [{el, valueEl}] — live element refs
    }

    /**
     * Roll the die and update all rendered elements.
     * @returns {number} The result (1 … sides)
     */
    roll() {
        this.value = Math.floor(Math.random() * this.sides) + 1;
        this._sync();
        return this.value;
    }

    /**
     * Clear the rolled value and update all rendered elements.
     */
    reset() {
        this.value = null;
        this._sync();
    }

    /** @returns {boolean} */
    isRolled() {
        return this.value !== null;
    }

    /**
     * Build and return a DOM element.
     * Clicking it rolls the die. Multiple elements can exist simultaneously
     * (e.g. same die shown in two places); all update on roll().
     * @returns {HTMLElement}
     */
    toElement() {
        const el = document.createElement('div');
        el.className = `die ${this.value !== null ? 'rolled' : 'unrolled'}`;
        el.title = `d${this.sides} — click to roll`;

        const valueEl = document.createElement('div');
        valueEl.className = 'die-value';
        valueEl.textContent = this.value !== null ? this.value : '?';

        const labelEl = document.createElement('div');
        labelEl.className = 'die-label';
        labelEl.textContent = `d${this.sides}`;

        el.appendChild(valueEl);
        el.appendChild(labelEl);
        el.addEventListener('click', () => this.roll());

        this._tracked.push({ el, valueEl });
        return el;
    }

    // ── Private ──────────────────────────────────────────────────

    _sync() {
        // Prune detached elements first
        this._tracked = this._tracked.filter(({ el }) => document.contains(el));

        this._tracked.forEach(({ el, valueEl }) => {
            valueEl.textContent = this.value !== null ? this.value : '?';
            el.classList.toggle('rolled',   this.value !== null);
            el.classList.toggle('unrolled', this.value === null);

            // Trigger roll animation
            el.classList.add('rolling');
            setTimeout(() => el.classList.remove('rolling'), 220);
        });
    }
}
