const state = {
    stars: [],
    meteors: [],
    isSubmitting: false
};

document.addEventListener('DOMContentLoaded', function() {
    initStarfield();
    animateStarfield();
    initForm();
    initSectorsDropdown();
});

function initStarfield() {
    const canvas = document.getElementById('login-bg-canvas');
    if (!canvas) return;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    state.stars = [];
    for (let i = 0; i < 150; i++) {
        state.stars.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            size: Math.random() * 1.5 + 0.5,
            opacity: Math.random() * 0.7 + 0.3,
            speed: Math.random() * 0.03 + 0.01
        });
    }

    state.meteors = [];
}

function animateStarfield() {
    const canvas = document.getElementById('login-bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const spaceGrad = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 50,
        canvas.width / 2, canvas.height / 2, canvas.width
    );
    spaceGrad.addColorStop(0, '#04060d');
    spaceGrad.addColorStop(1, '#010204');
    ctx.fillStyle = spaceGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let s = 0; s < state.stars.length; s++) {
        const starObj = state.stars[s];
        ctx.fillStyle = 'rgba(255, 255, 255, ' + starObj.opacity + ')';
        ctx.beginPath();
        ctx.arc(starObj.x, starObj.y, starObj.size, 0, Math.PI * 2);
        ctx.fill();
        starObj.y += starObj.speed;
        if (starObj.y > canvas.height) {
            starObj.y = 0;
            starObj.x = Math.random() * canvas.width;
        }
    }

    if (Math.random() < 0.003 && state.meteors.length < 2) {
        state.meteors.push({
            x: Math.random() * canvas.width,
            y: Math.random() * (canvas.height / 3),
            length: Math.random() * 60 + 40,
            speed: Math.random() * 8 + 5,
            angle: Math.PI / 6 + (Math.random() * 0.1 - 0.05),
            opacity: 1.0,
            width: Math.random() * 1.2 + 0.6
        });
    }

    for (let i = state.meteors.length - 1; i >= 0; i--) {
        const m = state.meteors[i];
        const targetX = m.x - Math.cos(m.angle) * m.length;
        const targetY = m.y - Math.sin(m.angle) * m.length;
        const trailGrad = ctx.createLinearGradient(m.x, m.y, targetX, targetY);
        trailGrad.addColorStop(0.0, 'rgba(255, 255, 255, ' + m.opacity + ')');
        trailGrad.addColorStop(0.15, 'rgba(0, 242, 254, ' + (m.opacity * 0.85) + ')');
        trailGrad.addColorStop(1.0, 'rgba(0, 242, 254, 0)');
        ctx.strokeStyle = trailGrad;
        ctx.lineWidth = m.width;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(targetX, targetY);
        ctx.stroke();
        m.x += Math.cos(m.angle) * m.speed;
        m.y += Math.sin(m.angle) * m.speed;
        m.opacity -= 0.015;
        if (m.opacity <= 0 || m.x > canvas.width || m.y > canvas.height) {
            state.meteors.splice(i, 1);
        }
    }

    requestAnimationFrame(animateStarfield);
}

function initForm() {
    const form = document.getElementById('login-form');
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const togglePassword = document.getElementById('toggle-password');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const statusEl = document.getElementById('login-status');
    const statusText = document.getElementById('status-text');

    togglePassword.addEventListener('click', function() {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        this.querySelector('i').className = type === 'password' ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash';
    });

    emailInput.addEventListener('blur', function() {
        validateEmail(this, emailError);
    });

    emailInput.addEventListener('input', function() {
        if (this.value.length > 0) {
            validateEmail(this, emailError);
        } else {
            this.classList.remove('valid', 'invalid');
            emailError.classList.remove('visible');
        }
    });

    passwordInput.addEventListener('blur', function() {
        validatePassword(this, passwordError);
    });

    passwordInput.addEventListener('input', function() {
        if (this.value.length > 0) {
            validatePassword(this, passwordError);
        } else {
            this.classList.remove('valid', 'invalid');
            passwordError.classList.remove('visible');
        }
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        if (state.isSubmitting) return;

        const isEmailValid = validateEmail(emailInput, emailError);
        const isPasswordValid = validatePassword(passwordInput, passwordError);

        if (!isEmailValid || !isPasswordValid) {
            setStatus(statusEl, statusText, 'error', 'ERROR: Authentication credentials invalid');
            return;
        }

        state.isSubmitting = true;
        const submitBtn = form.querySelector('.login-submit');
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        submitBtn.querySelector('i').className = 'fa-solid fa-spinner';
        setStatus(statusEl, statusText, 'processing', 'PROCESSING: Verifying credentials...');

        setTimeout(function() {
            state.isSubmitting = false;
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            submitBtn.querySelector('i').className = 'fa-solid fa-rocket';
            setStatus(statusEl, statusText, 'success', 'AUTHENTICATED: Welcome to UniFacts Observatory');
            emailInput.classList.remove('valid', 'invalid');
            passwordInput.classList.remove('valid', 'invalid');
        }, 2500);
    });
}

function validateEmail(input, errorEl) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(input.value.trim());

    if (input.value.trim().length === 0) {
        input.classList.remove('valid', 'invalid');
        errorEl.classList.remove('visible');
        return false;
    }

    if (isValid) {
        input.classList.remove('invalid');
        input.classList.add('valid');
        errorEl.classList.remove('visible');
        return true;
    } else {
        input.classList.remove('valid');
        input.classList.add('invalid');
        errorEl.classList.add('visible');
        return false;
    }
}

function validatePassword(input, errorEl) {
    const isValid = input.value.length >= 6;

    if (input.value.length === 0) {
        input.classList.remove('valid', 'invalid');
        errorEl.classList.remove('visible');
        return false;
    }

    if (isValid) {
        input.classList.remove('invalid');
        input.classList.add('valid');
        errorEl.classList.remove('visible');
        return true;
    } else {
        input.classList.remove('valid');
        input.classList.add('invalid');
        errorEl.classList.add('visible');
        return false;
    }
}

function setStatus(el, textEl, type, message) {
    el.className = 'login-status';
    if (type) {
        el.classList.add(type);
    }
    textEl.textContent = message;
}

function initSectorsDropdown() {
    const sectorsToggle = document.querySelector('.sectors-toggle');
    const sectorsContainer = document.querySelector('.sectors-dropdown-container');
    let dropdownOpenedByClick = false;
    let closeDropdownTimeout = null;

    if (sectorsToggle && sectorsContainer) {
        sectorsToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownOpenedByClick = true;
            if (closeDropdownTimeout) {
                clearTimeout(closeDropdownTimeout);
                closeDropdownTimeout = null;
            }
            sectorsContainer.classList.add('active');
        });

        sectorsContainer.addEventListener('mouseenter', function() {
            dropdownOpenedByClick = true;
            if (closeDropdownTimeout) {
                clearTimeout(closeDropdownTimeout);
                closeDropdownTimeout = null;
            }
        });

        sectorsContainer.addEventListener('mouseleave', function() {
            closeDropdownTimeout = setTimeout(function() {
                sectorsContainer.classList.remove('active');
                dropdownOpenedByClick = false;
            }, 200);
        });

        const dropdownLinks = sectorsContainer.querySelectorAll('.sectors-dropdown-menu a');
        for (let i = 0; i < dropdownLinks.length; i++) {
            dropdownLinks[i].addEventListener('click', function() {
                sectorsContainer.classList.remove('active');
                dropdownOpenedByClick = false;
            });
        }

        document.addEventListener('click', function(e) {
            if (sectorsContainer && !sectorsContainer.contains(e.target)) {
                sectorsContainer.classList.remove('active');
                dropdownOpenedByClick = false;
                if (closeDropdownTimeout) {
                    clearTimeout(closeDropdownTimeout);
                    closeDropdownTimeout = null;
                }
            }
        });
    }
}
