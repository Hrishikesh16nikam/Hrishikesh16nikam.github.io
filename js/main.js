// Hrishikesh Nikam - portfolio interactions: boot screen, terminal, effects

// Cloudflare-style obfuscation, decoded locally so it works off Cloudflare too
function cfDecode(hex) {
    const key = parseInt(hex.slice(0, 2), 16);
    let out = '';
    for (let i = 2; i < hex.length; i += 2) {
        out += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16) ^ key);
    }
    return out;
}

// Rewrite every obfuscated address into a real, clickable mailto link
function revealEmails() {
    document.querySelectorAll('.__cf_email__').forEach(el => {
        const hex = el.getAttribute('data-cfemail');
        if (!hex) return;
        let address;
        try {
            address = cfDecode(hex);
        } catch (err) {
            return;
        }
        const link = document.createElement('a');
        link.href = 'mailto:' + address;
        link.textContent = address;
        link.className = el.className.replace('__cf_email__', '').trim();
        el.replaceWith(link);
    });

    document.querySelectorAll('a[href*="/cdn-cgi/l/email-protection#"]').forEach(el => {
        const hex = el.getAttribute('href').split('#')[1];
        if (!hex) return;
        try {
            el.setAttribute('href', 'mailto:' + cfDecode(hex));
        } catch (err) {
            /* leave the link alone if the payload is malformed */
        }
    });
}

// run now, and again once the DOM is parsed, so nothing later can block it
try { revealEmails(); } catch (err) { console.error('email decode failed', err); }
document.addEventListener('DOMContentLoaded', () => {
    try { revealEmails(); } catch (err) { console.error('email decode failed', err); }
});

// Matrix Rain Effect
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01';
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00ff41';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
    setInterval(drawMatrix, 50);
}

// Resize canvas
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Generate Floating Particles
const particlesContainer = document.getElementById("particles");
if (particlesContainer && !prefersReducedMotion) {
    for (let i = 0; i < 25; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";
        particle.style.left = Math.random() * 100 + "%";
        particle.style.animationDelay = Math.random() * 15 + "s";
        particle.style.animationDuration = (10 + Math.random() * 10) + "s";
        particlesContainer.appendChild(particle);
    }
}

// Optimized Custom Cursor - 60fps Performance
const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");

if (cursorDot && cursorRing) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    // Use transform instead of left/top for better performance
    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Instant dot movement using transform (GPU accelerated)
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    }, { passive: true });

    // Smooth ring follow with RAF
    function animateRing() {
        ringX += (mouseX - ringX) * 0.2;
        ringY += (mouseY - ringY) * 0.2;
        
        // Use transform for GPU acceleration
        cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
        
        requestAnimationFrame(animateRing);
    }
    animateRing();

    // Optimized hover effects with event delegation
    const interactiveElements = document.querySelectorAll("a, button, .terminal-window, .stat-box, .project-card, .skill-category");
    
    interactiveElements.forEach(el => {
        el.addEventListener("mouseenter", () => {
            cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) scale(2)`;
            cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) scale(1.5)`;
            cursorRing.style.borderColor = "var(--terminal-cyan)";
        }, { passive: true });
        
        el.addEventListener("mouseleave", () => {
            cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) scale(1)`;
            cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) scale(1)`;
            cursorRing.style.borderColor = "var(--terminal-green)";
        }, { passive: true });
    });
}

// Scroll Animation Observer
const scrollElements = document.querySelectorAll(".scroll-fade-up, .scroll-slide-right, .scroll-scale");

const elementInView = (el, offset = 100) => {
    const elementTop = el.getBoundingClientRect().top;
    return elementTop <= (window.innerHeight || document.documentElement.clientHeight) - offset;
};

const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
        if (elementInView(el, 100)) {
            el.classList.add("visible");
        }
    });
};

window.addEventListener("scroll", handleScrollAnimation);
handleScrollAnimation();

// 3D Tilt on Terminal Windows
const terminalWindows = document.querySelectorAll(".terminal-window:not(.no-tilt)");
terminalWindows.forEach(window => {
    window.addEventListener("mousemove", (e) => {
        const rect = window.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const angleX = (y - centerY) / 30;
        const angleY = (centerX - x) / 30;
        window.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-5px)`;
    });
    window.addEventListener("mouseleave", () => {
        window.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
    });
});

// Project cards: see the "Project boot sequence" script below.

// Ripple Effect
const buttons = document.querySelectorAll(".cmd-btn, .contact-link");
buttons.forEach(button => {
    button.addEventListener("click", function(e) {
        const ripple = document.createElement("span");
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        ripple.style.width = ripple.style.height = size + "px";
        ripple.style.left = x + "px";
        ripple.style.top = y + "px";
        ripple.classList.add("ripple");
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Terminal typing effect
const terminalText = document.querySelector('.typing-text');
if (terminalText) {
    setTimeout(() => {
        terminalText.innerHTML = '<span class="prompt">root@system:~$</span> cat profile.txt';
    }, 3000);
}

// Scroll progress meter + sticky nav highlighting
const progressBar = document.querySelector('.scroll-progress');
const topnav = document.querySelector('.topnav');
const navLinks = Array.from(document.querySelectorAll('.topnav a[href^="#"]'));
const navTargets = navLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

let uiQueued = false;

function updateScrollUI() {
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - doc.clientHeight;
    const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;

    if (progressBar) {
        progressBar.style.width = pct + '%';
    }

    if (topnav) {
        topnav.classList.toggle('scrolled', window.scrollY > 320);
    }

    let activeId = null;
    navTargets.forEach(section => {
        if (section.getBoundingClientRect().top <= 160) {
            activeId = section.id;
        }
    });

    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + activeId);
    });

    uiQueued = false;
}

window.addEventListener('scroll', () => {
    if (!uiQueued) {
        uiQueued = true;
        requestAnimationFrame(updateScrollUI);
    }
}, { passive: true });
updateScrollUI();

// Live clock in the nav status area
const navClock = document.getElementById('nav-clock');
if (navClock) {
    const tickClock = () => {
        navClock.textContent = new Date().toLocaleTimeString('en-US', { hour12: false });
    };
    tickClock();
    setInterval(tickClock, 1000);
}

// Count up the system metrics when they scroll into view
const countUp = (el) => {
    if (el.dataset.counted) return;
    el.dataset.counted = '1';

    const raw = el.textContent.trim();
    let first = -1;
    let last = -1;
    for (let i = 0; i < raw.length; i++) {
        const ch = raw.charAt(i);
        if (ch >= '0' && ch <= '9') {
            if (first === -1) first = i;
            last = i;
        }
    }
    if (first === -1 || prefersReducedMotion) return;

    const prefix = raw.slice(0, first);
    const numStr = raw.slice(first, last + 1);
    const suffix = raw.slice(last + 1);
    const target = parseFloat(numStr);
    const decimals = (numStr.split('.')[1] || '').length;
    const duration = 1100;
    const startTime = performance.now();

    const step = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            el.textContent = raw;
        }
    };

    requestAnimationFrame(step);
};

if ('IntersectionObserver' in window) {
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                countUp(entry.target);
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    document.querySelectorAll('.stat-number').forEach(el => statObserver.observe(el));
}


function getEmail() {
    const mailto = document.querySelector('a[href^="mailto:"]');
    if (mailto) return mailto.getAttribute('href').replace('mailto:', '');
    const span = document.querySelector('.__cf_email__');
    if (span && span.getAttribute('data-cfemail')) return cfDecode(span.getAttribute('data-cfemail'));
    const protectedLink = document.querySelector('a[href*="email-protection#"]');
    if (protectedLink) return cfDecode(protectedLink.getAttribute('href').split('#')[1]);
    return null;
}

// Toast
const copyToast = document.querySelector('.copy-toast');
let toastTimer = null;

function showToast(message) {
    if (!copyToast) return;
    copyToast.textContent = message;
    copyToast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => copyToast.classList.remove('show'), 1900);
}

function copyText(text, okMessage) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(
            () => showToast(okMessage),
            () => showToast(text)
        );
    } else {
        showToast(text);
    }
}

const copyEmailBtn = document.getElementById('copy-email');
if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
        const email = getEmail();
        if (email) {
            copyText(email, 'Copied ' + email);
        } else {
            showToast('Email unavailable, use the EMAIL link');
        }
    });
}

// Interactive shell
const shellOutput = document.getElementById('shell-output');
const shellInput = document.getElementById('shell-input');

if (shellOutput && shellInput) {
    const history = [];
    let historyIndex = 0;

    const write = (text, cls) => {
        const line = document.createElement('div');
        line.className = 'shell-line' + (cls ? ' ' + cls : '');
        if (cls === 'link') {
            line.className = 'shell-line';
            line.innerHTML = text;
        } else {
            line.textContent = text;
        }
        shellOutput.appendChild(line);
    };

    const writeAll = (lines) => lines.forEach(entry => {
        if (typeof entry === 'string') write(entry);
        else write(entry[0], entry[1]);
    });

    const commands = {
        help: () => [
            ['Available commands', 'head'],
            '  whoami        the short version',
            '  experience    roles, newest first',
            '  skills        tech stack',
            '  projects      selected work',
            '  resume        download the PDF',
            '  contact       email, LinkedIn, GitHub',
            '  email         copy the address to your clipboard',
            '  goto <name>   jump to metrics, stack, education, experience, projects, contact',
            '  neofetch      system summary',
            '  clear         wipe this screen'
        ],
        whoami: () => [
            ['Hrishikesh Nikam', 'head'],
            'Software engineer. MS Computer Engineering at Northeastern, Dec 2026,',
            'concentrating in computer networks and security.',
            '4+ years across full-stack products, cloud pipelines, and AI agent workflows.',
            'Most recently: Software Developer Intern at IBM, building AI-driven FedRAMP tooling.'
        ],
        experience: () => [
            ['Work history', 'head'],
            '  IBM         Software Developer Intern           Jun 2026 - Aug 2026',
            '  Cybersenz   Software Development Co-op          Jan 2026 - Jul 2026',
            '  Infosys     Technology Analyst                  Jul 2023 - Jul 2024',
            '  Infosys     Senior Systems Engineer             Jul 2022 - Jul 2023',
            '  Infosys     Systems Engineer                    Nov 2020 - Jul 2022',
            ['Run "goto experience" for the full write-up.', 'muted']
        ],
        skills: () => [
            ['Tech stack', 'head'],
            '  Languages   Python, C, C++, Java, JavaScript, TypeScript, Go',
            '  Networking  TCP/IP, DNS, DHCP, VPN, Wireshark, ns-3, routing',
            '  Cloud       AWS, Azure, Docker, containers, VMs, monitoring',
            '  Security    Threat analysis, SIEM, incident response, risk assessment',
            '  Engineering REST APIs, Git, CI/CD, Jenkins, Azure DevOps, testing',
            '  AI          Agentic workflows, MCP tooling, voice and intake agents',
            '  Compliance  FedRAMP, OSCAL, NIST SP 800-53, HIPAA-aligned PHI handling'
        ],
        projects: () => [
            ['Selected projects', 'head'],
            '  001  House Rota                      PWA, fair scheduler, Web Push on Cloudflare',
            '  002  Triage Inbox                    PII redaction, token rotation, HMAC audit log',
            '  003  L4/L7 Load Balancer             Go, health checks, least connections',
            '  004  Collaborative Editor (CRDT)     RGA CRDT, offline sync, WebSockets',
            '  005  DevOps Networking Automation    C++, sockets, 96% stable throughput',
            '  006  Reliable Transport Protocols    ABT, GBN, SR at 99.1% delivery',
            ['Run "goto projects" for details.', 'muted']
        ],
        contact: () => [
            ['Contact', 'head'],
            ['  LinkedIn  <a href="https://www.linkedin.com/in/hrishi16/" target="_blank" rel="noopener">linkedin.com/in/hrishi16</a>', 'link'],
            ['  GitHub    <a href="https://github.com/Hrishikesh16nikam" target="_blank" rel="noopener">github.com/Hrishikesh16nikam</a>', 'link'],
            '  Location  Boston, MA',
            ['Run "email" to copy the address.', 'muted']
        ],
        neofetch: () => [
            ['  visitor@hrishikesh', 'head'],
            '  ------------------',
            '  OS       Portfolio OS v2.0',
            '  Host     Boston, MA',
            '  Role     Software Engineer',
            '  Uptime   4+ years in industry',
            '  Focus    Networks, security, cloud, AI agents',
            '  Status   Open to opportunities',
            '  Shell    bash (this one)'
        ],
        sudo: () => [['Permission denied. Nice try though.', 'err']]
    };

    const run = (input) => {
        const trimmed = input.trim();
        if (!trimmed) return;

        write('visitor@hrishikesh:~$ ' + trimmed, 'cmd');

        const parts = trimmed.split(' ').filter(Boolean);
        const verb = parts[0].toLowerCase();
        const arg = (parts[1] || '').toLowerCase().replace('#', '');

        if (verb === 'clear') {
            shellOutput.innerHTML = '';
            return;
        }

        if (verb === 'cat' || verb === 'open') {
            const target = arg.split('.')[0];
            if (commands[target]) {
                writeAll(commands[target]());
                return;
            }
            write('cat: ' + (arg || '?') + ': no such file', 'err');
            return;
        }

        if (verb === 'ls') {
            write('experience  skills  projects  contact  resume  neofetch');
            return;
        }

        if (verb === 'email') {
            const email = getEmail();
            if (email) {
                copyText(email, 'Copied ' + email);
                write(email + ' copied to clipboard');
            } else {
                write('Email unavailable, use the EMAIL button above', 'err');
            }
            return;
        }

        if (verb === 'resume') {
            write('Downloading resume.pdf ...');
            const link = document.createElement('a');
            link.href = 'resume.pdf';
            link.download = 'Hrishikesh_Nikam_Resume.pdf';
            document.body.appendChild(link);
            link.click();
            link.remove();
            return;
        }

        if (verb === 'goto') {
            const target = document.getElementById(arg);
            if (target) {
                write('Jumping to ' + arg + ' ...');
                target.scrollIntoView({ behavior: 'smooth' });
            } else {
                write('goto: unknown section "' + (arg || '') + '"', 'err');
            }
            return;
        }

        const alias = { stack: 'skills', work: 'experience', about: 'whoami', me: 'whoami' };
        const key = alias[verb] || verb;

        if (commands[key]) {
            writeAll(commands[key]());
        } else {
            write('command not found: ' + verb, 'err');
            write('Type "help" to see what works.', 'muted');
        }
    };

    shellInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const value = shellInput.value;
            if (value.trim()) {
                history.push(value);
                historyIndex = history.length;
            }
            run(value);
            shellInput.value = '';
            shellOutput.scrollTop = shellOutput.scrollHeight;
        } else if (e.key === 'ArrowUp') {
            if (historyIndex > 0) {
                historyIndex -= 1;
                shellInput.value = history[historyIndex];
                e.preventDefault();
            }
        } else if (e.key === 'ArrowDown') {
            if (historyIndex < history.length - 1) {
                historyIndex += 1;
                shellInput.value = history[historyIndex];
            } else {
                historyIndex = history.length;
                shellInput.value = '';
            }
            e.preventDefault();
        }
    });

    shellOutput.addEventListener('click', () => shellInput.focus());

    write('Portfolio OS v2.0 -- shell ready.', 'head');
    write('Type "help" for commands, or try "whoami".', 'muted');
}
