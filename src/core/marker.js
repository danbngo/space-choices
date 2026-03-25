/**
 * Marker
 * A labeled value tracker displayed as one of three styles:
 *   'bar'   — horizontal fill bar (requires max)
 *   'pips'  — row of filled/empty squares (requires max)
 *   'badge' — just a large number (no max needed)
 *
 * A single DOM element is cached; calling setValue() / increment() /
 * decrement() updates it live without re-mounting.
 */
class Marker {
    /**
     * @param {Object} [options]
     * @param {string}  [options.label='']         - Label shown above the value
     * @param {number}  [options.value=0]           - Starting value
     * @param {number|null} [options.max=null]      - Maximum (required for bar / pips)
     * @param {string}  [options.color='#00ff00']   - CSS accent color
     * @param {'bar'|'pips'|'badge'} [options.style='bar']
     */
    constructor({ label = '', value = 0, max = null, color = '#00ff00', style = 'bar' } = {}) {
        this.label   = label;
        this.value   = value;
        this.max     = max;
        this.color   = color;
        this.style   = style;
        this._element = null;
    }

    /**
     * Set value, clamped to [0, max] when max is defined.
     * @param {number} v
     * @returns {number} new value
     */
    setValue(v) {
        this.value = (this.max !== null) ? Math.max(0, Math.min(this.max, v)) : v;
        this._refresh();
        return this.value;
    }

    /** @param {number} [amount=1] @returns {number} */
    increment(amount = 1) { return this.setValue(this.value + amount); }

    /** @param {number} [amount=1] @returns {number} */
    decrement(amount = 1) { return this.setValue(this.value - amount); }

    /**
     * Return the DOM element for this marker.
     * The same element is returned on every call — it updates in-place
     * when the value changes, so you can append it once and forget it.
     * @returns {HTMLElement}
     */
    toElement() {
        if (!this._element) {
            this._element = document.createElement('div');
            this._element.className = `marker marker-style-${this.style}`;
            this._element.style.setProperty('--marker-color', this.color);
        }
        this._render();
        return this._element;
    }

    /**
     * Detach the cached element so the next toElement() builds a fresh one.
     * Useful if you need to place the marker in a different container.
     */
    detach() {
        this._element = null;
    }

    // ── Private ──────────────────────────────────────────────────

    _render() {
        if (!this._element) return;
        this._element.innerHTML = '';

        // Label
        const labelEl = document.createElement('div');
        labelEl.className = 'marker-label';
        labelEl.textContent = this.label;
        this._element.appendChild(labelEl);

        // Bar
        if (this.style === 'bar' && this.max !== null) {
            const pct = Math.max(0, Math.min(100, (this.value / this.max) * 100));
            const track = document.createElement('div');
            track.className = 'marker-bar-track';
            const fill = document.createElement('div');
            fill.className = 'marker-bar-fill';
            fill.style.width = `${pct}%`;
            track.appendChild(fill);
            this._element.appendChild(track);
        }

        // Pips
        if (this.style === 'pips' && this.max !== null) {
            const pipsEl = document.createElement('div');
            pipsEl.className = 'marker-pips';
            for (let i = 0; i < this.max; i++) {
                const pip = document.createElement('div');
                pip.className = `marker-pip${i < this.value ? ' filled' : ''}`;
                pipsEl.appendChild(pip);
            }
            this._element.appendChild(pipsEl);
        }

        // Value label
        const valEl = document.createElement('div');
        valEl.className = 'marker-value-display';
        valEl.textContent = this.max !== null ? `${this.value} / ${this.max}` : String(this.value);
        this._element.appendChild(valEl);
    }

    _refresh() {
        if (this._element) this._render();
    }
}
