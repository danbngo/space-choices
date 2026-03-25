/**
 * Card
 * Represents a game card with a title, body text, an optional
 * top-right value badge, and a colored border.
 */
class Card {
    /**
     * @param {Object} [options]
     * @param {string} [options.title='']              - Displayed at top-left
     * @param {string} [options.text='']               - Body / flavor text
     * @param {number|string|null} [options.value=null] - Badge in top-right corner
     * @param {string} [options.borderColor='#00ff00'] - CSS color for border & accents
     * @param {string|null} [options.id=null]          - Optional identifier stored as data-card-id
     */
    constructor({ title = '', text = '', value = null, borderColor = '#00ff00', id = null } = {}) {
        this.title       = title;
        this.text        = text;
        this.value       = value;
        this.borderColor = borderColor;
        this.id          = id;
    }

    /**
     * Build and return a DOM element for this card.
     * Each call creates a new element — call clone() first if you need two
     * independent copies of the same card on screen.
     * @returns {HTMLElement}
     */
    toElement() {
        const el = document.createElement('div');
        el.className = 'card';
        el.style.setProperty('--card-border-color', this.borderColor);
        if (this.id !== null) el.dataset.cardId = this.id;

        // ── Header row ────────────────────────────────────────────
        const header = document.createElement('div');
        header.className = 'card-header';

        const titleEl = document.createElement('div');
        titleEl.className = 'card-title';
        titleEl.textContent = this.title;
        header.appendChild(titleEl);

        if (this.value !== null && this.value !== undefined) {
            const valueEl = document.createElement('div');
            valueEl.className = 'card-value';
            valueEl.textContent = this.value;
            header.appendChild(valueEl);
        }

        el.appendChild(header);

        // ── Divider ───────────────────────────────────────────────
        if (this.title && this.text) {
            const hr = document.createElement('hr');
            hr.className = 'card-divider';
            el.appendChild(hr);
        }

        // ── Body text ─────────────────────────────────────────────
        if (this.text) {
            const textEl = document.createElement('div');
            textEl.className = 'card-text';
            textEl.innerHTML = this.text.replace(/\n/g, '<br>');
            el.appendChild(textEl);
        }

        return el;
    }

    /** @returns {Card} A new Card with identical properties. */
    clone() {
        return new Card({
            title:       this.title,
            text:        this.text,
            value:       this.value,
            borderColor: this.borderColor,
            id:          this.id,
        });
    }
}
