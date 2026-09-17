const Utils = {
    pad2(n) { return String(n).padStart(2, '0'); },
    nextFrame() {
        return new Promise(resolve =>
            requestAnimationFrame(() => requestAnimationFrame(resolve))
        );
    },
    sleep(ms) { return new Promise(r => setTimeout(r, ms)); },
    debounce(fn, wait = 150) {
        let t;
        return (...args) => {
            clearTimeout(t);
            t = setTimeout(() => fn.apply(this, args), wait);
        };
    },
    buildFallbackName() {
        const now = new Date();
        const date = `${now.getFullYear()}-${Utils.pad2(now.getMonth() + 1)}-${Utils.pad2(now.getDate())}`;
        const time = `${Utils.pad2(now.getHours())}-${Utils.pad2(now.getMinutes())}`;
        return `${I18n.t('fallbackPdfName')} ${date} ${time}`;
    },
    sanitizeFilename(s) {
        return String(s).replace(/[\\/:*?"<>|]+/g, '_').replace(/\s+/g, ' ').trim();
    },

    formatDuration(startInternal, endInternal) {
        const parse = (s) => {
            const m = String(s).match(/^(\d{4})\/(\d{2})\/(\d{2})_(\d{2}):(\d{2}):(\d{2})/);
            if (!m) return null;
            return new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]);
        };

        const start = parse(startInternal);
        const end = parse(endInternal);
        if (!start || !end) return '';

        const diffMs = end.getTime() - start.getTime();
        if (diffMs <= 0) return '';

        const totalMin = Math.round(diffMs / 60000);
        const totalHours = Math.floor(totalMin / 60);
        const minutes = totalMin % 60;

        const parts = [];
        if (totalHours > 0) parts.push(`${totalHours}h`);
        if (minutes > 0 || parts.length === 0) parts.push(`${minutes}min`);

        return parts.join(' ');
    }
};

const Toast = {
    el: null, timer: null,
    init() { this.el = document.getElementById('toast'); },
    show(msg, type = 'info', duration = 4000) {
        if (!this.el) return;
        this.el.textContent = msg;
        this.el.className = 'toast show ' + type;
        clearTimeout(this.timer);
        this.timer = setTimeout(() => { this.el.className = 'toast ' + type; }, duration);
    },
    success(msg) { this.show(msg, 'success'); },
    error(msg) { this.show(msg, 'error'); },
    info(msg) { this.show(msg, 'info'); }
};

const Debug = {
    panel: null, content: null,
    init() {
        this.panel = document.getElementById('debugPanel');
        this.content = document.getElementById('debugContent');
    },
    log(html) { if (this.content) this.content.innerHTML = html; },
    toggle() { if (this.panel) this.panel.classList.toggle('show'); },
    close() { if (this.panel) this.panel.classList.remove('show'); }
};