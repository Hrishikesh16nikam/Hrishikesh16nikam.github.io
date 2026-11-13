// Project cards: boot animation when they scroll into view

// Project boot sequence: cards boot when they scroll into view, and
// each title "decrypts" from random characters into its real name.
(() => {
    const cards = document.querySelectorAll('.projects-grid .project-card');
    if (!cards.length || !('IntersectionObserver' in window)) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.documentElement.classList.add('proj-anim');
    if (reduced) {
        cards.forEach((c) => c.classList.add('booted'));
        return;
    }

    const GLYPHS = '01<>/\\{}[]#$%&*+=?ABCDEFXYZ';
    const decrypt = (el, startDelay) => {
        const finalText = el.textContent;
        el.setAttribute('aria-label', finalText);
        const total = 700;
        let start = null;
        const frame = (t) => {
            if (start === null) start = t;
            const progress = Math.min(1, (t - start) / total);
            const revealed = Math.floor(progress * finalText.length);
            let out = '';
            for (let i = 0; i < finalText.length; i++) {
                const ch = finalText[i];
                out += i < revealed || ch === ' ' ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
            }
            el.textContent = out;
            if (progress < 1) requestAnimationFrame(frame);
            else el.textContent = finalText;
        };
        setTimeout(() => requestAnimationFrame(frame), startDelay);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const card = entry.target;
            observer.unobserve(card);
            card.classList.add('booted');
            const delay = parseFloat(getComputedStyle(card).getPropertyValue('--d')) || 0;
            const title = card.querySelector('.project-title');
            if (title) decrypt(title, delay * 1000 + 250);
        });
    }, { threshold: 0.15 });
    cards.forEach((c) => observer.observe(c));
})();
