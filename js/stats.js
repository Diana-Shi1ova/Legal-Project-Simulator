// Хранилище и работа со статами игры
const Stats = {
    keys: ["coins", "time", "quality", "risk"],

    load() {
        this.keys.forEach(k => {
            if (sessionStorage.getItem(k) === null) {
                sessionStorage.setItem(k, 0);
            }
        });
        this.render();
    },

    get(key) {
        return Number(sessionStorage.getItem(key) || 0);
    },

    set(key, val) {
        sessionStorage.setItem(key, val);
        this.render();
    },

    add(key, val) {
        const current = this.get(key);
        this.set(key, current + val);
    },

    render() {
        this.keys.forEach(k => {
            const el = document.getElementById(k);
            if (el) el.textContent = this.get(k);
        });
    }
};

window.addEventListener("load", () => Stats.load());
