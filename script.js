// Lock Screen System
const lockScreen = document.getElementById('lockScreen');
const mainContent = document.getElementById('mainContent');
let dialValues = [0, 0, 0, 0]; // Inicializar zerado

// Verificar se já foi desbloqueado (usando sessionStorage para manter durante a sessão)
if (sessionStorage.getItem('siteUnlocked') === 'true') {
    if (lockScreen) lockScreen.style.display = 'none';
    if (mainContent) mainContent.style.display = 'block';
} else {
    // Mostrar tela de bloqueio
    if (lockScreen) lockScreen.style.display = 'flex';
    if (mainContent) mainContent.style.display = 'none';
    document.body.style.overflow = 'hidden';
}

// Inicializar valores dos discos
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('dial1')) {
        document.getElementById('dial1').textContent = dialValues[0];
        document.getElementById('dial2').textContent = dialValues[1];
        document.getElementById('dial3').textContent = dialValues[2];
        document.getElementById('dial4').textContent = dialValues[3];
    }
});

function changeDial(dialIndex, direction) {
    const dial = document.getElementById(`dial${dialIndex}`);
    dialValues[dialIndex - 1] += direction;
    
    // Limitar entre 0 e 9
    if (dialValues[dialIndex - 1] < 0) dialValues[dialIndex - 1] = 9;
    if (dialValues[dialIndex - 1] > 9) dialValues[dialIndex - 1] = 0;
    
    dial.textContent = dialValues[dialIndex - 1];
    
    // Animação
    dial.style.transform = 'scale(1.2)';
    setTimeout(() => {
        dial.style.transform = 'scale(1)';
    }, 200);
}

function createUnlockAnimation() {
    // Criar container para partículas
    const particleContainer = document.createElement('div');
    particleContainer.id = 'particleContainer';
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 10001;
        background: rgba(0, 0, 0, 0.8);
    `;
    document.body.appendChild(particleContainer);
    
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const particleCount = 500;
    const particles = [];
    
    // Criar partículas iniciais (explosão)
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'unlock-particle';
        const angle = (Math.PI * 2 * i) / particleCount;
        const distance = 50 + Math.random() * 200;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        const colors = ['#ff6b9d', '#ff8fab', '#ffb3c1', '#ffd6e0', '#ffffff', '#fff5f8'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.cssText = `
            position: absolute;
            width: ${4 + Math.random() * 4}px;
            height: ${4 + Math.random() * 4}px;
            background: ${color};
            border-radius: 50%;
            left: ${centerX}px;
            top: ${centerY}px;
            box-shadow: 0 0 ${6 + Math.random() * 4}px ${color};
            opacity: 0;
        `;
        
        particleContainer.appendChild(particle);
        particles.push({
            element: particle,
            targetX: x,
            targetY: y,
            color: color
        });
    }
    
    // Fase 1: Explosão (0-1s)
    setTimeout(() => {
        particles.forEach((p, i) => {
            setTimeout(() => {
                p.element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                p.element.style.left = p.targetX + 'px';
                p.element.style.top = p.targetY + 'px';
                p.element.style.opacity = '1';
            }, i * 2);
        });
    }, 100);
    
    // Fase 2: Formar coração (1.5s - 2.5s)
    setTimeout(() => {
        const heartPoints = generateHeartPoints(centerX, centerY, 200);
        particles.forEach((p, i) => {
            if (i < heartPoints.length) {
                const point = heartPoints[i];
                setTimeout(() => {
                    p.element.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
                    p.element.style.left = point.x + 'px';
                    p.element.style.top = point.y + 'px';
                    p.element.style.width = '6px';
                    p.element.style.height = '6px';
                    p.element.style.boxShadow = `0 0 8px ${p.color}, 0 0 12px ${p.color}`;
                }, i * 2);
            } else if (i < particleCount * 0.8) {
                // Partículas extras formam brilho ao redor
                const angle = (Math.PI * 2 * i) / particleCount;
                const distance = 250 + Math.random() * 50;
                const x = centerX + Math.cos(angle) * distance;
                const y = centerY + Math.sin(angle) * distance;
                setTimeout(() => {
                    p.element.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
                    p.element.style.left = x + 'px';
                    p.element.style.top = y + 'px';
                    p.element.style.opacity = '0.3';
                }, i * 2);
            }
        });
    }, 1500);
    
    // Fase 3: Formar texto "eu te amo" (3s - 4.5s)
    setTimeout(() => {
        const textPoints = generateTextPoints(centerX, centerY, 'eu te amo');
        particles.forEach((p, i) => {
            if (i < textPoints.length && textPoints[i]) {
                const point = textPoints[i];
                setTimeout(() => {
                    p.element.style.transition = 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
                    p.element.style.left = point.x + 'px';
                    p.element.style.top = point.y + 'px';
                    p.element.style.width = '5px';
                    p.element.style.height = '5px';
                }, i * 2);
            } else if (i >= textPoints.length) {
                // Partículas extras desaparecem
                p.element.style.transition = 'opacity 0.5s ease';
                p.element.style.opacity = '0';
            }
        });
    }, 3000);
    
    // Fase 4: Fade out e remover (4.5s+)
    setTimeout(() => {
        particleContainer.style.transition = 'opacity 0.8s ease';
        particleContainer.style.opacity = '0';
        setTimeout(() => {
            particleContainer.remove();
        }, 800);
    }, 4500);
}

function generateHeartPoints(centerX, centerY, size) {
    const points = [];
    const step = 0.02;
    
    for (let t = 0; t <= 2 * Math.PI; t += step) {
        // Fórmula paramétrica do coração (ajustada)
        const scale = size / 20;
        const x = centerX + scale * 16 * Math.pow(Math.sin(t), 3);
        const y = centerY - scale * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
        
        // Adicionar todos os pontos para formar coração completo
        points.push({ x: x, y: y });
    }
    
    // Retornar apenas alguns pontos para não sobrecarregar
    return points.filter((_, i) => i % 3 === 0);
}

function generateTextPoints(centerX, centerY, text) {
    const points = [];
    const fontSize = 100;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Configurar fonte
    ctx.font = `bold ${fontSize}px 'Dancing Script', cursive`;
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Desenhar texto no canvas
    ctx.fillText(text, centerX, centerY);
    
    // Extrair pontos do texto desenhado
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const step = 4; // Espaçamento entre partículas
    
    // Área aproximada do texto
    const textWidth = ctx.measureText(text).width;
    const textHeight = fontSize * 1.2;
    const startX = Math.max(0, centerX - textWidth / 2 - 50);
    const endX = Math.min(canvas.width, centerX + textWidth / 2 + 50);
    const startY = Math.max(0, centerY - textHeight / 2 - 20);
    const endY = Math.min(canvas.height, centerY + textHeight / 2 + 20);
    
    for (let y = startY; y < endY; y += step) {
        for (let x = startX; x < endX; x += step) {
            const index = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
            if (index >= 0 && index < imageData.data.length) {
                // Verificar se o pixel tem cor (alpha > 128)
                if (imageData.data[index + 3] > 128) {
                    points.push({ x: x, y: y });
                }
            }
        }
    }
    
    // Se não gerou pontos suficientes, criar pontos baseados na forma do texto
    if (points.length < 100) {
        // Criar pontos simples baseados no texto
        const textWidth2 = ctx.measureText(text).width;
        const charWidth = textWidth2 / text.length;
        let currentX = centerX - textWidth2 / 2;
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const charWidth2 = ctx.measureText(char).width;
            
            // Criar pontos para cada letra
            for (let y = centerY - fontSize / 2; y < centerY + fontSize / 2; y += step * 2) {
                for (let x = currentX; x < currentX + charWidth2; x += step) {
                    points.push({ x: x, y: y });
                }
            }
            
            currentX += charWidth;
        }
    }
    
    return points;
}

function unlockSite() {
    // A senha é a data do aniversário: 07/08 (DDMM)
    // Usar os valores dos 4 discos
    const enteredCode = dialValues.join(''); // Ex: "0708"
    
    // Código correto: 0708 (07 de Agosto)
    const correctCode = '0708';
    
    // Verificar se o código está correto
    const isValid = enteredCode === correctCode;
    
    if (isValid) {
        // Código correto!
        const lockError = document.getElementById('lockError');
        const lockMessage = document.getElementById('lockMessage');
        
        if (lockError) lockError.style.display = 'none';
        if (lockMessage) {
            lockMessage.innerHTML = `
                <p class="lock-title" style="color: #4caf50;">✅ Correto!</p>
                <p class="lock-subtitle">Abrindo nosso mundo... 💕</p>
            `;
        }
        
        // Animação de desbloqueio
        const lockIcon = document.querySelector('.lock-icon');
        if (lockIcon) {
            lockIcon.style.animation = 'unlockAnimation 1s ease';
        }
        
        // Criar animação de partículas (coração e texto)
        createUnlockAnimation();
        
        // Desbloquear após animação
        setTimeout(() => {
            if (lockScreen) {
                lockScreen.style.opacity = '0';
                lockScreen.style.transition = 'opacity 0.5s ease';
            }
            
            setTimeout(() => {
                if (lockScreen) lockScreen.style.display = 'none';
                if (mainContent) mainContent.style.display = 'block';
                document.body.style.overflow = '';
                
                // Salvar no sessionStorage
                sessionStorage.setItem('siteUnlocked', 'true');
                
                // Scroll para o topo
                window.scrollTo(0, 0);
            }, 500);
        }, 4000); // Aumentar tempo para permitir animação completa
        
    } else {
        // Código incorreto
        const lockError = document.getElementById('lockError');
        if (lockError) {
            lockError.style.display = 'block';
            lockError.style.animation = 'shake 0.5s ease';
        }
        
        // Animação de erro no cadeado
        const lockIcon = document.querySelector('.lock-icon');
        if (lockIcon) {
            lockIcon.style.animation = 'shake 0.5s ease';
        }
        
        // Resetar após animação
        setTimeout(() => {
            if (lockIcon) lockIcon.style.animation = '';
        }, 500);
    }
}


window.changeDial = changeDial;
window.unlockSite = unlockSite;

// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const navMain = document.querySelector('.nav-main');

// Criar overlay uma vez
let menuOverlay = document.querySelector('.menu-overlay');
if (!menuOverlay) {
    menuOverlay = document.createElement('div');
    menuOverlay.className = 'menu-overlay';
    document.body.appendChild(menuOverlay);
}

// Função para fechar o menu
function closeMobileMenu() {
    if (menuToggle) {
        menuToggle.classList.remove('active');
    }
    if (navMain) {
        navMain.classList.remove('active');
    }
    if (menuOverlay) {
        menuOverlay.classList.remove('active');
    }
    // Fechar todos os dropdowns
    document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
        dropdown.classList.remove('active');
    });
}

// Função para abrir/fechar o menu
function toggleMobileMenu() {
    if (!menuToggle || !navMain) return;
    
    const isActive = navMain.classList.contains('active');
    
    if (isActive) {
        closeMobileMenu();
    } else {
        menuToggle.classList.add('active');
        navMain.classList.add('active');
        if (menuOverlay) {
            menuOverlay.classList.add('active');
        }
    }
}

// Event listener no toggle
if (menuToggle) {
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMobileMenu();
    });
}

// Fechar ao clicar no overlay
if (menuOverlay) {
    menuOverlay.addEventListener('click', (e) => {
        e.stopPropagation();
        closeMobileMenu();
    });
}

// Dropdown menu para mobile
document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            e.stopPropagation();
            const dropdown = toggle.closest('.nav-dropdown');
            if (dropdown) {
                // Fechar outros dropdowns
                document.querySelectorAll('.nav-dropdown').forEach(d => {
                    if (d !== dropdown) {
                        d.classList.remove('active');
                    }
                });
                dropdown.classList.toggle('active');
            }
        }
    });
});

// Fechar menu ao clicar em um link (exceto dropdown toggle)
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', (e) => {
        // Não fechar se for dropdown toggle
        if (link.classList.contains('dropdown-toggle')) {
            return;
        }
        
        if (window.innerWidth <= 768) {
            // Pequeno delay para permitir navegação
            setTimeout(() => {
                closeMobileMenu();
            }, 100);
        }
    });
});

// Fechar menu ao redimensionar a janela (se voltar para desktop)
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    }, 250);
});

// Prevenir scroll do body quando menu está aberto
function preventBodyScroll(prevent) {
    if (prevent) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

// Observar mudanças no menu
if (navMain) {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const isActive = navMain.classList.contains('active');
                preventBodyScroll(isActive);
            }
        });
    });
    observer.observe(navMain, { attributes: true });
}

// Login System
let currentUser = null;

function initLoginSystem() {
    // Verificar se já está logado
    const savedUser = localStorage.getItem('mariaeduarda_currentUser');
    if (savedUser) {
        currentUser = savedUser;
        showUserInterface();
        loadUserProfile();
        updatePointsDisplay();
    } else {
        showLoginModal();
    }
}

function showLoginModal() {
    const loginModal = document.getElementById('loginSystemModal');
    if (loginModal) {
        loginModal.classList.add('active');
    }
}

function loginUser(user) {
    currentUser = user;
    localStorage.setItem('mariaeduarda_currentUser', user);
    
    // Inicializar perfil se não existir
    initUserProfile(user);
    
    // Fechar modal
    const loginModal = document.getElementById('loginSystemModal');
    if (loginModal) {
        loginModal.classList.remove('active');
    }
    
    showUserInterface();
    loadUserProfile();
    updatePointsDisplay();
}

function logout() {
    if (confirm('Tem certeza que deseja sair?')) {
        currentUser = null;
        localStorage.removeItem('mariaeduarda_currentUser');
        hideUserInterface();
        showLoginModal();
    }
}

function showUserInterface() {
    const navPerfil = document.getElementById('navPerfil');
    const userProfileCard = document.getElementById('userProfileCard');
    
    if (navPerfil) navPerfil.style.display = 'block';
    if (userProfileCard) {
        userProfileCard.style.display = 'block';
        updateProfileCard();
    }
}

function hideUserInterface() {
    const navPerfil = document.getElementById('navPerfil');
    const userProfileCard = document.getElementById('userProfileCard');
    
    if (navPerfil) navPerfil.style.display = 'none';
    if (userProfileCard) userProfileCard.style.display = 'none';
}

function updateProfileCard() {
    if (!currentUser) return;
    
    const profile = getUserProfile();
    if (!profile) return;
    
    const profileCardAvatar = document.getElementById('profileCardAvatar');
    const profileCardName = document.getElementById('profileCardName');
    const profileCardLevel = document.getElementById('profileCardLevel');
    const xpFillMini = document.getElementById('xpFillMini');
    const xpTextMini = document.getElementById('xpTextMini');
    
    if (profileCardAvatar) {
        profileCardAvatar.textContent = profile.user === 'maria' ? '👩' : '👨';
    }
    
    if (profileCardName) {
        profileCardName.textContent = profile.userName;
    }
    
    if (profileCardLevel) {
        profileCardLevel.textContent = profile.level;
    }
    
    if (xpFillMini && xpTextMini) {
        const percentage = (profile.experience / profile.experienceToNextLevel) * 100;
        xpFillMini.style.width = percentage + '%';
        xpTextMini.textContent = `${profile.experience}/${profile.experienceToNextLevel} XP`;
    }
}

function initUserProfile(user) {
    const profileKey = `mariaeduarda_profile_${user}`;
    const existingProfile = localStorage.getItem(profileKey);
    
    if (!existingProfile) {
        const profile = {
            user: user,
            userName: user === 'maria' ? 'Maria Eduarda' : 'Fernando',
            points: 0,
            stars: 0,
            hearts: 0,
            level: 1,
            experience: 0,
            experienceToNextLevel: 100,
            achievements: [],
            valesDesbloqueados: [],
            stats: {
                fotosAdicionadas: 0,
                videosAdicionados: 0,
                trendsAdicionadas: 0,
                sonhosAdicionados: 0,
                sonhosRealizados: 0,
                jogosJogados: 0,
                lembrancasAdicionadas: 0,
                textosAdicionados: 0
            }
        };
        localStorage.setItem(profileKey, JSON.stringify(profile));
    }
}

function getUserProfile() {
    if (!currentUser) return null;
    const profileKey = `mariaeduarda_profile_${currentUser}`;
    const profile = localStorage.getItem(profileKey);
    return profile ? JSON.parse(profile) : null;
}

function saveUserProfile(profile) {
    if (!currentUser) return;
    const profileKey = `mariaeduarda_profile_${currentUser}`;
    localStorage.setItem(profileKey, JSON.stringify(profile));
}

function addPoints(points, reason) {
    if (!currentUser) return;
    
    const profile = getUserProfile();
    if (!profile) return;
    
    profile.points += points;
    profile.stars += Math.floor(points / 10); // 10 pontos = 1 estrela
    profile.hearts += Math.floor(points / 5); // 5 pontos = 1 coração
    profile.experience += points;
    
    // Verificar desbloqueio de vales
    checkValesUnlock(profile);
    
    // Calcular nível
    while (profile.experience >= profile.experienceToNextLevel) {
        profile.experience -= profile.experienceToNextLevel;
        profile.level++;
        profile.experienceToNextLevel = Math.floor(profile.experienceToNextLevel * 1.5);
        
        // Verificar vales por nível
        checkValesUnlock(profile);
        
        // Notificação de nível
        showLevelUpNotification(profile.level);
    }
    
    saveUserProfile(profile);
    updatePointsDisplay();
    loadUserProfile();
    
    // Mostrar notificação de pontos
    showPointsNotification(points, reason);
}

// Sistema de Vales
const valesConfig = [
    { id: 'vale_date', name: 'Vale Date', icon: '💑', description: 'Um date especial para vocês!', unlockLevel: 2, unlockPoints: 50, category: 'date' },
    { id: 'vale_sorvete', name: 'Vale Sorvete', icon: '🍦', description: 'Um sorvete delicioso juntos!', unlockLevel: 3, unlockPoints: 100, category: 'doce' },
    { id: 'vale_cinema', name: 'Vale Cinema', icon: '🎬', description: 'Assistir um filme juntos!', unlockLevel: 4, unlockPoints: 150, category: 'date' },
    { id: 'vale_viagem', name: 'Vale Viagem', icon: '✈️', description: 'Uma viagem especial!', unlockLevel: 5, unlockPoints: 250, category: 'viagem' },
    { id: 'vale_jantar', name: 'Vale Jantar', icon: '🍽️', description: 'Um jantar romântico!', unlockLevel: 6, unlockPoints: 350, category: 'date' },
    { id: 'vale_massagem', name: 'Vale Massagem', icon: '💆', description: 'Uma massagem relaxante!', unlockLevel: 7, unlockPoints: 500, category: 'cuidado' },
    { id: 'vale_presente', name: 'Vale Presente', icon: '🎁', description: 'Um presente especial!', unlockLevel: 8, unlockPoints: 700, category: 'presente' },
    { id: 'vale_weekend', name: 'Vale Fim de Semana', icon: '🏖️', description: 'Um fim de semana especial!', unlockLevel: 10, unlockPoints: 1000, category: 'viagem' },
    { id: 'vale_aniversario', name: 'Vale Aniversário', icon: '🎂', description: 'Celebração especial!', unlockLevel: 12, unlockPoints: 1500, category: 'especial' },
    { id: 'vale_eternidade', name: 'Vale Eternidade', icon: '💍', description: 'O vale mais especial de todos!', unlockLevel: 15, unlockPoints: 2500, category: 'especial' }
];

function checkValesUnlock(profile) {
    const novosVales = [];
    
    valesConfig.forEach(vale => {
        // Verificar se já foi desbloqueado
        if (profile.valesDesbloqueados && profile.valesDesbloqueados.find(v => v.id === vale.id)) {
            return;
        }
        
        // Verificar condições de desbloqueio
        const unlockedByLevel = profile.level >= vale.unlockLevel;
        const unlockedByPoints = profile.points >= vale.unlockPoints;
        
        if (unlockedByLevel || unlockedByPoints) {
            const novoVale = {
                ...vale,
                dataDesbloqueio: new Date().toISOString(),
                desbloqueadoPor: unlockedByLevel ? 'level' : 'points'
            };
            
            if (!profile.valesDesbloqueados) {
                profile.valesDesbloqueados = [];
            }
            
            profile.valesDesbloqueados.push(novoVale);
            novosVales.push(novoVale);
        }
    });
    
    // Mostrar notificação de vales desbloqueados
    if (novosVales.length > 0) {
        novosVales.forEach(vale => {
            showValeUnlockNotification(vale);
        });
    }
}

function loadVales(profile) {
    const valesSection = document.getElementById('valesSection');
    const valesGrid = document.getElementById('valesGrid');
    
    if (!valesSection || !valesGrid) return;
    
    const vales = profile.valesDesbloqueados || [];
    
    if (vales.length === 0) {
        valesSection.style.display = 'none';
        return;
    }
    
    valesSection.style.display = 'block';
    
    // Ordenar por data de desbloqueio (mais recentes primeiro)
    vales.sort((a, b) => new Date(b.dataDesbloqueio) - new Date(a.dataDesbloqueio));
    
    valesGrid.innerHTML = vales.map(vale => `
        <div class="vale-card ${vale.category}">
            <div class="vale-icon">${vale.icon}</div>
            <div class="vale-content">
                <h3 class="vale-name">${vale.name}</h3>
                <p class="vale-description">${vale.description}</p>
                <div class="vale-date">Desbloqueado em ${formatDate(vale.dataDesbloqueio)}</div>
                ${vale.desbloqueadoPor === 'level' ? 
                    `<div class="vale-badge level-badge">Nível ${vale.unlockLevel}</div>` :
                    `<div class="vale-badge points-badge">${vale.unlockPoints} pontos</div>`
                }
            </div>
            <div class="vale-status">
                <span class="vale-status-text">Disponível</span>
            </div>
        </div>
    `).join('');
}

function showValeUnlockNotification(vale) {
    const notification = document.createElement('div');
    notification.className = 'vale-unlock-notification';
    notification.innerHTML = `
        <div class="vale-unlock-content">
            <div class="vale-unlock-icon">${vale.icon}</div>
            <div class="vale-unlock-text">
                <div class="vale-unlock-title">Vale Desbloqueado!</div>
                <div class="vale-unlock-name">${vale.name}</div>
                <div class="vale-unlock-description">${vale.description}</div>
            </div>
        </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 500);
    }, 5000);
    
    // Confetti effect
    createConfetti();
}

function updatePointsDisplay() {
    if (!currentUser) return;
    
    const profile = getUserProfile();
    if (!profile) return;
    
    updateProfileCard();
}

function loadUserProfile() {
    if (!currentUser) return;
    
    const profile = getUserProfile();
    if (!profile) return;
    
    const perfilContent = document.getElementById('perfilContent');
    if (!perfilContent) return;
    
    const percentageToNextLevel = (profile.experience / profile.experienceToNextLevel) * 100;
    
    perfilContent.innerHTML = `
        <div class="perfil-header">
            <div class="perfil-avatar-large">
                <span>${profile.user === 'maria' ? '👩' : '👨'}</span>
            </div>
            <div class="perfil-info">
                <h2 class="perfil-name">${profile.userName}</h2>
                <div class="perfil-level">Nível ${profile.level}</div>
            </div>
        </div>
        
        <div class="perfil-stats-grid">
            <div class="stat-box">
                <div class="stat-icon">⭐</div>
                <div class="stat-value">${profile.stars}</div>
                <div class="stat-label">Estrelas</div>
            </div>
            <div class="stat-box">
                <div class="stat-icon">💖</div>
                <div class="stat-value">${profile.hearts}</div>
                <div class="stat-label">Corações</div>
            </div>
            <div class="stat-box">
                <div class="stat-icon">🎯</div>
                <div class="stat-value">${profile.points}</div>
                <div class="stat-label">Pontos</div>
            </div>
        </div>
        
        <div class="perfil-level-progress">
            <div class="level-progress-header">
                <span>Experiência para o próximo nível</span>
                <span>${profile.experience} / ${profile.experienceToNextLevel} XP</span>
            </div>
            <div class="level-progress-bar">
                <div class="level-progress-fill" style="width: ${percentageToNextLevel}%"></div>
            </div>
        </div>
        
        <div class="perfil-stats-detailed">
            <h3>Suas Estatísticas</h3>
            <div class="stats-list">
                <div class="stat-item">
                    <span class="stat-item-icon">📸</span>
                    <span class="stat-item-label">Fotos Adicionadas</span>
                    <span class="stat-item-value">${profile.stats.fotosAdicionadas}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-item-icon">🎥</span>
                    <span class="stat-item-label">Vídeos Adicionados</span>
                    <span class="stat-item-value">${profile.stats.videosAdicionados}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-item-icon">📱</span>
                    <span class="stat-item-label">Trends Adicionadas</span>
                    <span class="stat-item-value">${profile.stats.trendsAdicionadas}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-item-icon">✨</span>
                    <span class="stat-item-label">Sonhos Adicionados</span>
                    <span class="stat-item-value">${profile.stats.sonhosAdicionados}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-item-icon">✅</span>
                    <span class="stat-item-label">Sonhos Realizados</span>
                    <span class="stat-item-value">${profile.stats.sonhosRealizados}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-item-icon">🎮</span>
                    <span class="stat-item-label">Jogos Jogados</span>
                    <span class="stat-item-value">${profile.stats.jogosJogados}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-item-icon">💭</span>
                    <span class="stat-item-label">Lembranças Adicionadas</span>
                    <span class="stat-item-value">${profile.stats.lembrancasAdicionadas || 0}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-item-icon">📝</span>
                    <span class="stat-item-label">Textos Adicionados</span>
                    <span class="stat-item-value">${profile.stats.textosAdicionados || 0}</span>
                </div>
            </div>
        </div>
        
        <div class="perfil-achievements">
            <h3>Conquistas</h3>
            <div class="achievements-grid" id="achievementsGrid">
                ${getAchievementsHTML(profile)}
            </div>
        </div>
    `;
    
    // Carregar vales desbloqueados
    loadVales(profile);
}

function getAchievementsHTML(profile) {
    const achievements = [
        { id: 'first_photo', name: 'Primeira Foto', icon: '📸', condition: profile.stats.fotosAdicionadas >= 1 },
        { id: 'photo_master', name: 'Mestre das Fotos', icon: '📷', condition: profile.stats.fotosAdicionadas >= 10 },
        { id: 'first_video', name: 'Primeiro Vídeo', icon: '🎥', condition: profile.stats.videosAdicionados >= 1 },
        { id: 'video_master', name: 'Mestre dos Vídeos', icon: '🎬', condition: profile.stats.videosAdicionados >= 10 },
        { id: 'first_trend', name: 'Primeira Trend', icon: '📱', condition: profile.stats.trendsAdicionadas >= 1 },
        { id: 'trend_master', name: 'Mestre das Trends', icon: '🌟', condition: profile.stats.trendsAdicionadas >= 10 },
        { id: 'first_dream', name: 'Primeiro Sonho', icon: '✨', condition: profile.stats.sonhosAdicionados >= 1 },
        { id: 'dream_master', name: 'Mestre dos Sonhos', icon: '💫', condition: profile.stats.sonhosAdicionados >= 10 },
        { id: 'first_completed', name: 'Primeira Conquista', icon: '✅', condition: profile.stats.sonhosRealizados >= 1 },
        { id: 'achiever', name: 'Realizador', icon: '🏆', condition: profile.stats.sonhosRealizados >= 5 },
        { id: 'level_5', name: 'Nível 5', icon: '⭐', condition: profile.level >= 5 },
        { id: 'level_10', name: 'Nível 10', icon: '👑', condition: profile.level >= 10 },
        { id: 'points_100', name: '100 Pontos', icon: '💯', condition: profile.points >= 100 },
        { id: 'points_500', name: '500 Pontos', icon: '🔥', condition: profile.points >= 500 },
        { id: 'points_1000', name: '1000 Pontos', icon: '💎', condition: profile.points >= 1000 }
    ];
    
    return achievements.map(achievement => {
        const unlocked = achievement.condition;
        return `
            <div class="achievement-item ${unlocked ? 'unlocked' : 'locked'}">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-name">${achievement.name}</div>
                ${unlocked ? '<div class="achievement-badge">✓</div>' : ''}
            </div>
        `;
    }).join('');
}

function showPointsNotification(points, reason) {
    const notification = document.createElement('div');
    notification.className = 'points-notification';
    // Adicionar referências pop ocasionalmente (25% das vezes)
    const showPopReference = Math.random() < 0.25;
    let popQuote = '';
    if (showPopReference) {
        const popQuotes = [
            // The Office
            "That's what she said! 💼",
            "Bears. Beets. Battlestar Galactica. 🐻",
            "You're the Assistant Regional Manager! 💼",
            // Crepúsculo
            "And so the lion fell in love with the lamb... 🌙",
            "You're my own personal brand of heroin. 💕",
            // Britney Spears
            "Oops!... I Did It Again! 🎤",
            "Baby One More Time! 💕",
            "Toxic! 🎵",
            // Shrek
            "Ogres are like onions... 🦷",
            "Somebody once told me... 💚"
        ];
        const randomPopQuote = popQuotes[Math.floor(Math.random() * popQuotes.length)];
        popQuote = `<div style="font-size: 0.7rem; font-style: italic; margin-top: 0.2rem; opacity: 0.7; color: var(--text-light);">${randomPopQuote}</div>`;
    }
    
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">⭐</span>
            <div class="notification-text">
                <div class="notification-points">+${points} pontos</div>
                <div class="notification-reason">${reason}</div>
                ${popQuote}
            </div>
        </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function showLevelUpNotification(level) {
    const popLevelQuotes = [
        // The Office
        "That's what she said! 🎉",
        `Bears. Beets. Battlestar Galactica. E você subiu para o nível ${level}! 🐻`,
        `You're the Regional Manager of Level ${level}! 💼`,
        `I'm not superstitious, but I am a little stitious... Level ${level}! ✨`,
        // Crepúsculo
        `And so the lion fell in love with the lamb... Level ${level}! 🌙`,
        `I'm only afraid of losing you... mas agora você está no nível ${level}! 💕`,
        // Britney Spears
        `Oops!... I Did It Again! Level ${level}! 🎤`,
        `Baby One More Time... no nível ${level}! 💕`,
        // Shrek
        `Ogres are like onions... e você subiu para o nível ${level}! 🦷`,
        `Somebody once told me you'd reach level ${level}! 💚`
    ];
    const randomLevelQuote = popLevelQuotes[Math.floor(Math.random() * popLevelQuotes.length)];
    
    const notification = document.createElement('div');
    notification.className = 'level-up-notification';
    notification.innerHTML = `
        <div class="level-up-content">
            <span class="level-up-icon">🎉</span>
            <div class="level-up-text">
                <div class="level-up-title">Nível Up!</div>
                <div class="level-up-level">Você alcançou o nível ${level}!</div>
                <div style="font-size: 0.75rem; font-style: italic; margin-top: 0.3rem; opacity: 0.8;">${randomLevelQuote}</div>
            </div>
        </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 500);
    }, 4000);
}

// Make functions global
window.loginUser = loginUser;
window.logout = logout;

// Calculate Days Together Counter
function calculateDaysTogether() {
    const startDate = new Date('2024-08-07');
    const today = new Date();
    const diffTime = Math.abs(today - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const daysCounter = document.getElementById('daysCounter');
    if (daysCounter) {
        daysCounter.textContent = `${diffDays} dias de puro amor 💕`;
    }
}

// Calculate days on page load
calculateDaysTogether();

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            navMenu.classList.remove('active');
        }
    });
});

// Photo Gallery Modal
const fotoModal = document.getElementById('fotoModal');
const modalImg = document.getElementById('modalImg');
const fotoItems = document.querySelectorAll('.foto-item');

fotoItems.forEach(item => {
    const img = item.querySelector('img');
    if (img) {
        item.addEventListener('click', () => {
            modalImg.src = img.src;
            fotoModal.classList.add('active');
        });
    }
});

const closeModal = document.querySelector('.close-modal');
if (closeModal) {
    closeModal.addEventListener('click', () => {
        fotoModal.classList.remove('active');
    });
}

if (fotoModal) {
    fotoModal.addEventListener('click', (e) => {
        if (e.target === fotoModal) {
            fotoModal.classList.remove('active');
        }
    });
}

// Map Initialization
let map;
const locations = {
    rio: { lat: -22.9068, lng: -43.1729, name: 'Rio de Janeiro' },
    campos: { lat: -22.7394, lng: -45.5914, name: 'Campos do Jordão' },
    paranavai: { lat: -23.0819, lng: -52.4619, name: 'Paranavaí' }
};

function initMap() {
    map = L.map('map').setView([-22.9068, -43.1729], 5);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add markers for each location
    Object.keys(locations).forEach(key => {
        const loc = locations[key];
        L.marker([loc.lat, loc.lng])
            .addTo(map)
            .bindPopup(`<b>${loc.name}</b><br>Nossa viagem especial 💕`);
    });
}

// Travel Cards Interaction
const viagemCards = document.querySelectorAll('.viagem-card');
const viagemGallery = document.getElementById('viagemGallery');
const galleryTitle = document.getElementById('galleryTitle');
const galleryGrid = document.getElementById('galleryGrid');

// Fotos das viagens (você pode adicionar suas próprias fotos aqui)
const viagemFotos = {
    rio: [
        // Adicione URLs das fotos do Rio aqui
        // Exemplo: 'caminho/para/foto1.jpg', 'caminho/para/foto2.jpg'
    ],
    campos: [
        // Adicione URLs das fotos de Campos do Jordão aqui
    ],
    paranavai: [
        // Adicione URLs das fotos de Paranavaí aqui
    ]
};

viagemCards.forEach(card => {
    card.addEventListener('click', () => {
        viagemCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        
        const location = card.dataset.location;
        if (locations[location] && map) {
            map.setView([locations[location].lat, locations[location].lng], 10);
        }
        
        // Mostrar galeria de fotos
        showViagemGallery(location);
    });
});

function showViagemGallery(location) {
    const locationNames = {
        rio: 'Rio de Janeiro',
        campos: 'Campos do Jordão',
        paranavai: 'Paranavaí'
    };
    
    galleryTitle.textContent = `📸 Fotos de ${locationNames[location]}`;
    galleryGrid.innerHTML = '';
    
    const fotos = viagemFotos[location] || [];
    
    if (fotos.length === 0) {
        galleryGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-light);">
                <span style="font-size: 4rem; display: block; margin-bottom: 1rem;">📷</span>
                <p>Nenhuma foto adicionada ainda.</p>
                <p style="margin-top: 0.5rem; font-size: 0.9rem;">Adicione fotos editando o arquivo script.js na seção viagemFotos</p>
            </div>
        `;
    } else {
        fotos.forEach((foto, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.innerHTML = `<img src="${foto}" alt="Foto ${index + 1} de ${locationNames[location]}" loading="lazy">`;
            galleryItem.addEventListener('click', () => {
                modalImg.src = foto;
                fotoModal.classList.add('active');
            });
            galleryGrid.appendChild(galleryItem);
        });
    }
    
    viagemGallery.style.display = 'block';
    
    // Scroll suave até a galeria
    setTimeout(() => {
        viagemGallery.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

// Initialize map when page loads
if (document.getElementById('map')) {
    initMap();
}

// Game Modal
const gameModal = document.getElementById('gameModal');
const gameContainer = document.getElementById('gameContainer');
const closeGame = document.querySelector('.close-game');

if (closeGame) {
    closeGame.addEventListener('click', () => {
        gameModal.classList.remove('active');
        gameContainer.innerHTML = '';
    });
}

if (gameModal) {
    gameModal.addEventListener('click', (e) => {
        if (e.target === gameModal) {
            gameModal.classList.remove('active');
            gameContainer.innerHTML = '';
        }
    });
}

// Informações dos jogos
const jogosInfo = {
    'soletra': {
        title: 'Soletra',
        description: 'Com 7 letras, quantas palavras você consegue formar? Descubra o máximo de palavras utilizando as letras do dia e seja o gênio do Soletra!'
    },
    'combinado': {
        title: 'Combinado',
        description: 'Descubra a relação secreta entre as palavras combinando-as em 4 grupos. Resolva o Combinado de hoje agora!'
    },
    'dito': {
        title: 'Dito',
        description: 'Adivinhe a palavra secreta do dia em apenas 6 tentativas. Uma palavra nova por dia! Já descobriu a palavra de hoje?'
    },
    'sudoku': {
        title: 'Sudoku',
        description: 'Desafie sua mente com este clássico jogo de números. Complete o grid usando lógica e raciocínio!'
    },
    'palavras-cruzadas': {
        title: 'Palavras Cruzadas',
        description: 'Jogue palavras cruzadas online, onde diversão e conhecimento se cruzam! Já completou seu jogo do dia?'
    },
    'domino': {
        title: 'Dominó',
        description: 'Jogue dominó online comigo! Crie uma sala ou entre em uma existente para jogarmos juntos.'
    },
    'quiz': {
        title: 'Quiz do Amor',
        description: 'Teste seus conhecimentos sobre nossa história! Quanto você realmente sabe sobre nós? 💕'
    }
};

// Inicializar carrossel de jogos
function initJogosCarousel() {
    const carousel = document.getElementById('jogosCarousel');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    const jogoIcons = document.querySelectorAll('.jogo-icon-small');
    const btnJogar = document.getElementById('btnJogar');
    const jogoTitle = document.getElementById('jogoSelectedTitle');
    const jogoDescription = document.getElementById('jogoSelectedDescription');
    
    let currentIndex = 2; // Começar com Dito selecionado
    
    function updateCarousel(index) {
        currentIndex = index;
        
        // Atualizar ícones
        jogoIcons.forEach((icon, i) => {
            icon.classList.remove('active');
            if (i === index) {
                icon.classList.add('active');
            }
        });
        
        // Atualizar dots
        dots.forEach((dot, i) => {
            dot.classList.remove('active');
            if (i === index) {
                dot.classList.add('active');
            }
        });
        
        // Atualizar informações do jogo
        const jogo = jogoIcons[index].dataset.jogo;
        const info = jogosInfo[jogo];
        jogoTitle.textContent = info.title;
        jogoDescription.textContent = info.description;
        btnJogar.dataset.jogo = jogo;
        
        // Scroll suave do carrossel para centralizar o item selecionado
        const activeIcon = jogoIcons[index];
        const carouselRect = carousel.getBoundingClientRect();
        const iconRect = activeIcon.getBoundingClientRect();
        const scrollLeft = carousel.scrollLeft + (iconRect.left - carouselRect.left) - (carouselRect.width / 2) + (iconRect.width / 2);
        
        carousel.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
        });
    }
    
    // Event listeners para ícones
    jogoIcons.forEach((icon, index) => {
        icon.addEventListener('click', () => {
            updateCarousel(index);
        });
    });
    
    // Event listeners para dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            updateCarousel(index);
        });
    });
    
    // Botão jogar
    btnJogar.addEventListener('click', () => {
        const jogo = btnJogar.dataset.jogo;
        openGame(jogo);
    });
    
    // Navegação por teclado
    document.addEventListener('keydown', (e) => {
        if (document.getElementById('jogos').getBoundingClientRect().top < window.innerHeight && 
            document.getElementById('jogos').getBoundingClientRect().bottom > 0) {
            if (e.key === 'ArrowLeft' && currentIndex > 0) {
                updateCarousel(currentIndex - 1);
            } else if (e.key === 'ArrowRight' && currentIndex < jogoIcons.length - 1) {
                updateCarousel(currentIndex + 1);
            }
        }
    });
    
    // Inicializar com o jogo selecionado
    updateCarousel(currentIndex);
}

// Garantir que a página comece no topo e feche modais
window.addEventListener('load', () => {
    // Sempre ir para o topo ao carregar
    window.scrollTo(0, 0);
    
    // Fechar qualquer modal que possa estar aberto incorretamente
    const gameModal = document.getElementById('gameModal');
    const loginModal = document.getElementById('loginModal');
    const loginSystemModal = document.getElementById('loginSystemModal');
    
    // Fechar todos os modais de jogo
    if (gameModal) {
        gameModal.classList.remove('active');
        gameModal.classList.remove('domino-active');
        const gameContainer = document.getElementById('gameContainer');
        if (gameContainer) {
            gameContainer.innerHTML = '';
        }
    }
    
    // Fechar modal de login do dominó
    if (loginModal) {
        loginModal.classList.remove('active');
    }
    
    // loginSystemModal só deve estar ativo se não houver usuário logado (isso é tratado no initLoginSystem)
    
    // Limpar qualquer hash indesejado da URL (exceto seções válidas)
    const validHashes = ['#home', '#nossa-historia', '#fotos', '#videos', '#trends', '#viagens', '#dates', '#sonhos', '#jogos', '#the-office', '#perfil'];
    if (window.location.hash && !validHashes.includes(window.location.hash)) {
        // Se houver hash inválido, limpar e ir para o topo
        window.history.replaceState(null, null, window.location.pathname);
        window.scrollTo(0, 0);
    }
});

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Garantir que começamos no topo
        window.scrollTo(0, 0);
        
        initLoginSystem(); // Deve ser chamado primeiro
        initJogosCarousel();
        initUploadSystem();
        loadTrends();
        loadFotos();
        loadVideos();
        initSonhosSystem();
        loadSonhos();
        loadLembrancas();
        loadFotoFondue();
        
        // Garantir que não há hash indesejado
        if (window.location.hash && window.location.hash !== '#home') {
            // Se houver hash, fazer scroll suave para a seção
            const target = document.querySelector(window.location.hash);
            if (target) {
                setTimeout(() => {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        } else {
            // Se não houver hash ou for #home, ir para o topo
            window.scrollTo(0, 0);
        }
    });
} else {
    // Garantir que começamos no topo
    window.scrollTo(0, 0);
    
    initLoginSystem(); // Deve ser chamado primeiro
    initJogosCarousel();
    initUploadSystem();
    loadTrends();
    loadFotos();
    loadVideos();
    initSonhosSystem();
    loadSonhos();
    loadLembrancas();
    loadFotoFondue();
    
    // Garantir que não há hash indesejado
    if (window.location.hash && window.location.hash !== '#home') {
        // Se houver hash, fazer scroll suave para a seção
        const target = document.querySelector(window.location.hash);
        if (target) {
            setTimeout(() => {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    } else {
        // Se não houver hash ou for #home, ir para o topo
        window.scrollTo(0, 0);
    }
}

// Upload System
let currentUploadSection = '';
let selectedAuthor = '';
let selectedFiles = [];

function initUploadSystem() {
    const uploadModal = document.getElementById('uploadModal');
    const closeUpload = document.querySelector('.close-upload');
    const uploadDropzone = document.getElementById('uploadDropzone');
    const uploadFileInput = document.getElementById('uploadFileInput');
    const uploadDate = document.getElementById('uploadDate');
    
    // Set today's date as default
    if (uploadDate) {
        const today = new Date().toISOString().split('T')[0];
        uploadDate.value = today;
    }
    
    // Close modal
    if (closeUpload) {
        closeUpload.addEventListener('click', () => {
            uploadModal.classList.remove('active');
            resetUploadForm();
        });
    }
    
    if (uploadModal) {
        uploadModal.addEventListener('click', (e) => {
            if (e.target === uploadModal) {
                uploadModal.classList.remove('active');
                resetUploadForm();
            }
        });
    }
    
    // Dropzone click
    if (uploadDropzone) {
        uploadDropzone.addEventListener('click', () => {
            uploadFileInput.click();
        });
    }
    
    // Drag and drop
    if (uploadDropzone) {
        uploadDropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
            uploadDropzone.classList.add('dragover');
        });
        
        uploadDropzone.addEventListener('dragleave', () => {
            uploadDropzone.classList.remove('dragover');
        });
        
        uploadDropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadDropzone.classList.remove('dragover');
            const files = Array.from(e.dataTransfer.files);
            handleFiles(files);
        });
    }
    
    // File input change
    if (uploadFileInput) {
        uploadFileInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            handleFiles(files);
        });
    }
}

function showUploadModal(section) {
    currentUploadSection = section;
    const uploadModal = document.getElementById('uploadModal');
    const uploadModalTitle = document.getElementById('uploadModalTitle');
    
    const titles = {
        'trends': 'Adicionar Trend',
        'fotos': 'Adicionar Foto',
        'videos': 'Adicionar Vídeo',
        'lembrancas': 'Adicionar Lembrança'
    };
    
    if (uploadModalTitle) {
        uploadModalTitle.textContent = titles[section] || 'Adicionar Conteúdo';
    }
    
    uploadModal.classList.add('active');
    selectedAuthor = '';
    selectedFiles = [];
    updateAuthorButtons();
}

function selectAuthor(author) {
    selectedAuthor = author;
    updateAuthorButtons();
}

function updateAuthorButtons() {
    const buttons = document.querySelectorAll('.author-btn');
    buttons.forEach(btn => {
        if (btn.dataset.author === selectedAuthor) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function handleFiles(files) {
    selectedFiles = files;
    const preview = document.getElementById('uploadPreview');
    preview.innerHTML = '';
    
    files.forEach((file, index) => {
        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item';
        
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewItem.innerHTML = `
                    <img src="${e.target.result}" alt="Preview">
                    <span class="preview-name">${file.name}</span>
                    <button class="preview-remove" onclick="removeFile(${index})">×</button>
                `;
            };
            reader.readAsDataURL(file);
        } else if (file.type.startsWith('video/')) {
            previewItem.innerHTML = `
                <div class="preview-video">
                    <span>🎥</span>
                    <span class="preview-name">${file.name}</span>
                    <button class="preview-remove" onclick="removeFile(${index})">×</button>
                </div>
            `;
        }
        
        preview.appendChild(previewItem);
    });
}

function removeFile(index) {
    selectedFiles.splice(index, 1);
    handleFiles(selectedFiles);
}

function resetUploadForm() {
    selectedFiles = [];
    selectedAuthor = '';
    document.getElementById('uploadPreview').innerHTML = '';
    document.getElementById('uploadComment').value = '';
    const uploadDate = document.getElementById('uploadDate');
    if (uploadDate) {
        const today = new Date().toISOString().split('T')[0];
        uploadDate.value = today;
    }
    document.getElementById('uploadFileInput').value = '';
    updateAuthorButtons();
}

function submitUpload() {
    if (!selectedAuthor) {
        alert('Por favor, selecione quem está adicionando o conteúdo.');
            return;
        }
        
    if (selectedFiles.length === 0) {
        alert('Por favor, selecione pelo menos um arquivo.');
            return;
        }
        
    const comment = document.getElementById('uploadComment').value;
    const date = document.getElementById('uploadDate').value;
    
    selectedFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = {
                id: Date.now() + Math.random(),
                type: file.type.startsWith('image/') ? 'image' : 'video',
                url: e.target.result,
                author: selectedAuthor,
                authorName: selectedAuthor === 'maria' ? 'Maria Eduarda' : 'Fernando',
                comment: comment,
                date: date,
                titulo: currentUploadSection === 'lembrancas' ? comment.split('\n')[0] || 'Lembrança Especial' : null,
                timestamp: new Date().toISOString()
            };
            
            saveContent(content);
            
            // Adicionar pontos
            if (currentUser === selectedAuthor) {
                const profile = getUserProfile();
                if (profile) {
                    if (currentUploadSection === 'fotos') {
                        profile.stats.fotosAdicionadas++;
                        addPoints(15, 'Foto adicionada');
                    } else if (currentUploadSection === 'videos') {
                        profile.stats.videosAdicionados++;
                        addPoints(20, 'Vídeo adicionado');
                    } else if (currentUploadSection === 'trends') {
                        profile.stats.trendsAdicionadas++;
                        addPoints(25, 'Trend adicionada');
                    } else if (currentUploadSection === 'lembrancas') {
                        profile.stats.lembrancasAdicionadas++;
                        addPoints(30, 'Lembrança adicionada');
                    }
                    saveUserProfile(profile);
                }
            }
        };
        
        if (file.type.startsWith('image/')) {
            reader.readAsDataURL(file);
        } else {
            // For videos, create a blob URL
            const videoUrl = URL.createObjectURL(file);
            const content = {
                id: Date.now() + Math.random(),
                type: 'video',
                url: videoUrl,
                file: file, // Keep file reference for videos
                author: selectedAuthor,
                authorName: selectedAuthor === 'maria' ? 'Maria Eduarda' : 'Fernando',
                comment: comment,
                date: date,
                titulo: currentUploadSection === 'lembrancas' ? comment.split('\n')[0] || 'Lembrança Especial' : null,
                timestamp: new Date().toISOString()
            };
            saveContent(content);
            
            // Adicionar pontos
            if (currentUser === selectedAuthor) {
                const profile = getUserProfile();
                if (profile) {
                    if (currentUploadSection === 'videos') {
                        profile.stats.videosAdicionados++;
                        addPoints(20, 'Vídeo adicionado');
                    } else if (currentUploadSection === 'trends') {
                        profile.stats.trendsAdicionadas++;
                        addPoints(25, 'Trend adicionada');
                    } else if (currentUploadSection === 'lembrancas') {
                        profile.stats.lembrancasAdicionadas++;
                        addPoints(30, 'Lembrança adicionada');
                    }
                    saveUserProfile(profile);
                }
            }
        }
    });
    
    // Close modal and reset
    document.getElementById('uploadModal').classList.remove('active');
    resetUploadForm();
    
    // Reload sections
    if (currentUploadSection === 'trends') {
        loadTrends();
    } else if (currentUploadSection === 'fotos') {
        loadFotos();
    } else if (currentUploadSection === 'videos') {
        loadVideos();
    } else if (currentUploadSection === 'lembrancas') {
        loadLembrancas();
    }
}

function loadLembrancas() {
    const historiaSection = document.querySelector('#nossa-historia .historia-timeline');
    if (!historiaSection) return;
    
    // Limpar lembranças já carregadas (evitar duplicatas)
    const existingLembrancas = historiaSection.querySelectorAll('.timeline-item.lembranca-item');
    existingLembrancas.forEach(item => item.remove());
    
    const lembrancas = JSON.parse(localStorage.getItem('mariaeduarda_lembrancas') || '[]');
    
    if (lembrancas.length === 0) return;
    
    // Adicionar lembranças à timeline
    lembrancas.forEach(lembranca => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item lembranca-item';
        timelineItem.innerHTML = `
            <div class="timeline-date">${formatDate(lembranca.date)}</div>
            <div class="timeline-content">
                <h3>${lembranca.titulo || 'Lembrança Especial'}</h3>
                ${lembranca.type === 'image' ? 
                    `<img src="${lembranca.url}" alt="Lembrança" style="max-width: 100%; border-radius: 10px; margin: 1rem 0;">` :
                    lembranca.type === 'video' ?
                    `<video controls style="max-width: 100%; border-radius: 10px; margin: 1rem 0;"><source src="${lembranca.url}"></video>` :
                    ''
                }
                ${lembranca.comment ? `<p>${lembranca.comment}</p>` : ''}
                <div class="timeline-author">${lembranca.author === 'maria' ? '👩' : '👨'} ${lembranca.authorName}</div>
            </div>
        `;
        historiaSection.appendChild(timelineItem);
    });
}

function saveContent(content) {
    let key;
    if (currentUploadSection === 'lembrancas') {
        key = 'mariaeduarda_lembrancas';
            } else {
        key = `mariaeduarda_${currentUploadSection}`;
    }
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.unshift(content); // Add to beginning
    localStorage.setItem(key, JSON.stringify(existing));
}

function loadTrends() {
    const trendsGrid = document.getElementById('trendsGrid');
    if (!trendsGrid) return;
    
    const trends = JSON.parse(localStorage.getItem('mariaeduarda_trends') || '[]');
    
    if (trends.length === 0) {
        trendsGrid.innerHTML = `
            <div class="trend-empty">
                <span>📱</span>
                <p>Nenhuma trend adicionada ainda</p>
                <small>Clique em "Adicionar Trend" para começar!</small>
            </div>
        `;
        return;
    }
    
    trendsGrid.innerHTML = trends.map(trend => `
        <div class="trend-item">
            <div class="trend-media">
                ${trend.type === 'video' ? 
                    `<video controls><source src="${trend.url}" type="video/mp4"></video>` :
                    `<img src="${trend.url}" alt="Trend">`
                }
            </div>
            <div class="trend-info">
                <div class="trend-author">
                    <span class="author-avatar">${trend.author === 'maria' ? '👩' : '👨'}</span>
                    <span class="author-name">${trend.authorName}</span>
                </div>
                ${trend.comment ? `<p class="trend-comment">${trend.comment}</p>` : ''}
                <div class="trend-date">${formatDate(trend.date)}</div>
            </div>
        </div>
    `).join('');
}

function loadFotos() {
    const fotosGrid = document.getElementById('fotosGrid');
    if (!fotosGrid) return;
    
    const fotos = JSON.parse(localStorage.getItem('mariaeduarda_fotos') || '[]');
    
    // Keep placeholders if no photos
    if (fotos.length === 0) return;
    
    // Remove placeholders and add uploaded photos
    const uploadedHTML = fotos.map(foto => `
        <div class="foto-item" onclick="openFotoModal('${foto.url.replace(/'/g, "\\'")}')">
            <img src="${foto.url}" alt="Foto">
            <div class="foto-overlay">
                <div class="foto-author">${foto.author === 'maria' ? '👩' : '👨'} ${foto.authorName}</div>
                ${foto.comment ? `<div class="foto-comment">${foto.comment}</div>` : ''}
                <div class="foto-date">${formatDate(foto.date)}</div>
            </div>
        </div>
    `).join('');
    
    // Append to existing grid
    fotosGrid.insertAdjacentHTML('beforeend', uploadedHTML);
}

function loadVideos() {
    const videosGrid = document.getElementById('videosGrid');
    if (!videosGrid) return;
    
    const videos = JSON.parse(localStorage.getItem('mariaeduarda_videos') || '[]');
    
    // Keep existing video items and add uploaded ones
    const existingHTML = videosGrid.innerHTML;
    const uploadedVideos = videos.map(video => `
        <div class="video-item">
            <video controls>
                <source src="${video.url}" type="video/mp4">
            </video>
            <div class="video-info">
                <div class="video-author">${video.author === 'maria' ? '👩' : '👨'} ${video.authorName}</div>
                ${video.comment ? `<p class="video-comment">${video.comment}</p>` : ''}
                <div class="video-date">${formatDate(video.date)}</div>
            </div>
        </div>
    `).join('');
    
    videosGrid.innerHTML = existingHTML + uploadedVideos;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('pt-BR', options);
}

// Make functions global
window.showUploadModal = showUploadModal;
window.selectAuthor = selectAuthor;
window.submitUpload = submitUpload;
window.removeFile = removeFile;

// Sonhos System
let currentSonhoCategory = 'todos';
let selectedSonhoAuthor = '';

function initSonhosSystem() {
    const sonhoModal = document.getElementById('sonhoModal');
    const closeSonho = document.querySelector('.close-sonho');
    const sonhoData = document.getElementById('sonhoData');
    
    // Set today's date as default
    if (sonhoData) {
        const today = new Date().toISOString().split('T')[0];
        sonhoData.value = '';
    }
    
    // Close modal
    if (closeSonho) {
        closeSonho.addEventListener('click', () => {
            sonhoModal.classList.remove('active');
            resetSonhoForm();
        });
    }
    
    if (sonhoModal) {
        sonhoModal.addEventListener('click', (e) => {
            if (e.target === sonhoModal) {
                sonhoModal.classList.remove('active');
                resetSonhoForm();
            }
        });
    }
}

function showAddSonhoModal() {
    const sonhoModal = document.getElementById('sonhoModal');
    sonhoModal.classList.add('active');
    selectedSonhoAuthor = '';
    updateSonhoAuthorButtons();
}

function selectSonhoAuthor(author) {
    selectedSonhoAuthor = author;
    updateSonhoAuthorButtons();
}

function updateSonhoAuthorButtons() {
    const buttons = document.querySelectorAll('.sonho-author-select .author-btn');
    buttons.forEach(btn => {
        if (btn.dataset.author === selectedSonhoAuthor) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function resetSonhoForm() {
    selectedSonhoAuthor = '';
    document.getElementById('sonhoTitulo').value = '';
    document.getElementById('sonhoCategoria').value = '';
    document.getElementById('sonhoDescricao').value = '';
    document.getElementById('sonhoData').value = '';
    updateSonhoAuthorButtons();
}

function addSonho() {
    if (!selectedSonhoAuthor) {
        alert('Por favor, selecione quem está adicionando o sonho.');
        return;
    }
    
    const titulo = document.getElementById('sonhoTitulo').value.trim();
    const categoria = document.getElementById('sonhoCategoria').value;
    const descricao = document.getElementById('sonhoDescricao').value.trim();
    const data = document.getElementById('sonhoData').value;
    
    if (!titulo) {
        alert('Por favor, preencha o título do sonho.');
        return;
    }
    
    if (!categoria) {
        alert('Por favor, selecione uma categoria.');
        return;
    }
    
    const sonho = {
        id: Date.now() + Math.random(),
        titulo: titulo,
        categoria: categoria,
        descricao: descricao,
        data: data,
        autor: selectedSonhoAuthor,
        autorName: selectedSonhoAuthor === 'maria' ? 'Maria Eduarda' : 'Fernando',
        realizado: false,
        dataRealizado: null,
        timestamp: new Date().toISOString()
    };
    
    saveSonho(sonho);
    
    // Adicionar pontos
    if (currentUser === selectedSonhoAuthor) {
        const profile = getUserProfile();
        if (profile) {
            profile.stats.sonhosAdicionados++;
            addPoints(25, 'Sonho adicionado');
            saveUserProfile(profile);
        }
    }
    
    document.getElementById('sonhoModal').classList.remove('active');
    resetSonhoForm();
    loadSonhos();
}

function saveSonho(sonho) {
    const sonhos = JSON.parse(localStorage.getItem('mariaeduarda_sonhos') || '[]');
    sonhos.unshift(sonho);
    localStorage.setItem('mariaeduarda_sonhos', JSON.stringify(sonhos));
}

function loadSonhos() {
    const sonhosGrid = document.getElementById('sonhosGrid');
    if (!sonhosGrid) return;
    
    const sonhos = JSON.parse(localStorage.getItem('mariaeduarda_sonhos') || '[]');
    
    // Filter by category
    const filteredSonhos = currentSonhoCategory === 'todos' 
        ? sonhos 
        : sonhos.filter(s => s.categoria === currentSonhoCategory);
    
    // Update stats
    updateSonhosStats(sonhos);
    
    if (filteredSonhos.length === 0) {
        sonhosGrid.innerHTML = `
            <div class="sonho-empty">
                <span>✨</span>
                <p>Nenhum sonho adicionado ainda nesta categoria</p>
                <small>Clique em "Adicionar Sonho" para começar!</small>
            </div>
        `;
        return;
    }
    
    // Sort: não realizados primeiro, depois por data
    filteredSonhos.sort((a, b) => {
        if (a.realizado !== b.realizado) {
            return a.realizado ? 1 : -1;
        }
        if (a.data && b.data) {
            return new Date(a.data) - new Date(b.data);
        }
        return new Date(b.timestamp) - new Date(a.timestamp);
    });
    
    sonhosGrid.innerHTML = filteredSonhos.map(sonho => `
        <div class="sonho-card ${sonho.realizado ? 'realizado' : ''}" data-id="${sonho.id}">
            <div class="sonho-card-header">
                <div class="sonho-checkbox" onclick="toggleSonhoRealizado('${sonho.id}')">
                    <input type="checkbox" ${sonho.realizado ? 'checked' : ''} id="check-${sonho.id}">
                    <label for="check-${sonho.id}"></label>
                </div>
                <div class="sonho-category-badge category-${sonho.categoria}">
                    ${getCategoryIcon(sonho.categoria)} ${getCategoryName(sonho.categoria)}
                </div>
                <button class="sonho-delete" onclick="deleteSonho('${sonho.id}')" title="Deletar">×</button>
            </div>
            <div class="sonho-card-body">
                <h3 class="sonho-titulo">${sonho.titulo}</h3>
                ${sonho.descricao ? `<p class="sonho-descricao">${sonho.descricao}</p>` : ''}
                <div class="sonho-info">
                    <div class="sonho-author">
                        <span>${sonho.autor === 'maria' ? '👩' : '👨'}</span>
                        <span>${sonho.autorName}</span>
                    </div>
                    ${sonho.data ? `<div class="sonho-data">📅 ${formatDate(sonho.data)}</div>` : ''}
                    ${sonho.realizado && sonho.dataRealizado ? `<div class="sonho-data-realizado">✅ Realizado em ${formatDate(sonho.dataRealizado)}</div>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

function toggleSonhoRealizado(id) {
    const sonhos = JSON.parse(localStorage.getItem('mariaeduarda_sonhos') || '[]');
    const sonho = sonhos.find(s => s.id.toString() === id.toString());
    
    if (sonho) {
        sonho.realizado = !sonho.realizado;
        if (sonho.realizado && !sonho.dataRealizado) {
            sonho.dataRealizado = new Date().toISOString().split('T')[0];
        }
        localStorage.setItem('mariaeduarda_sonhos', JSON.stringify(sonhos));
        loadSonhos();
        
        // Confetti effect when completed
        if (sonho.realizado) {
            createConfetti();
        }
    }
}

function deleteSonho(id) {
    if (!confirm('Tem certeza que deseja deletar este sonho?')) {
        return;
    }
    
    const sonhos = JSON.parse(localStorage.getItem('mariaeduarda_sonhos') || '[]');
    const filtered = sonhos.filter(s => s.id.toString() !== id.toString());
    localStorage.setItem('mariaeduarda_sonhos', JSON.stringify(filtered));
    loadSonhos();
}

function filterSonhos(category) {
    currentSonhoCategory = category;
    
    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });
    
    loadSonhos();
}

function updateSonhosStats(sonhos) {
    const total = sonhos.length;
    const realizados = sonhos.filter(s => s.realizado).length;
    const porcentagem = total > 0 ? Math.round((realizados / total) * 100) : 0;
    
    document.getElementById('totalSonhos').textContent = total;
    document.getElementById('sonhosRealizados').textContent = realizados;
    document.getElementById('porcentagemRealizados').textContent = porcentagem + '%';
}

function getCategoryIcon(category) {
    const icons = {
        'morar-juntos': '🏠',
        'casar': '💍',
        'casa': '🏡',
        'familia': '👨‍👩‍👧‍👦',
        'outros': '💫'
    };
    return icons[category] || '✨';
}

function getCategoryName(category) {
    const names = {
        'morar-juntos': 'Morar Juntos',
        'casar': 'Casar',
        'casa': 'Nossa Casa',
        'familia': 'Família',
        'outros': 'Outros'
    };
    return names[category] || 'Outros';
}

function createConfetti() {
    // Simple confetti effect
    const colors = ['#ff6b9d', '#ffd54f', '#4fc3f7', '#20bf6b', '#9c27b0'];
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            confetti.style.animation = 'confetti-fall 3s linear forwards';
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 3000);
        }, i * 20);
    }
}

// Make functions global
window.showAddSonhoModal = showAddSonhoModal;
window.selectSonhoAuthor = selectSonhoAuthor;
window.addSonho = addSonho;
window.toggleSonhoRealizado = toggleSonhoRealizado;
window.deleteSonho = deleteSonho;
window.filterSonhos = filterSonhos;

function openGame(jogo) {
    // Adicionar pontos por jogar
    if (currentUser) {
        const profile = getUserProfile();
        if (profile) {
            profile.stats.jogosJogados++;
            addPoints(5, 'Jogo iniciado');
            saveUserProfile(profile);
        }
    }
    
    // Dominó não tem seleção de dificuldade
    if (jogo === 'domino') {
        showLoginModal();
        return;
    }
    
    // Quiz não tem seleção de dificuldade
    if (jogo === 'quiz') {
        initQuiz();
        return;
    }
        
    // Mostrar modal de seleção de dificuldade
    showDifficultyModal(jogo);
}

function showDifficultyModal(jogo) {
    const difficultyModal = document.getElementById('difficultyModal');
    if (!difficultyModal) {
        // Criar modal de dificuldade se não existir
        const modalHTML = `
            <div class="difficulty-modal" id="difficultyModal">
                <div class="difficulty-modal-content">
                    <span class="close-difficulty">&times;</span>
                    <h2 style="text-align: center; color: var(--primary-color); margin-bottom: 2rem;">Escolha a Dificuldade</h2>
                    <div class="difficulty-options" id="difficultyOptions">
                        <button class="difficulty-btn" data-difficulty="facil" onclick="selectDifficulty('facil')">
                            <span class="difficulty-icon">😊</span>
                            <span class="difficulty-name">Fácil</span>
                        </button>
                        <button class="difficulty-btn" data-difficulty="medio" onclick="selectDifficulty('medio')">
                            <span class="difficulty-icon">😐</span>
                            <span class="difficulty-name">Médio</span>
                        </button>
                        <button class="difficulty-btn" data-difficulty="dificil" onclick="selectDifficulty('dificil')">
                            <span class="difficulty-icon">😰</span>
                            <span class="difficulty-name">Difícil</span>
                        </button>
                        <button class="difficulty-btn difficulty-maria" data-difficulty="maria" onclick="selectDifficulty('maria')">
                            <span class="difficulty-icon">👑</span>
                            <span class="difficulty-name">Nível Maria Eduarda</span>
                            <span class="difficulty-badge">Mais Difícil</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Event listeners
        document.querySelector('.close-difficulty').addEventListener('click', () => {
            document.getElementById('difficultyModal').classList.remove('active');
        });
        
        document.getElementById('difficultyModal').addEventListener('click', (e) => {
            if (e.target.id === 'difficultyModal') {
                document.getElementById('difficultyModal').classList.remove('active');
            }
        });
    }
    
    // Armazenar jogo atual
    window.currentGame = jogo;
    document.getElementById('difficultyModal').classList.add('active');
}

function selectDifficulty(difficulty) {
    const jogo = window.currentGame;
    document.getElementById('difficultyModal').classList.remove('active');
    
    gameContainer.innerHTML = '';
    gameModal.classList.add('active');
    
    switch(jogo) {
        case 'sudoku':
            initSudoku(difficulty);
            break;
        case 'palavras-cruzadas':
            initCrossword(difficulty);
            break;
        case 'soletra':
            initSoletra(difficulty);
            break;
        case 'combinado':
            initCombinado(difficulty);
            break;
        case 'dito':
            initDito(difficulty);
            break;
    }
}

// Quiz do Amor
function initQuiz() {
    gameContainer.innerHTML = '';
    gameModal.classList.add('active');
    
    const quizHTML = `
        <div class="quiz-container">
            <h2 style="text-align: center; color: var(--primary-color); margin-bottom: 2rem; font-size: 2rem;">
                💕 Quiz do Amor 💕
            </h2>
            <div class="quiz-question-container" id="quizContainer">
                <div class="quiz-question">
                    <h3 class="quiz-question-title">Onde foi nosso primeiro date oficial (fora de casa)?</h3>
                </div>
                <div class="quiz-options" id="quizOptions">
                    <button class="quiz-option" onclick="selectQuizAnswer('a')" data-option="a">
                        <span class="option-letter">A</span>
                        <span class="option-text">Boussole</span>
                    </button>
                    <button class="quiz-option" onclick="selectQuizAnswer('b')" data-option="b">
                        <span class="option-letter">B</span>
                        <span class="option-text">Rosso Pomodoro</span>
                    </button>
                    <button class="quiz-option" onclick="selectQuizAnswer('c')" data-option="c">
                        <span class="option-letter">C</span>
                        <span class="option-text">La Gondula</span>
                    </button>
                    <button class="quiz-option" onclick="selectQuizAnswer('d')" data-option="d">
                        <span class="option-letter">D</span>
                        <span class="option-text">Barolo</span>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    gameContainer.innerHTML = quizHTML;
}

function selectQuizAnswer(option) {
    const correctAnswer = 'c'; // La Gondula
    const options = document.querySelectorAll('.quiz-option');
    const selectedOption = document.querySelector(`[data-option="${option}"]`);
    
    // Desabilitar todos os botões
    options.forEach(opt => {
        opt.disabled = true;
        opt.style.pointerEvents = 'none';
    });
    
    if (option === correctAnswer) {
        // Resposta correta
        selectedOption.classList.add('correct');
        
        // Adicionar pontos
        if (currentUser) {
            addPoints(20, 'Quiz do Amor - Acertou!');
        }
        
        // Mostrar mensagem de parabéns após um pequeno delay
        setTimeout(() => {
            showQuizSuccess();
        }, 500);
    } else {
        // Resposta incorreta
        selectedOption.classList.add('incorrect');
        
        // Mostrar resposta correta
        const correctOption = document.querySelector(`[data-option="${correctAnswer}"]`);
        correctOption.classList.add('correct');
        
        // Mostrar mensagem de erro
        setTimeout(() => {
            showQuizError();
        }, 500);
    }
}

function showQuizSuccess() {
    const quizContainer = document.getElementById('quizContainer');
    const popQuotes = [
        // The Office
        "That's what she said! 😏",
        "Bears. Beets. Battlestar Galactica. E você acertou! 🐻",
        "You're the Assistant Regional Manager of my heart! 💕",
        "Identity theft is not a joke, Madu! But you getting this right is! 🎉",
        "I'm not superstitious, but I am a little stitious... and you're amazing! ✨",
        // Crepúsculo
        "And so the lion fell in love with the lamb... e você acertou! 🌙",
        "You're my own personal brand of heroin... e você acertou tudinho! 💕",
        "I'm only afraid of losing you... mas você acertou! 💕",
        // Britney Spears
        "Oops!... I Did It Again! E você acertou! 🎤",
        "Baby One More Time... e você acertou tudinho! 💕",
        "Toxic... mas você acertou! 🎵",
        // Shrek
        "Ogres are like onions... e você acertou! 🦷",
        "Somebody once told me you'd get this right! 💚"
    ];
    const randomQuote = popQuotes[Math.floor(Math.random() * popQuotes.length)];
    
    quizContainer.innerHTML = `
        <div class="quiz-result success">
            <div class="result-icon">🎉</div>
            <h2 class="result-title">Parabéns minha princesa!</h2>
            <p class="result-message">Você acertou tudinho! 💕</p>
            <p class="result-submessage">${randomQuote}</p>
            <p class="result-submessage" style="font-size: 0.9rem; margin-top: 0.5rem; font-style: italic; color: var(--text-light);">- Referência Especial 💕</p>
            <div class="result-hearts">
                <span class="heart-emoji">💖</span>
                <span class="heart-emoji">💕</span>
                <span class="heart-emoji">💗</span>
                <span class="heart-emoji">💝</span>
                <span class="heart-emoji">💞</span>
            </div>
            <button class="quiz-restart-btn" onclick="initQuiz()">Jogar Novamente</button>
        </div>
    `;
}

function showQuizError() {
    const quizContainer = document.getElementById('quizContainer');
    const popErrorQuotes = [
        // The Office
        "NO GOD! NO GOD PLEASE NO! NO! NO! NOOO! 😅",
        "That's what she said... mas errado dessa vez! 😏",
        "I declare... BANKRUPTCY! (mas tente de novo!) 💼",
        "You miss 100% of the shots you don't take. - Wayne Gretzky - Michael Scott",
        "Dwight, you ignorant slut! (brincadeira, tente de novo!) 😄",
        // Crepúsculo
        "I'm only afraid of losing you... mas tente de novo! 🌙",
        "And so the lion fell in love with the lamb... mas errou! 😅",
        // Britney Spears
        "Oops!... I Did It Again! (mas errou dessa vez!) 🎤",
        "Baby One More Time... tente de novo! 💕",
        // Shrek
        "Ogres are like onions... mas você errou! 🦷",
        "Somebody once told me... tente de novo! 💚"
    ];
    const randomErrorQuote = popErrorQuotes[Math.floor(Math.random() * popErrorQuotes.length)];
    
    const errorHTML = `
        <div class="quiz-result error">
            <div class="result-icon">😔</div>
            <h2 class="result-title">Ops! Não foi dessa vez</h2>
                    <p class="result-message">A resposta correta era <strong>La Gondula</strong></p>
                    <p class="result-submessage">${randomErrorQuote}</p>
                    <p class="result-submessage" style="font-size: 0.9rem; margin-top: 0.5rem; font-style: italic; color: var(--text-light);">- Referência Especial 💕</p>
            <button class="quiz-restart-btn" onclick="initQuiz()">Tentar Novamente</button>
        </div>
    `;
    
    // Adicionar ao final do container
    quizContainer.insertAdjacentHTML('beforeend', errorHTML);
}

// Tornar função global
window.selectDifficulty = selectDifficulty;

// Sudoku Game
function initSudoku(difficulty = 'medio') {
    window.currentDifficulty = difficulty;
    const gameHTML = `
        <h2 style="text-align: center; color: var(--primary-color); margin-bottom: 2rem;">🔢 Sudoku</h2>
        <div class="sudoku-grid" id="sudokuGrid"></div>
        <div class="sudoku-controls">
            <button class="sudoku-number-btn" data-number="1">1</button>
            <button class="sudoku-number-btn" data-number="2">2</button>
            <button class="sudoku-number-btn" data-number="3">3</button>
            <button class="sudoku-number-btn" data-number="4">4</button>
            <button class="sudoku-number-btn" data-number="5">5</button>
            <button class="sudoku-number-btn" data-number="6">6</button>
            <button class="sudoku-number-btn" data-number="7">7</button>
            <button class="sudoku-number-btn" data-number="8">8</button>
            <button class="sudoku-number-btn" data-number="9">9</button>
            <button class="sudoku-number-btn" data-number="0" style="background: #ff6b9d; color: white;">Limpar</button>
        </div>
        <div style="text-align: center; margin-top: 2rem;">
            <button onclick="generateSudoku()" style="padding: 1rem 2rem; background: var(--gradient-1); color: white; border: none; border-radius: 25px; font-weight: 600; cursor: pointer;">Novo Jogo</button>
        </div>
    `;
    gameContainer.innerHTML = gameHTML;

    let selectedCell = null;
    let sudokuGrid = Array(9).fill().map(() => Array(9).fill(0));
    let solution = Array(9).fill().map(() => Array(9).fill(0));

    function generateSudoku() {
        // Generate a simple sudoku puzzle
        sudokuGrid = Array(9).fill().map(() => Array(9).fill(0));
        solution = Array(9).fill().map(() => Array(9).fill(0));
        
        // Fill diagonal boxes
        fillDiagonalBoxes();
        
        // Solve the puzzle
        solveSudoku(solution);
        
        // Remove numbers based on difficulty
        const difficultySettings = {
            'facil': 30,      // Mais números pré-preenchidos
            'medio': 40,      // Médio
            'dificil': 50,    // Menos números
            'maria': 60       // Muito difícil - Nível Maria Eduarda
        };
        removeNumbers(sudokuGrid, difficultySettings[window.currentDifficulty] || 40);
        
        renderSudoku();
    }

    function fillDiagonalBoxes() {
        for (let box = 0; box < 9; box += 3) {
            fillBox(box, box);
        }
    }

    function fillBox(row, col) {
        const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
        let idx = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                sudokuGrid[row + i][col + j] = nums[idx++];
                solution[row + i][col + j] = sudokuGrid[row + i][col + j];
            }
        }
    }

    function solveSudoku(grid) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (grid[row][col] === 0) {
                    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
                    for (let num of nums) {
                        if (isValid(grid, row, col, num)) {
                            grid[row][col] = num;
                            if (solveSudoku(grid)) return true;
                            grid[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    function isValid(grid, row, col, num) {
        for (let i = 0; i < 9; i++) {
            if (grid[row][i] === num || grid[i][col] === num) return false;
        }
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (grid[boxRow + i][boxCol + j] === num) return false;
            }
        }
        return true;
    }

    function removeNumbers(grid, count) {
        let removed = 0;
        while (removed < count) {
            const row = Math.floor(Math.random() * 9);
            const col = Math.floor(Math.random() * 9);
            if (grid[row][col] !== 0) {
                grid[row][col] = 0;
                removed++;
            }
        }
    }

    function renderSudoku() {
        const gridElement = document.getElementById('sudokuGrid');
        gridElement.innerHTML = '';
        
        for (let i = 0; i < 81; i++) {
            const row = Math.floor(i / 9);
            const col = i % 9;
            const cell = document.createElement('div');
            cell.className = 'sudoku-cell';
            if (sudokuGrid[row][col] !== 0) {
                cell.textContent = sudokuGrid[row][col];
                cell.classList.add('fixed');
            }
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', () => {
                document.querySelectorAll('.sudoku-cell').forEach(c => c.classList.remove('selected'));
                cell.classList.add('selected');
                selectedCell = cell;
            });
            gridElement.appendChild(cell);
        }
    }

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('sudoku-number-btn')) {
            const number = parseInt(e.target.dataset.number);
            if (selectedCell && !selectedCell.classList.contains('fixed')) {
                const row = parseInt(selectedCell.dataset.row);
                const col = parseInt(selectedCell.dataset.col);
                if (number === 0) {
                    selectedCell.textContent = '';
                    sudokuGrid[row][col] = 0;
            } else {
                    selectedCell.textContent = number;
                    sudokuGrid[row][col] = number;
                    if (solution[row][col] === number) {
                        selectedCell.classList.remove('error');
                    } else {
                        selectedCell.classList.add('error');
                    }
                }
            }
        }
    });

    window.generateSudoku = generateSudoku;
    generateSudoku();
}

// Crossword Game
function initCrossword(difficulty = 'medio') {
    window.currentDifficulty = difficulty;
    // Puzzle exemplo baseado na imagem
    const puzzle = {
        size: 15,
        grid: createCrosswordGrid(),
        clues: {
            horizontal: [
                { num: 1, word: 'PARTICULARIDADE', start: [0, 0], clue: 'Particularidade' },
                { num: 8, word: 'INDETERMINACAO', start: [2, 0], clue: 'Índice de indeterminação do sujeito' },
                { num: 9, word: 'MOELA', start: [4, 0], clue: 'Última bolsa do estômago das aves' },
                { num: 12, word: 'OXIGENIO', start: [6, 0], clue: 'Suprimento do traje do astronauta' },
                { num: 13, word: 'ENAMORAR', start: [8, 0], clue: 'Prender por laços amorosos (gír.)' },
                { num: 14, word: 'BAIXO', start: [10, 0], clue: 'Voz grave masculina' },
                { num: 15, word: 'OP', start: [12, 0], clue: 'Orçamento Participativo (sigla)' }
            ],
            vertical: [
                { num: 1, word: 'INTERMITENTE', start: [0, 0], clue: 'Relativo a um período em que alguma atividade regular é interrompida' },
                { num: 2, word: 'ASA', start: [0, 2], clue: '(?) Sala de Reboco, música de Luiz Gonzaga' },
                { num: 3, word: 'UTERO', start: [0, 4], clue: 'Órgão que se dilata na gravidez (Anat.)' },
                { num: 4, word: 'AGAR', start: [0, 6], clue: 'Serva de Sara (Bíblia)' },
                { num: 5, word: 'ANA', start: [0, 8], clue: '(?) Capeto, estilista brasileira' },
                { num: 6, word: 'DERAM', start: [0, 10], clue: 'Cederam; ofertaram' }
            ]
        }
    };

    const gameHTML = `
        <div class="crossword-container">
            <div class="crossword-left">
                <div class="crossword-header" id="crosswordHeader">
                    <button class="crossword-nav-btn" onclick="navigateCrosswordClue('prev')">‹</button>
                    <div class="crossword-header-info">
                        <span class="crossword-clue-num" id="crosswordClueNum">1</span>
                        <span class="crossword-clue-arrow">→</span>
                        <span class="crossword-clue-text" id="crosswordClueText">Particularidade</span>
                    </div>
                    <button class="crossword-nav-btn" onclick="navigateCrosswordClue('next')">›</button>
                </div>
                <div class="crossword-grid-container">
                    <div class="crossword-grid" id="crosswordGrid"></div>
                </div>
            </div>
            <div class="crossword-right">
                <div class="crossword-clues-section">
                    <h3 class="crossword-clues-title">HORIZONTAIS</h3>
                    <div class="crossword-clues-list" id="horizontalClues"></div>
                </div>
                <div class="crossword-clues-section">
                    <h3 class="crossword-clues-title">VERTICAIS</h3>
                    <div class="crossword-clues-list" id="verticalClues"></div>
                </div>
            </div>
        </div>
    `;
    gameContainer.innerHTML = gameHTML;

    // Inicializar estado
    window.crosswordState = {
        puzzle: puzzle,
        currentClue: { type: 'horizontal', num: 1 },
        activeCell: null
    };

    renderCrosswordGrid();
    renderCrosswordClues();
    selectCrosswordClue('horizontal', 1);
}

function createCrosswordGrid() {
    // Criar grid 15x15 vazio
    const grid = Array(15).fill(null).map(() => Array(15).fill(''));
    
    // Adicionar palavras exemplo (simplificado - em produção viria de um servidor)
    // Horizontal 1: PARTICULARIDADE (linha 0, col 0-14)
    const h1 = 'PARTICULARIDADE';
    for (let i = 0; i < h1.length; i++) {
        grid[0][i] = h1[i];
    }
    
    // Vertical 1: INTERMITENTE (col 0, linhas 0-11)
    const v1 = 'INTERMITENTE';
    for (let i = 0; i < v1.length; i++) {
        grid[i][0] = v1[i];
    }
    
    // Marcar células pretas (bloqueios)
    for (let row = 0; row < 15; row++) {
        for (let col = 0; col < 15; col++) {
            if (grid[row][col] === '') {
                grid[row][col] = null; // null = célula preta
            }
        }
    }
    
    return grid;
}

function renderCrosswordGrid() {
    const grid = document.getElementById('crosswordGrid');
    const puzzle = window.crosswordState.puzzle;
    
    grid.style.gridTemplateColumns = `repeat(${puzzle.size}, 1fr)`;
    grid.innerHTML = '';
    
    // Mapear números das pistas
    const clueNumbers = {};
    let clueNum = 1;
    
    puzzle.clues.horizontal.forEach(clue => {
        const [row, col] = clue.start;
        clueNumbers[`${row}-${col}`] = clue.num;
    });
    
    puzzle.clues.vertical.forEach(clue => {
        const [row, col] = clue.start;
        if (!clueNumbers[`${row}-${col}`]) {
            clueNumbers[`${row}-${col}`] = clue.num;
        }
    });
    
    for (let row = 0; row < puzzle.size; row++) {
        for (let col = 0; col < puzzle.size; col++) {
            const cell = document.createElement('div');
            cell.className = 'crossword-cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            if (puzzle.grid[row][col] === null) {
                cell.classList.add('black');
            } else {
                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1;
                input.style.textTransform = 'uppercase';
                input.dataset.row = row;
                input.dataset.col = col;
                
                // Adicionar número da pista
                const clueKey = `${row}-${col}`;
                if (clueNumbers[clueKey]) {
                    const label = document.createElement('span');
                    label.className = 'crossword-label';
                    label.textContent = clueNumbers[clueKey];
                    cell.appendChild(label);
                }
                
                input.addEventListener('focus', () => {
                    highlightCrosswordCell(row, col);
                });
                
                input.addEventListener('input', (e) => {
                    handleCrosswordInput(e, row, col);
                });
                
                input.addEventListener('keydown', (e) => {
                    handleCrosswordKeydown(e, row, col);
                });
                
                cell.appendChild(input);
            }
            
            grid.appendChild(cell);
        }
    }
}

function renderCrosswordClues() {
    const puzzle = window.crosswordState.puzzle;
    
    // Renderizar pistas horizontais
    const horizontalClues = document.getElementById('horizontalClues');
    horizontalClues.innerHTML = puzzle.clues.horizontal.map(clue => `
        <div class="crossword-clue-item" data-type="horizontal" data-num="${clue.num}" onclick="selectCrosswordClue('horizontal', ${clue.num})">
            <span class="crossword-clue-number">${clue.num}.</span>
            <span class="crossword-clue-text">${clue.clue}</span>
        </div>
    `).join('');
    
    // Renderizar pistas verticais
    const verticalClues = document.getElementById('verticalClues');
    verticalClues.innerHTML = puzzle.clues.vertical.map(clue => `
        <div class="crossword-clue-item" data-type="vertical" data-num="${clue.num}" onclick="selectCrosswordClue('vertical', ${clue.num})">
            <span class="crossword-clue-number">${clue.num}.</span>
            <span class="crossword-clue-text">${clue.clue}</span>
        </div>
    `).join('');
}

function selectCrosswordClue(type, num) {
    window.crosswordState.currentClue = { type, num };
    
    const puzzle = window.crosswordState.puzzle;
    const clue = puzzle.clues[type === 'horizontal' ? 'horizontal' : 'vertical'].find(c => c.num === num);
    
    if (!clue) return;
    
    // Atualizar header
    document.getElementById('crosswordClueNum').textContent = num;
    document.getElementById('crosswordClueText').textContent = clue.clue;
    
    // Destacar pista selecionada
    document.querySelectorAll('.crossword-clue-item').forEach(item => {
        item.classList.remove('selected');
        if (item.dataset.type === type && parseInt(item.dataset.num) === num) {
            item.classList.add('selected');
            if (type === 'horizontal') {
                item.classList.add('selected-horizontal');
            } else {
                item.classList.add('selected-vertical');
            }
        }
    });
    
    // Destacar células da palavra
    highlightCrosswordWord(clue, type);
    
    // Focar primeira célula
    const [row, col] = clue.start;
    const cell = document.querySelector(`.crossword-cell[data-row="${row}"][data-col="${col}"] input`);
    if (cell) {
        cell.focus();
    }
}

function highlightCrosswordWord(clue, direction) {
    // Remover destaques anteriores
    document.querySelectorAll('.crossword-cell').forEach(cell => {
        cell.classList.remove('active', 'word-highlight');
    });
    
    const [startRow, startCol] = clue.start;
    const word = clue.word;
    
    for (let i = 0; i < word.length; i++) {
        const row = direction === 'horizontal' ? startRow : startRow + i;
        const col = direction === 'horizontal' ? startCol + i : startCol;
        
        const cell = document.querySelector(`.crossword-cell[data-row="${row}"][data-col="${col}"]`);
        if (cell) {
            cell.classList.add('word-highlight');
            if (i === 0) {
                cell.classList.add('active');
            }
        }
    }
}

function highlightCrosswordCell(row, col) {
    document.querySelectorAll('.crossword-cell').forEach(cell => {
        cell.classList.remove('active');
    });
    
    const cell = document.querySelector(`.crossword-cell[data-row="${row}"][data-col="${col}"]`);
    if (cell) {
        cell.classList.add('active');
    }
}

function handleCrosswordInput(e, row, col) {
    const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
            e.target.value = value;
    
    // Mover para próxima célula automaticamente
    if (value && window.crosswordState.currentClue) {
        const clue = getCurrentCrosswordClue();
        if (clue) {
            const [startRow, startCol] = clue.start;
            const direction = window.crosswordState.currentClue.type === 'horizontal' ? 'horizontal' : 'vertical';
            const currentIndex = direction === 'horizontal' ? col - startCol : row - startRow;
            
            if (currentIndex < clue.word.length - 1) {
                const nextRow = direction === 'horizontal' ? row : row + 1;
                const nextCol = direction === 'horizontal' ? col + 1 : col;
                const nextCell = document.querySelector(`.crossword-cell[data-row="${nextRow}"][data-col="${nextCol}"] input`);
                if (nextCell) {
                    setTimeout(() => nextCell.focus(), 10);
                }
            }
        }
    }
}

function handleCrosswordKeydown(e, row, col) {
    const clue = getCurrentCrosswordClue();
    if (!clue) return;
    
    const direction = window.crosswordState.currentClue.type === 'horizontal' ? 'horizontal' : 'vertical';
    const [startRow, startCol] = clue.start;
    const currentIndex = direction === 'horizontal' ? col - startCol : row - startRow;
    
    if (e.key === 'Backspace' && !e.target.value) {
        // Voltar para célula anterior
        if (currentIndex > 0) {
            const prevRow = direction === 'horizontal' ? row : row - 1;
            const prevCol = direction === 'horizontal' ? col - 1 : col;
            const prevCell = document.querySelector(`.crossword-cell[data-row="${prevRow}"][data-col="${prevCol}"] input`);
            if (prevCell) {
                prevCell.focus();
            }
        }
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        // Navegar nas setas
        let nextRow = row;
        let nextCol = col;
        
        if (e.key === 'ArrowLeft') nextCol--;
        if (e.key === 'ArrowRight') nextCol++;
        if (e.key === 'ArrowUp') nextRow--;
        if (e.key === 'ArrowDown') nextRow++;
        
        const nextCell = document.querySelector(`.crossword-cell[data-row="${nextRow}"][data-col="${nextCol}"] input`);
        if (nextCell) {
            nextCell.focus();
        }
    }
}

function getCurrentCrosswordClue() {
    const state = window.crosswordState;
    const clues = state.puzzle.clues[state.currentClue.type === 'horizontal' ? 'horizontal' : 'vertical'];
    return clues.find(c => c.num === state.currentClue.num);
}

// Tornar funções globais para acesso via onclick
window.navigateCrosswordClue = function(direction) {
    const state = window.crosswordState;
    const clues = state.puzzle.clues[state.currentClue.type === 'horizontal' ? 'horizontal' : 'vertical'];
    const currentIndex = clues.findIndex(c => c.num === state.currentClue.num);
    
    let nextIndex;
    if (direction === 'next') {
        nextIndex = (currentIndex + 1) % clues.length;
    } else {
        nextIndex = (currentIndex - 1 + clues.length) % clues.length;
    }
    
    selectCrosswordClue(state.currentClue.type, clues[nextIndex].num);
};

window.selectCrosswordClue = selectCrosswordClue;

function checkCrossword() {
    const puzzle = window.crosswordState.puzzle;
    const inputs = document.querySelectorAll('.crossword-cell input');
    let correct = 0;
    let total = 0;
    
    inputs.forEach(input => {
        const row = parseInt(input.dataset.row);
        const col = parseInt(input.dataset.col);
        const value = input.value.toUpperCase();
        const expected = puzzle.grid[row][col];
        
        if (expected && expected !== null) {
            total++;
            if (value === expected) {
                input.style.background = '#c8e6c9';
                input.style.color = '#2e7d32';
                correct++;
            } else if (value !== '') {
                input.style.background = '#ffcdd2';
                input.style.color = '#c62828';
            }
        }
    });
    
    if (correct === total) {
        setTimeout(() => {
            alert('🎉 Parabéns! Você completou o jogo! 💕');
        }, 300);
    } else {
        alert(`Você acertou ${correct} de ${total} letras! Continue tentando! 💪`);
    }
}

// Soletra Game - Lista de palavras válidas (exemplo com conjunto de letras)
// Em produção, isso viria de um servidor com palavras do dia
const soletraWordLists = {
    // Exemplo: T, A, R, B, O, G, I (ordenado: ABGIORT)
    'ABGIORT': [
        // Palavras de 4 letras (valem 1 ponto)
        'ABRI', 'AGIR', 'AGRO', 'ARGO', 'BAGO', 'BARI', 'BIGA', 'BIGO', 'BIRA', 'BIRO',
        'BOIA', 'BORA', 'BOTA', 'BRIG', 'BRIT', 'GABO', 'GARO', 'GATO', 'GIRO', 'GOIA',
        'GOTA', 'GRAB', 'GRIT', 'IGAR', 'IRAR', 'ORAR', 'RABI', 'RAGO', 'RATO', 'RIGA',
        'RIGO', 'RIOT', 'ROTA', 'TABO', 'TAGO', 'TARO', 'TIRO', 'TOGA', 'TORA', 'TRAB',
        'TRIO', 'TROA',
        // Palavras de 5 letras (valem 5 pontos)
        'ABRIR', 'AGITO', 'ARGIR', 'BAGAR', 'BAGIR', 'BAGRO', 'BARRO', 'BIGAR', 'BIGOR',
        'BIRAR', 'BIRRO', 'BOBAR', 'BOGAR', 'BOGIR', 'BORAR', 'BORIR', 'BRIGA', 'BRIGO',
        'BRIOT', 'BROTA', 'GABAR', 'GABIR', 'GABRO', 'GARIR', 'GARRO', 'GIBAR', 'GIBOR',
        'GIRAR', 'GIRRO', 'GOBAR', 'GOBIR', 'GORAR', 'GORIR', 'GORRO', 'GRABO', 'GRABR',
        'GRITA', 'GRITO', 'IGARO', 'IRARO', 'ORABI', 'RABIR', 'RABOR', 'RAGAR', 'RAGIR',
        'RAGRO', 'RARIR', 'RARRO', 'RIGAR', 'RIGIR', 'RIGOR', 'RIGRO', 'RIRAR', 'RIRRO',
        'ROBAR', 'ROBIR', 'ROGAR', 'ROGIR', 'RORAR', 'RORIR', 'RORRO', 'TABAR', 'TABIR',
        'TABOR', 'TAGAR', 'TAGIR', 'TAGOR', 'TARGO', 'TARIR', 'TARRO', 'TIGAR', 'TIGRA',
        'TIGRE', 'TIGRO', 'TIRAR', 'TIRGO', 'TIRIR', 'TIRRO', 'TOBAR', 'TOBIR', 'TOGAR',
        'TOGIR', 'TOGRA', 'TOGRO', 'TROAR', 'TROBA', 'TROBO', 'TROGA', 'TROGO', 'TROIA',
        'TROIR', 'TROTA', 'TROTO',
        // Palavras de 6 letras (valem 6 pontos)
        'ABRITO', 'AGITAR', 'ARGITO', 'BAGARO', 'BAGIRO', 'BAGROI', 'BARITO', 'BIGARO',
        'BIGORO', 'BIRARO', 'BIRROA', 'BOBITA', 'BOGARO', 'BOGIRO', 'BORARO', 'BORITO',
        'BRIGAO', 'BRIGAR', 'BRIGOR', 'BROTAR', 'GABARO', 'GABIRO', 'GABROI', 'GARITO',
        'GIBARO', 'GIBORO', 'GIRARO', 'GIRROA', 'GOBITA', 'GORARO', 'GORITO', 'GRABAR',
        'GRABIR', 'GRABOR', 'GRABRO', 'GRITAR', 'GRITIR', 'GRITOR', 'IGAROT', 'IRAROT',
        'ORABIT', 'RABITO', 'RAGARO', 'RAGIRO', 'RAGROI', 'RARITO', 'RIGARO', 'RIGORO',
        'RIGROA', 'RIRARO', 'RIRROA', 'ROBITA', 'ROGARO', 'ROGIRO', 'RORARO', 'RORITO',
        'TABARO', 'TABIRO', 'TABROI', 'TAGARO', 'TAGIRO', 'TAGROI', 'TARITO', 'TIGARO',
        'TIGROA', 'TIRARO', 'TIRROA', 'TOBITA', 'TOGARO', 'TOGIRO', 'TROBAR', 'TROBIR',
        'TROBOR', 'TROBRO', 'TROGAR', 'TROGIR', 'TROGOR', 'TROGRO',
        // Palavras de 7 letras (valem 7 pontos) - Pangramas
        'ABRIGOT', 'AGITBOR', 'BAGIROT', 'BIGAROT', 'BIRAGOT', 'BOGIART', 'BORIGAT',
        'BRIGATO', 'GABIROT', 'GIBAROT', 'GIRABOT', 'GOBIRAT', 'GORIBAT', 'GRABITO',
        'GRITABO', 'IGARBOT', 'IRAGBOT', 'ORABGIT', 'RABIGOT', 'RAGIBOT', 'RIGABOT',
        'RIRABOT', 'ROBIGAT', 'ROGIBAT', 'RORIBAT', 'TABIGOR', 'TAGIBOR', 'TARIBOG',
        'TIGABOR', 'TIRABOG', 'TOBIGAR', 'TROBIGA',
        // Palavras de 8 letras (valem 8 pontos)
        'ABRIGATO', 'AGITBORO', 'BAGIROTA', 'BIGAROTO', 'BIRAGOTO', 'BOGIARTO', 'BORIGATO',
        'BRIGATOA', 'GABIROTA', 'GIBAROTO', 'GIRABOTO', 'GOBIRATO', 'GORIBATO', 'GRABITOA',
        'GRITABOR', 'IGARBOTO', 'IRAGBOTO', 'ORABGITO', 'RABIGOTO', 'RAGIBOTO', 'RIGABOTO',
        'RIRABOTO', 'ROBIGATO', 'ROGIBATO', 'RORIBATO', 'TABIGORO', 'TAGIBORO', 'TARIBOGO',
        'TIGABORO', 'TIRABOGO', 'TOBIGARO', 'TROBIGAO',
        // Palavras de 9 letras (valem 9 pontos)
        'ABRIGATOR', 'AGITBOROA', 'BAGIROTAB', 'BIGAROTAB', 'BIRAGOTAB', 'BOGIARTAB', 'BORIGATAB',
        'BRIGATOAB', 'GABIROTAB', 'GIBAROTAB', 'GIRABOTAB', 'GOBIRATAB', 'GORIBATAB', 'GRABITOAB',
        'GRITABORO', 'IGARBOTAB', 'IRAGBOTAB', 'ORABGITAB', 'RABIGOTAB', 'RAGIBOTAB', 'RIGABOTAB',
        'RIRABOTAB', 'ROBIGATAB', 'ROGIBATAB', 'RORIBATAB', 'TABIGORAB', 'TAGIBORAB', 'TARIBOGAB',
        'TIGABORAB', 'TIRABOGAB', 'TOBIGARAB', 'TROBIGAAB',
        // Palavras de 10 letras (valem 10 pontos)
        'ABRIGATORA', 'AGITBOROAB', 'BAGIROTABI', 'BIGAROTABI', 'BIRAGOTABI', 'BOGIARTABI', 'BORIGATABI',
        'BRIGATOABI', 'GABIROTABI', 'GIBAROTABI', 'GIRABOTABI', 'GOBIRATABI', 'GORIBATABI', 'GRABITOABI',
        'GRITABOROA', 'IGARBOTABI', 'IRAGBOTABI', 'ORABGITABI', 'RABIGOTABI', 'RAGIBOTABI', 'RIGABOTABI',
        'RIRABOTABI', 'ROBIGATABI', 'ROGIBATABI', 'RORIBATABI', 'TABIGORABI', 'TAGIBORABI', 'TARIBOGABI',
        'TIGABORABI', 'TIRABOGABI', 'TOBIGARABI', 'TROBIGAABI',
        // Palavras de 11 letras (valem 11 pontos)
        'ABRIGATORAB', 'AGITBOROABI', 'BAGIROTABIG', 'BIGAROTABIG', 'BIRAGOTABIG', 'BOGIARTABIG', 'BORIGATABIG',
        'BRIGATOABIG', 'GABIROTABIG', 'GIBAROTABIG', 'GIRABOTABIG', 'GOBIRATABIG', 'GORIBATABIG', 'GRABITOABIG',
        'GRITABOROAB', 'IGARBOTABIG', 'IRAGBOTABIG', 'ORABGITABIG', 'RABIGOTABIG', 'RAGIBOTABIG', 'RIGABOTABIG',
        'RIRABOTABIG', 'ROBIGATABIG', 'ROGIBATABIG', 'RORIBATABIG', 'TABIGORABIG', 'TAGIBORABIG', 'TARIBOGABIG',
        'TIGABORABIG', 'TIRABOGABIG', 'TOBIGARABIG', 'TROBIGAABIG'
    ],
    // Adicione mais conjuntos conforme necessário
};

// Função para gerar conjunto de letras do dia (baseado na data)
function getDailyLetters() {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    
    // Conjunto fixo para demonstração (TARBOGI)
    // Em produção, você teria múltiplos conjuntos rotativos
    const letterSets = [
        ['T', 'A', 'R', 'B', 'O', 'G', 'I'],
        ['C', 'A', 'M', 'P', 'O', 'S', 'E'],
        ['L', 'O', 'N', 'D', 'R', 'I', 'N'],
        ['M', 'A', 'R', 'I', 'A', 'E', 'D'],
        ['F', 'E', 'R', 'N', 'A', 'N', 'D']
    ];
    
    return letterSets[dayOfYear % letterSets.length];
}

// Soletra Game
function initSoletra(difficulty = 'medio') {
    window.currentDifficulty = difficulty;
    const letters = getDailyLetters();
    const centralLetter = letters[0]; // Primeira letra é a central
    const outerLetters = letters.slice(1); // Resto são as letras ao redor
    
    // Obter lista de palavras válidas para este conjunto
    // Criar chave ordenada alfabeticamente para buscar na lista
    const letterKey = [...letters].sort().join('');
    const validWords = soletraWordLists[letterKey] || [];
    
    // Se não encontrar lista específica, criar uma lista básica de palavras válidas
    // (Em produção, isso viria de um servidor)
    
    const gameHTML = `
        <div class="soletra-container">
            <div class="soletra-game-area">
                <p class="soletra-instruction">Digite ou clique</p>
                <div class="soletra-hexagon">
                    <div class="soletra-letter soletra-letter-central" data-letter="${centralLetter}">${centralLetter}</div>
                    ${outerLetters.map((letter, index) => `
                        <div class="soletra-letter soletra-letter-outer soletra-letter-${index}" data-letter="${letter}">${letter}</div>
                    `).join('')}
                </div>
                <div class="soletra-word-display" id="soletraWordDisplay"></div>
                <div class="soletra-controls">
                    <button class="soletra-btn soletra-btn-clear" onclick="clearSoletraWord()">Apagar</button>
                    <button class="soletra-btn soletra-btn-shuffle" onclick="shuffleSoletraLetters()" title="Embaralhar letras">🔄</button>
                    <button class="soletra-btn soletra-btn-confirm" onclick="confirmSoletraWord()">Confirmar</button>
                </div>
            </div>
            <div class="soletra-progress-area">
                <div class="soletra-level">
                    <h3 id="soletraLevelName">Iniciante</h3>
                    <div class="soletra-progress-bar">
                        <div class="soletra-progress-fill" id="soletraProgressFill"></div>
                    </div>
                    <p class="soletra-score" id="soletraScore">0 pontos</p>
                </div>
                <div class="soletra-found">
                    <div class="soletra-found-header">
                        <h4>Palavras já encontradas</h4>
                        <span class="soletra-found-count" id="soletraFoundCount">0/${validWords.length || 140}</span>
                    </div>
                    <div class="soletra-found-grid" id="soletraFoundGrid"></div>
                </div>
                <button class="soletra-btn-end" onclick="endSoletraGame()">
                    <span>🚪</span> Encerrar partida
                </button>
            </div>
        </div>
    `;
    gameContainer.innerHTML = gameHTML;

    // Inicializar estado do jogo
    window.soletraState = {
        letters: letters,
        centralLetter: centralLetter,
        outerLetters: outerLetters,
        validWords: validWords,
        foundWords: [],
        currentWord: '',
        score: 0,
        totalWords: validWords.length
    };

    // Adicionar event listeners
    document.querySelectorAll('.soletra-letter').forEach(letter => {
        letter.addEventListener('click', () => {
            addLetterToWord(letter.dataset.letter);
        });
    });

    // Listener para digitação
    document.addEventListener('keydown', handleSoletraKeyPress);
    
    updateSoletraDisplay();
}

function addLetterToWord(letter) {
    if (!window.soletraState) return;
    if (window.soletraState.currentWord.length >= 11) {
        alert('A palavra pode ter no máximo 11 letras!');
        return;
    }
    window.soletraState.currentWord += letter;
    updateSoletraWordDisplay();
}

function clearSoletraWord() {
    if (!window.soletraState) return;
    window.soletraState.currentWord = '';
    updateSoletraWordDisplay();
}

function shuffleSoletraLetters() {
    if (!window.soletraState) return;
    // Embaralhar apenas as letras externas
    const shuffled = [...window.soletraState.outerLetters].sort(() => Math.random() - 0.5);
    window.soletraState.outerLetters = shuffled;
    
    // Atualizar visualmente
    document.querySelectorAll('.soletra-letter-outer').forEach((el, index) => {
        el.textContent = shuffled[index];
        el.dataset.letter = shuffled[index];
    });
}

function updateSoletraWordDisplay() {
    if (!window.soletraState) return;
    const display = document.getElementById('soletraWordDisplay');
    if (display) {
        display.textContent = window.soletraState.currentWord || '';
    }
}

function handleSoletraKeyPress(e) {
    if (!window.soletraState) return;
    const key = e.key.toUpperCase();
    
    if (key === 'ENTER') {
        confirmSoletraWord();
    } else if (key === 'BACKSPACE' || key === 'DELETE') {
        if (window.soletraState.currentWord.length > 0) {
            window.soletraState.currentWord = window.soletraState.currentWord.slice(0, -1);
            updateSoletraWordDisplay();
        }
    } else if (window.soletraState.letters.includes(key)) {
        addLetterToWord(key);
    }
}

function confirmSoletraWord() {
    if (!window.soletraState) return;
    const word = window.soletraState.currentWord.toUpperCase().trim();
    
    if (!word || word.length < 4) {
        alert('A palavra deve ter pelo menos 4 letras!');
        return;
    }
    
    if (word.length > 11) {
        alert('A palavra deve ter no máximo 11 letras!');
        clearSoletraWord();
        return;
    }
    
    if (!word.includes(window.soletraState.centralLetter)) {
        alert(`A palavra deve conter a letra central "${window.soletraState.centralLetter}"!`);
        return;
    }
    
    if (window.soletraState.foundWords.includes(word)) {
        alert('Você já encontrou esta palavra!');
        clearSoletraWord();
        return;
    }
    
    // Verificar se a palavra é válida
    if (!window.soletraState.validWords.includes(word)) {
        alert('Esta palavra não está na lista válida!');
        clearSoletraWord();
        return;
    }
    
    // Verificar se usa apenas as letras disponíveis (permitindo repetição)
    const availableLetters = [...window.soletraState.letters];
    const wordLetters = word.split('');
    let valid = true;
    
    // Contar quantas vezes cada letra aparece na palavra
    const wordLetterCounts = {};
    for (let letter of wordLetters) {
        wordLetterCounts[letter] = (wordLetterCounts[letter] || 0) + 1;
    }
    
    // Verificar se temos letras suficientes
    const availableLetterCounts = {};
    for (let letter of availableLetters) {
        availableLetterCounts[letter] = (availableLetterCounts[letter] || 0) + 1;
    }
    
    for (let letter in wordLetterCounts) {
        if (!availableLetterCounts[letter] || wordLetterCounts[letter] > availableLetterCounts[letter]) {
            valid = false;
            break;
        }
    }
    
    if (!valid) {
        alert('A palavra contém letras que não estão disponíveis ou usa mais letras do que disponível!');
        clearSoletraWord();
        return;
    }
    
    // Palavra válida!
    window.soletraState.foundWords.push(word);
    const points = calculateSoletraPoints(word);
    window.soletraState.score += points;
    
    // Verificar se é pangrama
    const isPangram = isPangramWord(word);
    if (isPangram) {
        window.soletraState.score += 7;
        alert(`🎉 Pangrama! +7 pontos extras!`);
    }
    
    clearSoletraWord();
    updateSoletraDisplay();
}

function calculateSoletraPoints(word) {
    if (word.length === 4) {
        return 1;
    } else {
        return word.length;
    }
}

function isPangramWord(word) {
    if (!window.soletraState) return false;
    const uniqueLetters = new Set(word.split(''));
    return uniqueLetters.size === window.soletraState.letters.length;
}

function updateSoletraDisplay() {
    if (!window.soletraState) return;
    
    // Atualizar contador
    const foundCount = document.getElementById('soletraFoundCount');
    if (foundCount) {
        foundCount.textContent = `${window.soletraState.foundWords.length}/${window.soletraState.totalWords}`;
    }
    
    // Atualizar pontuação
    const scoreEl = document.getElementById('soletraScore');
    if (scoreEl) {
        scoreEl.textContent = `${window.soletraState.score} pontos`;
    }
    
    // Atualizar nível
    updateSoletraLevel();
    
    // Atualizar grid de palavras encontradas
    updateSoletraFoundGrid();
}

function updateSoletraLevel() {
    if (!window.soletraState) return;
    const score = window.soletraState.score;
    const totalWords = window.soletraState.totalWords;
    const foundWords = window.soletraState.foundWords.length;
    
    let levelName = 'Iniciante';
    let progress = 0;
    
    if (foundWords === totalWords) {
        levelName = 'ÁS DAS LETRAS';
        progress = 100;
    } else if (score >= 200) {
        levelName = 'Gênio';
        progress = Math.min(100, (score / 200) * 100);
    } else if (score >= 100) {
        levelName = 'Expert';
        progress = Math.min(100, ((score - 100) / 100) * 100);
    } else if (score >= 50) {
        levelName = 'Avançado';
        progress = Math.min(100, ((score - 50) / 50) * 100);
    } else if (score >= 20) {
        levelName = 'Intermediário';
        progress = Math.min(100, ((score - 20) / 30) * 100);
    } else {
        levelName = 'Iniciante';
        progress = Math.min(100, (score / 20) * 100);
    }
    
    const levelNameEl = document.getElementById('soletraLevelName');
    if (levelNameEl) {
        levelNameEl.textContent = levelName;
    }
    
    const progressFill = document.getElementById('soletraProgressFill');
    if (progressFill) {
        progressFill.style.width = `${progress}%`;
    }
}

function updateSoletraFoundGrid() {
    if (!window.soletraState) return;
    const grid = document.getElementById('soletraFoundGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    window.soletraState.foundWords.forEach(word => {
        const wordEl = document.createElement('div');
        wordEl.className = 'soletra-found-word';
        wordEl.textContent = word;
        grid.appendChild(wordEl);
    });
    
    // Adicionar placeholders vazios
    const emptySlots = 12 - window.soletraState.foundWords.length;
    for (let i = 0; i < emptySlots && i < 12; i++) {
        const emptyEl = document.createElement('div');
        emptyEl.className = 'soletra-found-word soletra-found-word-empty';
        emptyEl.textContent = '4 letras';
        grid.appendChild(emptyEl);
    }
}

function endSoletraGame() {
    if (!window.soletraState) return;
    if (confirm('Tem certeza que deseja encerrar a partida?')) {
        const finalScore = window.soletraState.score;
        const foundWords = window.soletraState.foundWords.length;
        const totalWords = window.soletraState.totalWords;
        
        alert(`Partida encerrada!\n\nPalavras encontradas: ${foundWords}/${totalWords}\nPontuação: ${finalScore} pontos\n\n${foundWords === totalWords ? '🎉 Parabéns! Você é o ÁS DAS LETRAS! 🎉' : ''}`);
        
        // Limpar estado
        window.soletraState = null;
        document.removeEventListener('keydown', handleSoletraKeyPress);
    }
}

function checkWord() {
    // Mantida para compatibilidade, mas não é mais usada
    confirmSoletraWord();
}

// Combinado Game
function initCombinado(difficulty = 'medio') {
    window.currentDifficulty = difficulty;
    const gameHTML = `
        <h2 style="text-align: center; color: var(--primary-color); margin-bottom: 2rem;">🧩 Combinado</h2>
        <p style="text-align: center; margin-bottom: 2rem; color: var(--text-light);">
            Descubra a relação secreta entre as palavras combinando-as em 4 grupos.<br>
            Clique nas palavras para movê-las aos grupos. Resolva o Combinado de hoje agora!
        </p>
        <div style="max-width: 700px; margin: 0 auto;">
            <div style="background: var(--bg-light); padding: 1.5rem; border-radius: 15px; margin-bottom: 2rem;">
                <h4 style="color: var(--primary-color); margin-bottom: 1rem; text-align: center;">Palavras Disponíveis:</h4>
                <div id="combinadoWords" style="display: flex; flex-wrap: wrap; gap: 0.8rem; justify-content: center;"></div>
            </div>
            <div id="combinadoGroups" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; margin-bottom: 2rem;"></div>
            <div style="text-align: center;">
                <button onclick="checkCombinado()" style="padding: 1rem 2rem; background: var(--gradient-1); color: white; border: none; border-radius: 25px; font-weight: 600; cursor: pointer; margin-right: 1rem;">Verificar</button>
                <button onclick="initCombinado()" style="padding: 1rem 2rem; background: var(--bg-light); color: var(--primary-color); border: 2px solid var(--primary-color); border-radius: 25px; font-weight: 600; cursor: pointer;">Novo Jogo</button>
            </div>
        </div>
    `;
    gameContainer.innerHTML = gameHTML;

    // Selecionar palavras e grupos baseado na dificuldade
    const difficultyData = {
        'facil': {
            allWords: ['AMOR', 'CARINHO', 'AFETO', 'RIO', 'PRAIA', 'MAR', 'OCEANO', 'SOL', 'LUZ', 'ESTRELA', 'LUA'],
            groups: [
                { name: 'Sentimentos', words: ['AMOR', 'CARINHO', 'AFETO'], color: '#ff6b9d' },
                { name: 'Água', words: ['RIO', 'PRAIA', 'MAR', 'OCEANO'], color: '#4fc3f7' },
                { name: 'Luz', words: ['SOL', 'LUZ', 'ESTRELA', 'LUA'], color: '#ffd54f' }
            ]
        },
        'medio': {
            allWords: ['AMOR', 'CARINHO', 'AFETO', 'RIO', 'PRAIA', 'MAR', 'OCEANO', 'SOL', 'LUZ', 'ESTRELA', 'LUA', 'FELICIDADE', 'ALEGRIA'],
            groups: [
                { name: 'Sentimentos', words: ['AMOR', 'CARINHO', 'AFETO', 'FELICIDADE'], color: '#ff6b9d' },
                { name: 'Água', words: ['RIO', 'PRAIA', 'MAR', 'OCEANO'], color: '#4fc3f7' },
                { name: 'Luz', words: ['SOL', 'LUZ', 'ESTRELA', 'LUA'], color: '#ffd54f' },
                { name: 'Emoções', words: ['ALEGRIA'], color: '#ff9800' }
            ]
        },
        'dificil': {
            allWords: ['AMOR', 'CARINHO', 'AFETO', 'RIO', 'PRAIA', 'MAR', 'OCEANO', 'SOL', 'LUZ', 'ESTRELA', 'LUA', 'FELICIDADE', 'ALEGRIA', 'COMPANHEIRISMO', 'DEDICACAO'],
            groups: [
                { name: 'Sentimentos', words: ['AMOR', 'CARINHO', 'AFETO'], color: '#ff6b9d' },
                { name: 'Água', words: ['RIO', 'PRAIA', 'MAR', 'OCEANO'], color: '#4fc3f7' },
                { name: 'Luz', words: ['SOL', 'LUZ', 'ESTRELA', 'LUA'], color: '#ffd54f' },
                { name: 'Qualidades', words: ['FELICIDADE', 'ALEGRIA', 'COMPANHEIRISMO', 'DEDICACAO'], color: '#9c27b0' }
            ]
        },
        'maria': {
            allWords: ['MARIA', 'EDUARDA', 'FERNANDO', 'AMOR', 'ETERNIDADE', 'COMPANHEIRISMO', 'DEDICACAO', 'ADMIRACAO', 'RESPEITO', 'CONFIANCA', 'COMPREENSAO', 'COMPROMISSO'],
            groups: [
                { name: 'Nomes', words: ['MARIA', 'EDUARDA', 'FERNANDO'], color: '#ff6b9d' },
                { name: 'Sentimentos', words: ['AMOR', 'ADMIRACAO'], color: '#e91e63' },
                { name: 'Valores', words: ['RESPEITO', 'CONFIANCA', 'COMPREENSAO'], color: '#4fc3f7' },
                { name: 'Compromissos', words: ['ETERNIDADE', 'COMPANHEIRISMO', 'DEDICACAO', 'COMPROMISSO'], color: '#ffd54f' }
            ]
        }
    };
    
    const gameData = difficultyData[window.currentDifficulty] || difficultyData['medio'];
    const allWords = gameData.allWords;
    const correctGroups = gameData.groups;
    
    window.combinadoState = {
        availableWords: [...allWords],
        groups: correctGroups.map(() => ({ words: [] })),
        correctGroups: correctGroups
    };

    const wordsContainer = document.getElementById('combinadoWords');
    const groupsContainer = document.getElementById('combinadoGroups');

    function renderWords() {
        wordsContainer.innerHTML = '';
        window.combinadoState.availableWords.forEach(word => {
            const wordDiv = document.createElement('div');
            wordDiv.className = 'word-tag';
            wordDiv.textContent = word;
            wordDiv.style.cursor = 'pointer';
            wordDiv.style.userSelect = 'none';
            wordDiv.dataset.word = word;
            wordDiv.addEventListener('click', () => {
                moveWordToGroup(word, null);
            });
            wordsContainer.appendChild(wordDiv);
        });
    }

    function renderGroups() {
        groupsContainer.innerHTML = '';
        correctGroups.forEach((group, index) => {
            const groupDiv = document.createElement('div');
            groupDiv.style.border = `3px dashed ${group.color}`;
            groupDiv.style.padding = '1.5rem';
            groupDiv.style.borderRadius = '15px';
            groupDiv.style.minHeight = '150px';
            groupDiv.style.background = `${group.color}15`;
            groupDiv.innerHTML = `
                <h4 style="color: ${group.color}; margin-bottom: 1rem; text-align: center; font-size: 1.2rem;">Grupo ${index + 1}</h4>
                <div id="group${index}" style="display: flex; flex-wrap: wrap; gap: 0.5rem; min-height: 80px;"></div>
            `;
            
            const groupContent = groupDiv.querySelector(`#group${index}`);
            window.combinadoState.groups[index].words.forEach(word => {
                const wordTag = document.createElement('span');
                wordTag.className = 'word-tag';
                wordTag.textContent = word;
                wordTag.style.cursor = 'pointer';
                wordTag.style.background = group.color;
                wordTag.style.color = 'white';
                wordTag.addEventListener('click', () => {
                    moveWordToGroup(word, index);
                });
                groupContent.appendChild(wordTag);
            });
            
            groupsContainer.appendChild(groupDiv);
        });
    }

    function moveWordToGroup(word, fromGroupIndex) {
        if (fromGroupIndex === null) {
            // Moving from available words to a group
            const groupIndex = prompt(`Escolha o grupo (1, 2 ou 3) para "${word}":`);
            if (groupIndex && ['1', '2', '3'].includes(groupIndex)) {
                const idx = parseInt(groupIndex) - 1;
                window.combinadoState.availableWords = window.combinadoState.availableWords.filter(w => w !== word);
                window.combinadoState.groups[idx].words.push(word);
                renderWords();
                renderGroups();
            }
        } else {
            // Moving from group back to available words
            window.combinadoState.groups[fromGroupIndex].words = window.combinadoState.groups[fromGroupIndex].words.filter(w => w !== word);
            window.combinadoState.availableWords.push(word);
            renderWords();
            renderGroups();
        }
    }

    renderWords();
    renderGroups();
}

function checkCombinado() {
    const state = window.combinadoState;
    let correct = 0;
    let total = 0;
    
    state.correctGroups.forEach((correctGroup, index) => {
        const userGroup = state.groups[index];
        total += correctGroup.words.length;
        
        const userWords = new Set(userGroup.words);
        const correctWords = new Set(correctGroup.words);
        
        correctGroup.words.forEach(word => {
            if (userWords.has(word)) {
                correct++;
            }
        });
    });
    
    if (correct === total && state.availableWords.length === 0) {
        alert('🎉 Parabéns! Você combinou todas as palavras corretamente! 💕');
    } else {
        const percentage = Math.round((correct / total) * 100);
        alert(`Você acertou ${correct} de ${total} palavras (${percentage}%)! Continue tentando! 💪`);
    }
}

// Dito Game (Wordle-like)
function initDito(difficulty = 'medio') {
    window.currentDifficulty = difficulty;
    const gameHTML = `
        <h2 style="text-align: center; color: var(--primary-color); margin-bottom: 2rem;">🎯 Dito</h2>
        <p style="text-align: center; margin-bottom: 2rem; color: var(--text-light);">
            Adivinhe a palavra secreta do dia em apenas 6 tentativas.<br>
            Uma palavra nova por dia! Já descobriu a palavra de hoje?
        </p>
        <div style="max-width: 400px; margin: 0 auto;">
            <div id="ditoGrid" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.5rem; margin-bottom: 2rem;"></div>
            <div class="word-input">
                <input type="text" id="ditoInput" placeholder="Digite uma palavra de 5 letras..." maxlength="5">
                <button onclick="submitDito()" style="margin-top: 1rem; padding: 0.8rem 2rem; background: var(--gradient-1); color: white; border: none; border-radius: 25px; font-weight: 600; cursor: pointer; width: 100%;">Tentar</button>
            </div>
            <p style="text-align: center; margin-top: 1rem; color: var(--text-light);">
                Tentativas restantes: <span id="ditoAttempts">6</span>
            </p>
        </div>
    `;
    gameContainer.innerHTML = gameHTML;

    // Selecionar palavras baseado na dificuldade
    const difficultyWords = {
        'facil': ['AMOR', 'VIDA', 'SONHO', 'FELIZ', 'DOÇURA', 'CARINHO', 'PAZ', 'ALEGRIA'],
        'medio': ['AMOR', 'VIDA', 'SONHO', 'FELIZ', 'DOÇURA', 'CARINHO', 'PAZ', 'ALEGRIA', 'ESPERANCA', 'FORTALEZA'],
        'dificil': ['AMOR', 'VIDA', 'SONHO', 'FELIZ', 'DOÇURA', 'CARINHO', 'PAZ', 'ALEGRIA', 'ESPERANCA', 'FORTALEZA', 'SABEDORIA', 'PERSISTENCIA'],
        'maria': ['MARIAEDUARDA', 'FERNANDO', 'ETERNIDADE', 'COMPANHEIRISMO', 'DEDICACAO', 'ADMIRACAO', 'COMPREENSAO', 'COMPROMISSO', 'RESPEITO', 'CONFIANCA']
    };
    
    const words = difficultyWords[window.currentDifficulty] || difficultyWords['medio'];
    
    // Ajustar tamanho da palavra baseado na dificuldade
    const wordLengths = {
        'facil': 4,
        'medio': 5,
        'dificil': 6,
        'maria': 7
    };
    
    const targetLength = wordLengths[window.currentDifficulty] || 5;
    const filteredWords = words.filter(w => w.length === targetLength);
    const secretWord = filteredWords.length > 0 ? filteredWords[Math.floor(Math.random() * filteredWords.length)].toUpperCase() : words[Math.floor(Math.random() * words.length)].toUpperCase();
    
    window.ditoSecretWord = secretWord;
    window.ditoAttempts = 6;
    window.ditoCurrentRow = 0;
    
    // Ajustar grid baseado no tamanho da palavra
    const gridCols = targetLength;
    const gridRows = 6;
    document.getElementById('ditoGrid').style.gridTemplateColumns = `repeat(${gridCols}, 1fr)`;
    
    // Limpar grid anterior e criar novo
    const grid = document.getElementById('ditoGrid');
    grid.innerHTML = '';
    for (let i = 0; i < gridRows * gridCols; i++) {
        const cell = document.createElement('div');
        cell.className = 'letter-box';
        cell.style.width = '60px';
        cell.style.height = '60px';
        cell.id = `ditoCell${i}`;
        grid.appendChild(cell);
    }
    
    // Ajustar input maxlength
    document.getElementById('ditoInput').maxLength = targetLength;
    document.getElementById('ditoInput').placeholder = `Digite uma palavra de ${targetLength} letras...`;

    const ditoInput = document.getElementById('ditoInput');
    ditoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            submitDito();
        }
    });
}

function submitDito() {
    const input = document.getElementById('ditoInput');
    const word = input.value.toUpperCase().trim();
    const attempts = document.getElementById('ditoAttempts');
    
    const wordLengths = {
        'facil': 4,
        'medio': 5,
        'dificil': 6,
        'maria': 7
    };
    const targetLength = wordLengths[window.currentDifficulty] || 5;

    if (word.length !== targetLength) {
        alert(`Digite uma palavra com exatamente ${targetLength} letras!`);
        return;
    }

    if (window.ditoAttempts <= 0) {
        alert(`Game Over! A palavra era: ${window.ditoSecretWord}`);
        return;
    }

    const row = window.ditoCurrentRow;
    const secretWord = window.ditoSecretWord;
    const wordLength = secretWord.length;

    for (let i = 0; i < wordLength; i++) {
        const cell = document.getElementById(`ditoCell${row * wordLength + i}`);
        cell.textContent = word[i];
        
        if (word[i] === secretWord[i]) {
            cell.style.background = '#4caf50';
        } else if (secretWord.includes(word[i])) {
            cell.style.background = '#ffc107';
        } else {
            cell.style.background = '#9e9e9e';
        }
    }

    if (word === secretWord) {
        alert('Parabéns! Você acertou! 💕');
        return;
    }

    window.ditoCurrentRow++;
    window.ditoAttempts--;
    attempts.textContent = window.ditoAttempts;
    input.value = '';

    if (window.ditoAttempts === 0) {
        alert(`Game Over! A palavra era: ${secretWord}`);
    }
}

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 100) {
        header.style.boxShadow = '0 2px 20px rgba(255, 107, 157, 0.3)';
    } else {
        header.style.boxShadow = '0 2px 20px rgba(255, 107, 157, 0.1)';
    }
});

// Login Modal for Dominó
const loginModal = document.getElementById('loginModal');
const closeLogin = document.querySelector('.close-login');
let currentPlayer = null;

function showLoginModal() {
    gameModal.classList.remove('active');
    loginModal.classList.add('active');
}

if (closeLogin) {
    closeLogin.addEventListener('click', () => {
        loginModal.classList.remove('active');
    });
}

if (loginModal) {
    loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.classList.remove('active');
        }
    });
}

const loginButtons = document.querySelectorAll('.login-btn');
loginButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        currentPlayer = btn.dataset.player;
        loginModal.classList.remove('active');
        initDomino();
    });
});

// Dominó Game System
let dominoGameState = {
    roomId: null,
    players: [],
    currentPlayer: null,
    board: [],
    hands: {},
    stock: [], // Monte de peças
    turn: 0,
    gameStarted: false,
    chat: [],
    scores: {
        maria: 0,
        fernando: 0
    },
    gameHistory: [],
    targetScore: 100, // Pontuação alvo (50, 100, 150, 200)
    currentScores: {
        maria: 0,
        fernando: 0
    }
};

function initDomino() {
    gameModal.classList.add('active');
    
    // Verificar se já existe um jogo em andamento
    const savedRoom = localStorage.getItem('dominoRoom');
    if (savedRoom) {
        const roomData = JSON.parse(savedRoom);
        dominoGameState = roomData;
        
        // Se já tem 2 jogadores e jogo iniciado, mostrar o jogo
        if (roomData.players && roomData.players.length === 2 && roomData.gameStarted) {
            renderGameDirectly();
            return;
        }
    }
    
    // Inicializar estado se não existir
    if (!dominoGameState.players || dominoGameState.players.length === 0) {
        dominoGameState.players = [];
        dominoGameState.scores = { maria: 0, fernando: 0 };
        dominoGameState.currentScores = { maria: 0, fernando: 0 };
        dominoGameState.targetScore = 100;
        dominoGameState.stock = [];
    }
    
    const gameHTML = `
        <h2 style="text-align: center; color: var(--primary-color); margin-bottom: 2rem;">🎲 Dominó</h2>
        <div class="domino-room">
            <div class="simple-room-controls">
                <div class="players-setup">
                    <h3 style="color: var(--primary-color); margin-bottom: 1.5rem; text-align: center;">👥 Escolha os Jogadores</h3>
                    <div class="player-select-buttons">
                        <button class="player-select-btn ${dominoGameState.players.includes('maria') ? 'selected' : ''}" 
                                onclick="togglePlayer('maria')" 
                                id="btnMaria">
                            <div class="player-select-avatar">👩</div>
                            <div class="player-select-name">Maria Eduarda</div>
                            ${dominoGameState.players.includes('maria') ? '<div class="player-select-check">✓</div>' : ''}
                        </button>
                        <button class="player-select-btn ${dominoGameState.players.includes('fernando') ? 'selected' : ''}" 
                                onclick="togglePlayer('fernando')" 
                                id="btnFernando">
                            <div class="player-select-avatar">👨</div>
                            <div class="player-select-name">Fernando</div>
                            ${dominoGameState.players.includes('fernando') ? '<div class="player-select-check">✓</div>' : ''}
                        </button>
                    </div>
                    <div class="start-game-section">
                        <button class="start-game-btn" onclick="startDominoGame()" 
                                ${dominoGameState.players.length < 2 ? 'disabled' : ''}
                                id="startGameBtn">
                            <span class="btn-icon">🎮</span>
                            <span class="btn-text">Começar Partida</span>
                        </button>
                        ${dominoGameState.players.length < 2 ? 
                            '<p class="players-hint">Selecione 2 jogadores para começar</p>' : 
                            '<p class="players-hint ready">Pronto para começar! 🎉</p>'}
                    </div>
                </div>
            </div>
            <div id="gameArea" style="display: none;"></div>
        </div>
    `;
    gameContainer.innerHTML = gameHTML;
}

function togglePlayer(player) {
    const index = dominoGameState.players.indexOf(player);
    
    if (index === -1) {
        // Adicionar jogador
        if (dominoGameState.players.length < 2) {
            dominoGameState.players.push(player);
        } else {
            alert('Máximo de 2 jogadores!');
            return;
        }
    } else {
        // Remover jogador
        dominoGameState.players.splice(index, 1);
    }
    
    // Atualizar UI
    const btn = document.getElementById(`btn${player === 'maria' ? 'Maria' : 'Fernando'}`);
    const startBtn = document.getElementById('startGameBtn');
    const hint = document.querySelector('.players-hint');
    
    if (btn) {
        if (dominoGameState.players.includes(player)) {
            btn.classList.add('selected');
            btn.innerHTML = `
                <div class="player-select-avatar">${player === 'maria' ? '👩' : '👨'}</div>
                <div class="player-select-name">${player === 'maria' ? 'Maria Eduarda' : 'Fernando'}</div>
                <div class="player-select-check">✓</div>
            `;
        } else {
            btn.classList.remove('selected');
            btn.innerHTML = `
                <div class="player-select-avatar">${player === 'maria' ? '👩' : '👨'}</div>
                <div class="player-select-name">${player === 'maria' ? 'Maria Eduarda' : 'Fernando'}</div>
            `;
        }
    }
    
    if (startBtn) {
        startBtn.disabled = dominoGameState.players.length < 2;
    }
    
    if (hint) {
        if (dominoGameState.players.length < 2) {
            hint.textContent = 'Selecione 2 jogadores para começar';
            hint.classList.remove('ready');
        } else {
            hint.textContent = 'Pronto para começar! 🎉';
            hint.classList.add('ready');
        }
    }
    
    saveGameState();
}

function startDominoGame() {
    if (dominoGameState.players.length < 2) {
        alert('Selecione 2 jogadores para começar!');
        return;
    }
    
    // Esconder controles e mostrar área do jogo
    document.querySelector('.simple-room-controls').style.display = 'none';
    document.getElementById('gameArea').style.display = 'block';
    
    // Mostrar modal de seleção de modo
    showScoreModeModal();
}

function renderGameDirectly() {
    document.querySelector('.simple-room-controls')?.style.setProperty('display', 'none');
    const gameArea = document.getElementById('gameArea');
    if (gameArea) {
        gameArea.style.display = 'block';
    }
    renderGame();
}

function createRoom() {
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    dominoGameState.roomId = roomId;
    dominoGameState.players = [currentPlayer];
    dominoGameState.currentPlayer = currentPlayer;
    dominoGameState.gameStarted = false;
    
    // Inicializar valores padrão
    if (!dominoGameState.scores) {
        dominoGameState.scores = { maria: 0, fernando: 0 };
    }
    if (!dominoGameState.currentScores) {
        dominoGameState.currentScores = { maria: 0, fernando: 0 };
    }
    if (!dominoGameState.targetScore) {
        dominoGameState.targetScore = 100;
    }
    if (!dominoGameState.stock) {
        dominoGameState.stock = [];
    }
    
    saveGameState();
    loadRoom();
}

function joinRoom() {
    const roomIdInput = document.getElementById('roomIdInput');
    const roomId = roomIdInput.value.trim().toUpperCase();
    
    if (!roomId) {
        alert('Digite o ID da sala!');
        return;
    }
    
    const savedRoom = localStorage.getItem('dominoRoom');
    if (savedRoom) {
        const roomData = JSON.parse(savedRoom);
        if (roomData.roomId === roomId) {
            if (!roomData.players.includes(currentPlayer)) {
                roomData.players.push(currentPlayer);
                dominoGameState = roomData;
                saveGameState();
                loadRoom();
            } else {
                dominoGameState = roomData;
                loadRoom();
            }
        } else {
            alert('Sala não encontrada!');
        }
    } else {
        alert('Sala não encontrada! Crie uma nova sala.');
    }
}

function loadRoom() {
    document.getElementById('roomIdDisplay').textContent = dominoGameState.roomId;
    document.getElementById('roomInfo').style.display = 'block';
    
    updatePlayersList();
    
    if (dominoGameState.players.length === 2 && !dominoGameState.gameStarted) {
        // Mostrar modal de seleção de modo
        showScoreModeModal();
    } else if (dominoGameState.players.length < 2) {
        showWaitingMessage();
    } else {
        renderGame();
    }
}

function showScoreModeModal() {
    const modal = document.createElement('div');
    modal.className = 'score-mode-modal';
    modal.innerHTML = `
        <div class="score-mode-content">
            <h2>🎯 Escolha o Modo de Pontuação</h2>
            <p style="margin-bottom: 2rem; color: var(--text-light);">Primeiro a atingir a pontuação escolhida vence!</p>
            <div class="score-mode-options">
                <button class="score-mode-btn" onclick="selectScoreMode(50)">
                    <div class="score-mode-icon">50</div>
                    <div class="score-mode-label">Rápido</div>
                    <div class="score-mode-desc">50 pontos</div>
                </button>
                <button class="score-mode-btn" onclick="selectScoreMode(100)">
                    <div class="score-mode-icon">100</div>
                    <div class="score-mode-label">Normal</div>
                    <div class="score-mode-desc">100 pontos</div>
                </button>
                <button class="score-mode-btn" onclick="selectScoreMode(150)">
                    <div class="score-mode-icon">150</div>
                    <div class="score-mode-label">Longo</div>
                    <div class="score-mode-desc">150 pontos</div>
                </button>
                <button class="score-mode-btn" onclick="selectScoreMode(200)">
                    <div class="score-mode-icon">200</div>
                    <div class="score-mode-label">Épico</div>
                    <div class="score-mode-desc">200 pontos</div>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 100);
}

function selectScoreMode(score) {
    dominoGameState.targetScore = score;
    dominoGameState.currentScores = { maria: 0, fernando: 0 };
    
    const modal = document.querySelector('.score-mode-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }
    
    startGame();
}

function updatePlayersList() {
    const playersList = document.getElementById('playersList');
    playersList.innerHTML = '';
    
    dominoGameState.players.forEach(player => {
        const badge = document.createElement('span');
        badge.className = 'player-badge';
        badge.textContent = player === 'maria' ? 'Maria Eduarda 👩' : 'Fernando 👨';
        if (player === currentPlayer) {
            badge.classList.add('current');
        }
        playersList.appendChild(badge);
    });
}

function showWaitingMessage() {
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = `
        <div class="waiting-message">
            <p>⏳ Aguardando outro jogador entrar na sala...</p>
            <p style="margin-top: 1rem;">Compartilhe o ID da sala: <strong>${dominoGameState.roomId}</strong></p>
            <p style="margin-top: 1rem; font-size: 0.9rem; color: var(--text-light);">
                💡 <strong>Como jogar:</strong><br>
                1. Um de vocês cria a sala e compartilha o ID<br>
                2. O outro entra no mesmo dispositivo/navegador e digita o ID<br>
                3. Ambos podem jogar alternando no mesmo dispositivo<br>
                4. Ou use o botão "Atualizar" para sincronizar manualmente
            </p>
        </div>
    `;
    
    // Check for updates every 2 seconds
    setTimeout(() => {
        const savedRoom = localStorage.getItem('dominoRoom');
        if (savedRoom) {
            const roomData = JSON.parse(savedRoom);
            if (roomData.players.length === 2) {
                dominoGameState = roomData;
                startGame();
            }
        }
    }, 2000);
}

function startGame() {
    dominoGameState.gameStarted = true;
    
    // Initialize chat if not exists
    if (!dominoGameState.chat) {
        dominoGameState.chat = [];
    }
    
    // Initialize scores if not exists
    if (!dominoGameState.scores) {
        dominoGameState.scores = {
            maria: 0,
            fernando: 0
        };
    }
    
    if (!dominoGameState.currentScores) {
        dominoGameState.currentScores = {
            maria: 0,
            fernando: 0
        };
    }
    
    if (!dominoGameState.targetScore) {
        dominoGameState.targetScore = 100;
    }
    
    // Create domino pieces (0-0 to 6-6) - total 28 peças
    const pieces = [];
    for (let i = 0; i <= 6; i++) {
        for (let j = i; j <= 6; j++) {
            pieces.push([i, j]);
        }
    }
    
    // Shuffle pieces
    pieces.sort(() => Math.random() - 0.5);
    
    // Deal pieces (7 each) - restante vai para o monte
    dominoGameState.hands = {
        [dominoGameState.players[0]]: pieces.slice(0, 7),
        [dominoGameState.players[1]]: pieces.slice(7, 14)
    };
    
    // Restante das peças vai para o monte (14 peças restantes)
    dominoGameState.stock = pieces.slice(14);
    
    // Reset board and turn
    dominoGameState.board = [];
    dominoGameState.turn = 0;
    
    saveGameState();
    renderGame();
}

function renderGame() {
    const gameArea = document.getElementById('gameArea');
    const currentPlayerName = dominoGameState.players[dominoGameState.turn % 2];
    const isMyTurn = currentPlayerName === currentPlayer;
    const myHand = dominoGameState.hands[currentPlayer] || [];
    const opponentName = dominoGameState.players.find(p => p !== currentPlayer);
    const opponentHand = dominoGameState.hands[opponentName] || [];
    
    const playerNames = {
        maria: 'Maria Eduarda',
        fernando: 'Fernando'
    };
    
    gameArea.innerHTML = `
        <div class="domino-game-container">
            <!-- Opponent Panel -->
            <div class="player-panel opponent-panel">
                <div class="player-info">
                    <div class="player-avatar">${opponentName === 'maria' ? '👩' : '👨'}</div>
                    <div class="player-details">
                        <div class="player-name">${playerNames[opponentName] || 'Oponente'}</div>
                        <div class="player-pieces">(${opponentHand.length} peças)</div>
                    </div>
                    <div class="player-score">${dominoGameState.scores && dominoGameState.scores[opponentName] ? dominoGameState.scores[opponentName] : 0} vitórias</div>
                </div>
            </div>
            
            <div class="domino-main-area">
                <!-- Game Board -->
                <div class="domino-board-game" id="dominoBoardGame">
                    ${renderBoardGame()}
                </div>
                
                <!-- Score Display -->
                <div class="domino-score-display">
                    <div class="score-display-item">
                        <span class="score-label">${playerNames.maria}</span>
                        <span class="score-value">${dominoGameState.currentScores ? dominoGameState.currentScores.maria : 0}</span>
                        <span class="score-target">/ ${dominoGameState.targetScore || 100}</span>
                    </div>
                    <div class="score-display-item">
                        <span class="score-label">${playerNames.fernando}</span>
                        <span class="score-value">${dominoGameState.currentScores ? dominoGameState.currentScores.fernando : 0}</span>
                        <span class="score-target">/ ${dominoGameState.targetScore || 100}</span>
                    </div>
                </div>
                
                <!-- Chat Area -->
                <div class="domino-chat-container">
                    <div class="chat-header">
                        <h4>💬 Chat</h4>
                        <button onclick="toggleChat()" class="chat-toggle-btn">−</button>
                    </div>
                    <div class="chat-messages" id="chatMessages">
                        <!-- Messages will be added here -->
                    </div>
                    <div class="chat-input-area">
                        <input type="text" id="chatInput" placeholder="Digite sua mensagem..." maxlength="200">
                        <button onclick="sendMessage()" class="chat-send-btn">Enviar</button>
                    </div>
                </div>
            </div>
            
            <!-- Current Player Panel -->
            <div class="player-panel current-panel">
                <div class="player-info">
                    <div class="player-score">${dominoGameState.scores && dominoGameState.scores[currentPlayer] ? dominoGameState.scores[currentPlayer] : 0} vitórias</div>
                    <div class="player-details">
                        <div class="player-name">Você</div>
                        <div class="player-pieces">(${myHand.length} peças)</div>
                    </div>
                    <div class="player-avatar">${currentPlayer === 'maria' ? '👩' : '👨'}</div>
                </div>
            </div>
            
            <!-- Player Hand -->
            <div class="domino-hand-game" id="dominoHandGame">
                ${renderHandGame(myHand)}
            </div>
            
            <!-- Game Status -->
            <div class="game-status-bar">
                <span class="status-text">${isMyTurn ? '🎯 Sua vez de jogar!' : `⏳ Aguardando ${playerNames[opponentName]} jogar...`}</span>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    ${isMyTurn && dominoGameState.stock && dominoGameState.stock.length > 0 ? 
                        `<button onclick="buyPiece()" class="refresh-btn" style="background: #f39c12;" title="Comprar peça do monte">🛒 Comprar Peça</button>` : ''}
                    <button onclick="toggleFullscreen()" class="refresh-btn fullscreen-btn" title="Tela cheia">⛶</button>
                    <button onclick="showDominoHistory()" class="refresh-btn" style="background: #667eea;">📊 Histórico</button>
                    <button onclick="restartGame()" class="refresh-btn" style="background: #e74c3c;">🔄 Nova Partida</button>
                    <button onclick="refreshGame()" class="refresh-btn">🔄 Atualizar</button>
                </div>
            </div>
        </div>
    `;
    
    // Load chat messages
    loadChatMessages();
    
    // Setup chat input enter key
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Auto-refresh every 3 seconds
    if (window.dominoRefreshInterval) {
        clearInterval(window.dominoRefreshInterval);
    }
    // Só iniciar refresh se o modal estiver aberto
    if (gameModal && gameModal.classList.contains('active')) {
        window.dominoRefreshInterval = setInterval(refreshGame, 3000);
    }
}

function renderBoardGame() {
    const stockCount = dominoGameState.stock ? dominoGameState.stock.length : 0;
    const currentPlayerName = dominoGameState.players && dominoGameState.players.length > 0 
        ? dominoGameState.players[dominoGameState.turn % 2] 
        : null;
    const isMyTurn = currentPlayerName === currentPlayer;
    const canBuy = isMyTurn && stockCount > 0;
    
    let html = '<div class="board-pieces-container">';
    
    // Renderizar peças do tabuleiro
    if (dominoGameState.board.length === 0) {
        html += '<div class="empty-board-message">Nenhuma peça no tabuleiro ainda. Seja o primeiro a jogar!</div>';
    } else {
        dominoGameState.board.forEach((piece, index) => {
            const [left, right] = piece;
            const orientation = determinePieceOrientation(index);
            html += createDominoPieceGameHTML(left, right, index, false, orientation);
        });
    }
    
    // Adicionar monte de peças no centro
    
    html += `
        <div class="domino-stock ${canBuy ? 'clickable' : ''}" 
             id="dominoStock" 
             title="Monte de peças (${stockCount} restantes)${canBuy ? ' - Clique para comprar' : ''}"
             ${canBuy ? 'onclick="buyPiece()"' : ''}>
            <div class="stock-pieces">
                ${stockCount > 0 ? Array(Math.min(stockCount, 5)).fill(0).map((_, i) => `
                    <div class="stock-piece" style="transform: rotate(${i * 15}deg) translateY(-${i * 2}px); z-index: ${5 - i};">
                        <div class="stock-piece-back"></div>
                    </div>
                `).join('') : ''}
            </div>
            <div class="stock-count">${stockCount}</div>
        </div>
    `;
    
    html += '</div>';
    return html;
}

function determinePieceOrientation(index) {
    // First piece is vertical, then alternate or based on board layout
    if (index === 0) return 'vertical';
    // Simple logic: alternate between horizontal and vertical for visual variety
    // In real game, this would be based on actual board layout
    return index % 2 === 0 ? 'vertical' : 'horizontal';
}

function renderHandGame(hand) {
    if (hand.length === 0) {
        return '<div class="empty-hand">🎉 Você não tem mais peças! Você venceu!</div>';
    }
    
    let html = '<div class="hand-pieces-container">';
    hand.forEach((piece, index) => {
        const [left, right] = piece;
        html += createDominoPieceGameHTML(left, right, index, true, 'horizontal');
    });
    html += '</div>';
    return html;
}

function createDominoPieceGameHTML(left, right, index, isHand, orientation) {
    const dotsLeft = generateDotsGame(left);
    const dotsRight = generateDotsGame(right);
    const pieceClass = isHand ? 'domino-piece-hand' : `domino-piece-board domino-piece-${orientation}`;
    const onClick = isHand ? `onclick="playPiece(${left}, ${right})"` : '';
    
    return `
        <div class="${pieceClass}" 
             data-left="${left}" 
             data-right="${right}" 
             data-index="${index}"
             ${onClick}
             style="cursor: ${isHand ? 'pointer' : 'default'};">
            <div class="domino-half">${dotsLeft}</div>
            <div class="domino-divider-game"></div>
            <div class="domino-half">${dotsRight}</div>
        </div>
    `;
}

function generateDotsGame(value) {
    const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22'];
    const color = colors[value] || '#2d3436';
    
    const dotPatterns = {
        0: '',
        1: `<div class="domino-dot-game" style="grid-column: 2; grid-row: 2; background: ${color};"></div>`,
        2: `<div class="domino-dot-game" style="grid-column: 1; grid-row: 1; background: ${color};"></div><div class="domino-dot-game" style="grid-column: 3; grid-row: 3; background: ${color};"></div>`,
        3: `<div class="domino-dot-game" style="grid-column: 1; grid-row: 1; background: ${color};"></div><div class="domino-dot-game" style="grid-column: 2; grid-row: 2; background: ${color};"></div><div class="domino-dot-game" style="grid-column: 3; grid-row: 3; background: ${color};"></div>`,
        4: `<div class="domino-dot-game" style="grid-column: 1; grid-row: 1; background: ${color};"></div><div class="domino-dot-game" style="grid-column: 3; grid-row: 1; background: ${color};"></div><div class="domino-dot-game" style="grid-column: 1; grid-row: 3; background: ${color};"></div><div class="domino-dot-game" style="grid-column: 3; grid-row: 3; background: ${color};"></div>`,
        5: `<div class="domino-dot-game" style="grid-column: 1; grid-row: 1; background: ${color};"></div><div class="domino-dot-game" style="grid-column: 3; grid-row: 1; background: ${color};"></div><div class="domino-dot-game" style="grid-column: 2; grid-row: 2; background: ${color};"></div><div class="domino-dot-game" style="grid-column: 1; grid-row: 3; background: ${color};"></div><div class="domino-dot-game" style="grid-column: 3; grid-row: 3; background: ${color};"></div>`,
        6: `<div class="domino-dot-game" style="grid-column: 1; grid-row: 1; background: ${color};"></div><div class="domino-dot-game" style="grid-column: 3; grid-row: 1; background: ${color};"></div><div class="domino-dot-game" style="grid-column: 1; grid-row: 2; background: ${color};"></div><div class="domino-dot-game" style="grid-column: 3; grid-row: 2; background: ${color};"></div><div class="domino-dot-game" style="grid-column: 1; grid-row: 3; background: ${color};"></div><div class="domino-dot-game" style="grid-column: 3; grid-row: 3; background: ${color};"></div>`
    };
    return dotPatterns[value] || '';
}

function buyPiece() {
    if (!dominoGameState.gameStarted) {
        alert('O jogo ainda não começou!');
        return;
    }
    
    if (!dominoGameState.players || dominoGameState.players.length < 2) {
        alert('Aguardando outro jogador entrar na sala...');
        return;
    }
    
    const currentTurnPlayer = dominoGameState.players[dominoGameState.turn % 2];
    if (currentTurnPlayer !== currentPlayer) {
        alert('Não é sua vez! Aguarde o outro jogador jogar.');
        return;
    }
    
    const stock = dominoGameState.stock || [];
    if (stock.length === 0) {
        alert('Não há mais peças no monte!');
        return;
    }
    
    // Comprar uma peça do monte
    const boughtPiece = stock.pop();
    const myHand = dominoGameState.hands[currentPlayer] || [];
    myHand.push(boughtPiece);
    
    // Animar a peça comprada
    animatePieceFromStock(boughtPiece);
    
    // Passar a vez
    dominoGameState.turn++;
    saveGameState();
    
    // Renderizar após animação
    setTimeout(() => {
        renderGame();
    }, 800);
}

function animatePieceFromStock(piece) {
    const stockElement = document.getElementById('dominoStock');
    const handElement = document.getElementById('dominoHandGame');
    
    if (!stockElement || !handElement) return;
    
    // Criar elemento animado
    const animatedPiece = document.createElement('div');
    animatedPiece.className = 'domino-piece-hand animated-piece';
    const [left, right] = piece;
    const dotsLeft = generateDotsGame(left);
    const dotsRight = generateDotsGame(right);
    animatedPiece.innerHTML = `
        <div class="domino-half">${dotsLeft}</div>
        <div class="domino-divider-game"></div>
        <div class="domino-half">${dotsRight}</div>
    `;
    
    // Posicionar no monte
    const stockRect = stockElement.getBoundingClientRect();
    const handRect = handElement.getBoundingClientRect();
    
    animatedPiece.style.position = 'fixed';
    animatedPiece.style.left = stockRect.left + stockRect.width / 2 - 40 + 'px';
    animatedPiece.style.top = stockRect.top + stockRect.height / 2 - 80 + 'px';
    animatedPiece.style.zIndex = '10000';
    animatedPiece.style.pointerEvents = 'none';
    
    document.body.appendChild(animatedPiece);
    
    // Animar até a mão
    setTimeout(() => {
        animatedPiece.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        animatedPiece.style.left = handRect.left + handRect.width / 2 - 40 + 'px';
        animatedPiece.style.top = handRect.top + handRect.height / 2 - 80 + 'px';
        animatedPiece.style.transform = 'scale(1.2) rotate(360deg)';
    }, 50);
    
    // Remover após animação
    setTimeout(() => {
        animatedPiece.remove();
    }, 900);
}

function playPiece(left, right) {
    if (!dominoGameState.gameStarted) {
        alert('O jogo ainda não começou! Aguarde ambos os jogadores entrarem.');
        return;
    }
    
    if (!dominoGameState.players || dominoGameState.players.length < 2) {
        alert('Aguardando outro jogador entrar na sala...');
        return;
    }
    
    const currentTurnPlayer = dominoGameState.players[dominoGameState.turn % 2];
    if (currentTurnPlayer !== currentPlayer) {
        alert('Não é sua vez! Aguarde o outro jogador jogar.');
        return;
    }
    
    const myHand = dominoGameState.hands[currentPlayer];
    if (!myHand || myHand.length === 0) {
        alert('Você não tem mais peças!');
        return;
    }
    
    // Find piece in hand (check both orientations)
    const pieceIndex = myHand.findIndex(p => 
        (p[0] === left && p[1] === right) || (p[0] === right && p[1] === left)
    );
    
    if (pieceIndex === -1) {
        alert('Peça não encontrada na sua mão!');
        return;
    }
    
    // Check if piece can be played
    if (dominoGameState.board.length === 0) {
        // First piece, can play anything
        dominoGameState.board.push([left, right]);
        myHand.splice(pieceIndex, 1);
        dominoGameState.turn++;
        saveGameState();
        renderGame();
        
        // Check win condition
        if (myHand.length === 0) {
            endGame(currentPlayer);
        }
    } else {
        // Get the exposed ends of the board
        const firstPiece = dominoGameState.board[0];
        const lastPiece = dominoGameState.board[dominoGameState.board.length - 1];
        
        // The exposed ends are:
        // - Left end: firstPiece[0] (the left side of the first piece)
        // - Right end: lastPiece[1] (the right side of the last piece)
        const leftEnd = firstPiece[0];
        const rightEnd = lastPiece[1];
        
        let canPlay = false;
        let playLeft = false;
        let pieceToPlay = [left, right];
        
        // Check if piece can connect to LEFT end
        // When adding to left, the RIGHT side of the new piece must match leftEnd
        if (right === leftEnd) {
            canPlay = true;
            playLeft = true;
            pieceToPlay = [left, right]; // Right side matches, orientation is correct
        } else if (left === leftEnd) {
            canPlay = true;
            playLeft = true;
            pieceToPlay = [right, left]; // Rotate: left side matches, so flip it
        }
        // Check if piece can connect to RIGHT end
        // When adding to right, the LEFT side of the new piece must match rightEnd
        else if (left === rightEnd) {
            canPlay = true;
            playLeft = false;
            pieceToPlay = [left, right]; // Left side matches, orientation is correct
        } else if (right === rightEnd) {
            canPlay = true;
            playLeft = false;
            pieceToPlay = [right, left]; // Rotate: right side matches, so flip it
        }
        
        if (canPlay) {
            if (playLeft) {
                // Add to beginning of board
                // The right side of pieceToPlay will connect to leftEnd
                dominoGameState.board.unshift(pieceToPlay);
            } else {
                // Add to end of board
                // The left side of pieceToPlay will connect to rightEnd
                dominoGameState.board.push(pieceToPlay);
            }
            myHand.splice(pieceIndex, 1);
            dominoGameState.turn++;
            saveGameState();
            renderGame();
            
            // Calcular pontuação da rodada
            const roundScore = calculateRoundScore(currentPlayer);
            if (roundScore > 0) {
                dominoGameState.currentScores[currentPlayer] += roundScore;
                
                // Verificar vitória por pontuação
                if (dominoGameState.currentScores[currentPlayer] >= dominoGameState.targetScore) {
                    endGame(currentPlayer);
                    return;
                }
            }
            
            // Check win condition (sem peças na mão)
            if (myHand.length === 0) {
                endGame(currentPlayer);
            }
        } else {
            alert(`Esta peça [${left}|${right}] não pode ser jogada!\n\nExtremidades disponíveis:\nEsquerda: ${leftEnd}\nDireita: ${rightEnd}\n\nA peça deve ter um lado igual a uma das extremidades.\n\n💡 Dica: Clique no monte de peças para comprar uma nova peça!`);
        }
    }
}

function calculateRoundScore(player) {
    // Calcular pontuação baseada nas peças jogadas na rodada
    // Por enquanto, retorna 0 (pode ser implementado depois)
    // A pontuação pode ser baseada em:
    // - Soma dos valores das peças jogadas
    // - Combinações especiais
    // - Peças do oponente restantes
    return 0;
}

function restartGame() {
    if (!confirm('Tem certeza que deseja começar uma nova partida? O jogo atual será reiniciado.')) {
        return;
    }
    
    // Reset game state but keep players, room, and scores
    const roomId = dominoGameState.roomId;
    const players = [...dominoGameState.players];
    const scores = dominoGameState.scores ? {...dominoGameState.scores} : { maria: 0, fernando: 0 };
    const keepChat = confirm('Deseja manter as mensagens do chat?');
    
    // Start new game
    startGame();
    
    // Restore room, players, and scores
    dominoGameState.roomId = roomId;
    dominoGameState.players = players;
    dominoGameState.scores = scores;
    
    // Clear chat if requested
    if (!keepChat) {
        dominoGameState.chat = [];
    }
    
    saveGameState();
    renderGame();
}

function refreshGame() {
    // Só atualizar se o modal do jogo estiver aberto
    const gameModal = document.getElementById('gameModal');
    if (!gameModal || !gameModal.classList.contains('active')) {
        return; // Não fazer nada se o modal não estiver aberto
    }
    
    const savedRoom = localStorage.getItem('dominoRoom');
    if (savedRoom) {
        const roomData = JSON.parse(savedRoom);
        dominoGameState = roomData;
        if (dominoGameState.gameStarted) {
            renderGame();
            // Reload chat messages
            loadChatMessages();
        } else {
            // Só carregar a sala se o modal estiver aberto
            if (gameModal.classList.contains('active')) {
                loadRoom();
            }
        }
    }
}

function saveGameState() {
    localStorage.setItem('dominoRoom', JSON.stringify(dominoGameState));
    // Salvar histórico separadamente
    const history = JSON.parse(localStorage.getItem('dominoHistory') || '[]');
    localStorage.setItem('dominoHistory', JSON.stringify(history));
}

// Sistema de Pontuação e Histórico
function endGame(winner) {
    const playerNames = {
        maria: 'Maria Eduarda',
        fernando: 'Fernando'
    };
    
    // Atualizar pontuação
    if (!dominoGameState.scores) {
        dominoGameState.scores = { maria: 0, fernando: 0 };
    }
    dominoGameState.scores[winner]++;
    
    // Criar registro da partida
    const gameRecord = {
        id: Date.now(),
        date: new Date().toISOString(),
        winner: winner,
        winnerName: playerNames[winner],
        scores: {
            maria: dominoGameState.scores.maria,
            fernando: dominoGameState.scores.fernando
        },
        players: [...dominoGameState.players]
    };
    
    // Adicionar ao histórico
    if (!dominoGameState.gameHistory) {
        dominoGameState.gameHistory = [];
    }
    dominoGameState.gameHistory.push(gameRecord);
    
    // Salvar histórico global
    const globalHistory = JSON.parse(localStorage.getItem('dominoHistory') || '[]');
    globalHistory.push(gameRecord);
    localStorage.setItem('dominoHistory', JSON.stringify(globalHistory));
    
    // Salvar estado atualizado
    saveGameState();
    
    // Mostrar modal de vitória
    showVictoryModal(winner, gameRecord);
}

function showVictoryModal(winner, gameRecord) {
    const playerNames = {
        maria: 'Maria Eduarda',
        fernando: 'Fernando'
    };
    
    const popVictoryQuotes = [
        // The Office
        "That's what she said! 🎉",
        "Bears. Beets. Battlestar Galactica. E você venceu! 🐻",
        "You're the Regional Manager of this game! 💼",
        "I'm not superstitious, but I am a little stitious... and you won! ✨",
        "Identity theft is not a joke! But you winning is! 🎉",
        // Crepúsculo
        "And so the lion fell in love with the lamb... e você venceu! 🌙",
        "You're my own personal brand of heroin... e você ganhou! 💕",
        "I'm only afraid of losing you... mas você venceu! 💕",
        // Britney Spears
        "Oops!... I Did It Again! E você venceu! 🎤",
        "Baby One More Time... e você ganhou! 💕",
        "Toxic... mas você venceu! 🎵",
        // Shrek
        "Ogres are like onions... e você venceu! 🦷",
        "Somebody once told me you'd win! 💚"
    ];
    const randomVictoryQuote = popVictoryQuotes[Math.floor(Math.random() * popVictoryQuotes.length)];
    
    const modal = document.createElement('div');
    modal.className = 'victory-modal';
    modal.innerHTML = `
        <div class="victory-content">
            <div class="victory-icon">🎉</div>
            <h2 class="victory-title">Parabéns ${playerNames[winner]}!</h2>
            <p class="victory-message">Você venceu esta partida!</p>
                    <p class="victory-quote" style="font-style: italic; color: var(--text-light); margin: 0.5rem 0; font-size: 0.9rem;">"${randomVictoryQuote}"</p>
            <div class="victory-scores">
                <div class="score-display">
                    <span class="score-label">${playerNames.maria}</span>
                    <span class="score-value">${gameRecord.scores.maria}</span>
                </div>
                <span class="score-vs">x</span>
                <div class="score-display">
                    <span class="score-label">${playerNames.fernando}</span>
                    <span class="score-value">${gameRecord.scores.fernando}</span>
                </div>
            </div>
            <div class="victory-buttons">
                <button onclick="closeVictoryModal(); restartGame();" class="victory-btn">🔄 Nova Partida</button>
                <button onclick="closeVictoryModal(); showDominoHistory();" class="victory-btn">📊 Ver Histórico</button>
                <button onclick="closeVictoryModal()" class="victory-btn secondary">Fechar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 100);
}

function closeVictoryModal() {
    const modal = document.querySelector('.victory-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }
}

function showDominoHistory() {
    const history = JSON.parse(localStorage.getItem('dominoHistory') || '[]');
    const playerNames = {
        maria: 'Maria Eduarda',
        fernando: 'Fernando'
    };
    
    // Calcular totais
    const totals = { maria: 0, fernando: 0 };
    history.forEach(game => {
        totals[game.winner]++;
    });
    
    const modal = document.createElement('div');
    modal.className = 'history-modal';
    modal.innerHTML = `
        <div class="history-content">
            <div class="history-header">
                <h2>📊 Histórico de Partidas</h2>
                <button onclick="closeHistoryModal()" class="close-history">×</button>
            </div>
            <div class="history-totals">
                <div class="total-score">
                    <span class="total-label">${playerNames.maria}</span>
                    <span class="total-value">${totals.maria}</span>
                </div>
                <span class="total-vs">x</span>
                <div class="total-score">
                    <span class="total-label">${playerNames.fernando}</span>
                    <span class="total-value">${totals.fernando}</span>
                </div>
            </div>
            <div class="history-list">
                ${history.length === 0 ? 
                    '<p class="no-history">Nenhuma partida registrada ainda.</p>' :
                    history.slice().reverse().map(game => {
                        const isWinner = game.winner === currentPlayer;
                        return `
                        <div class="history-item ${isWinner ? 'won' : 'lost'}">
                            <div class="history-date">${formatDate(game.date)}</div>
                            <div class="history-result">
                                <span class="history-winner">${game.winnerName}</span> venceu!
                            </div>
                            <div class="history-scores">
                                ${playerNames.maria}: ${game.scores.maria} x ${game.scores.fernando} :${playerNames.fernando}
                            </div>
                        </div>
                    `;
                    }).join('')
                }
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 100);
}

function closeHistoryModal() {
    const modal = document.querySelector('.history-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }
}

// Chat Functions
function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    if (!dominoGameState.chat) {
        dominoGameState.chat = [];
    }
    
    const playerNames = {
        maria: 'Maria Eduarda',
        fernando: 'Fernando'
    };
    
    const chatMessage = {
        player: currentPlayer,
        playerName: playerNames[currentPlayer],
        message: message,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
    
    dominoGameState.chat.push(chatMessage);
    saveGameState();
    
    chatInput.value = '';
    renderChatMessages();
    
    // Auto-scroll to bottom
    setTimeout(() => {
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }, 100);
}

function loadChatMessages() {
    if (dominoGameState.chat && dominoGameState.chat.length > 0) {
        renderChatMessages();
    }
}

function renderChatMessages() {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    if (!dominoGameState.chat || dominoGameState.chat.length === 0) {
        chatMessages.innerHTML = '<div class="chat-empty">Nenhuma mensagem ainda. Comece a conversar! 💬</div>';
        return;
    }
    
    chatMessages.innerHTML = dominoGameState.chat.map(msg => {
        const isMyMessage = msg.player === currentPlayer;
        return `
            <div class="chat-message ${isMyMessage ? 'my-message' : 'other-message'}">
                <div class="message-header">
                    <span class="message-sender">${msg.playerName}</span>
                    <span class="message-time">${msg.timestamp}</span>
                </div>
                <div class="message-content">${msg.message}</div>
            </div>
        `;
    }).join('');
    
    // Auto-scroll to bottom
    setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
}

function toggleChat() {
    const chatContainer = document.querySelector('.domino-chat-container');
    if (chatContainer) {
        chatContainer.classList.toggle('collapsed');
        const toggleBtn = document.querySelector('.chat-toggle-btn');
        if (toggleBtn) {
            toggleBtn.textContent = chatContainer.classList.contains('collapsed') ? '+' : '−';
        }
    }
}

// Upload Foto do Fondue
function uploadFotoFondue() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const fotoFondue = document.getElementById('fotoFondue');
                const placeholderFondue = document.getElementById('placeholderFondue');
                
                if (fotoFondue && placeholderFondue) {
                    fotoFondue.src = event.target.result;
                    fotoFondue.style.display = 'block';
                    placeholderFondue.style.display = 'none';
                    
                    // Salvar no localStorage
                    localStorage.setItem('mariaeduarda_foto_fondue', event.target.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

// Upload Foto do Brinco
function uploadFotoBrinco() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const fotoBrinco = document.getElementById('fotoBrinco');
                const placeholderBrinco = document.getElementById('placeholderBrinco');
                
                if (fotoBrinco && placeholderBrinco) {
                    fotoBrinco.src = event.target.result;
                    fotoBrinco.style.display = 'block';
                    placeholderBrinco.style.display = 'none';
                    
                    // Salvar no localStorage
                    localStorage.setItem('mariaeduarda_foto_brinco', event.target.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

// Upload Vídeo do Pedido de Namoro
function uploadVideoPedido() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Para vídeos, criar blob URL
            const videoUrl = URL.createObjectURL(file);
            const videoPedido = document.getElementById('videoPedido');
            const placeholderVideoPedido = document.getElementById('placeholderVideoPedido');
            
            if (videoPedido && placeholderVideoPedido) {
                videoPedido.src = videoUrl;
                videoPedido.style.display = 'block';
                placeholderVideoPedido.style.display = 'none';
                
                // Salvar referência no localStorage (não podemos salvar o vídeo completo, mas podemos salvar a referência)
                // Nota: Para persistência real, seria necessário um backend, mas vamos salvar uma flag
                localStorage.setItem('mariaeduarda_video_pedido_uploaded', 'true');
                localStorage.setItem('mariaeduarda_video_pedido_file', file.name);
                
                // Tentar salvar como base64 (pode ser grande, mas funciona para vídeos pequenos)
                const reader = new FileReader();
                reader.onload = (event) => {
                    // Só salvar se o vídeo for menor que 10MB (limite aproximado do localStorage)
                    if (file.size < 10 * 1024 * 1024) {
                        localStorage.setItem('mariaeduarda_video_pedido', event.target.result);
                    } else {
                        // Para vídeos grandes, manter apenas a referência
                        console.log('Vídeo muito grande para salvar no localStorage. Será necessário fazer upload novamente ao recarregar a página.');
                    }
                };
                reader.readAsDataURL(file);
            }
        }
    };
    input.click();
}

// Carregar foto do fondue ao iniciar
function loadFotoFondue() {
    const fotoFondue = document.getElementById('fotoFondue');
    const placeholderFondue = document.getElementById('placeholderFondue');
    const savedFoto = localStorage.getItem('mariaeduarda_foto_fondue');
    
    if (savedFoto && fotoFondue && placeholderFondue) {
        fotoFondue.src = savedFoto;
        fotoFondue.style.display = 'block';
        placeholderFondue.style.display = 'none';
    }
    
    // Carregar foto do brinco também
    const fotoBrinco = document.getElementById('fotoBrinco');
    const placeholderBrinco = document.getElementById('placeholderBrinco');
    const savedFotoBrinco = localStorage.getItem('mariaeduarda_foto_brinco');
    
    if (savedFotoBrinco && fotoBrinco && placeholderBrinco) {
        fotoBrinco.src = savedFotoBrinco;
        fotoBrinco.style.display = 'block';
        placeholderBrinco.style.display = 'none';
    }
    
    // Carregar vídeo do pedido
    const videoPedido = document.getElementById('videoPedido');
    const placeholderVideoPedido = document.getElementById('placeholderVideoPedido');
    const savedVideoPedido = localStorage.getItem('mariaeduarda_video_pedido');
    
    if (savedVideoPedido && videoPedido && placeholderVideoPedido) {
        videoPedido.src = savedVideoPedido;
        videoPedido.style.display = 'block';
        placeholderVideoPedido.style.display = 'none';
    }
}

// Make functions available globally
window.playPiece = playPiece;
window.refreshGame = refreshGame;
window.restartGame = restartGame;
window.sendMessage = sendMessage;
window.toggleChat = toggleChat;
window.checkWord = checkWord;
window.checkCrossword = checkCrossword;
window.checkCombinado = checkCombinado;
window.submitDito = submitDito;
window.uploadFotoFondue = uploadFotoFondue;
window.uploadFotoBrinco = uploadFotoBrinco;
window.uploadVideoPedido = uploadVideoPedido;
window.showDominoHistory = showDominoHistory;
window.closeHistoryModal = closeHistoryModal;
window.closeVictoryModal = closeVictoryModal;
window.selectScoreMode = selectScoreMode;
window.buyPiece = buyPiece;
window.togglePlayer = togglePlayer;
window.startDominoGame = startDominoGame;

// Fullscreen functionality
let isFullscreen = false;

function toggleFullscreen() {
    const gameContainer = document.querySelector('.game-container');
    if (!gameContainer) return;
    
    if (!isFullscreen) {
        // Entrar em fullscreen
        if (gameContainer.requestFullscreen) {
            gameContainer.requestFullscreen().catch(err => {
                console.log('Erro ao entrar em fullscreen:', err);
                // Fallback: usar classe CSS para simular fullscreen
                gameContainer.classList.add('fullscreen-mode');
                isFullscreen = true;
            });
        } else if (gameContainer.webkitRequestFullscreen) {
            gameContainer.webkitRequestFullscreen();
        } else if (gameContainer.mozRequestFullScreen) {
            gameContainer.mozRequestFullScreen();
        } else if (gameContainer.msRequestFullscreen) {
            gameContainer.msRequestFullscreen();
        } else {
            // Fallback: usar classe CSS para simular fullscreen
            gameContainer.classList.add('fullscreen-mode');
        }
        isFullscreen = true;
    } else {
        // Sair do fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        isFullscreen = false;
        gameContainer.classList.remove('fullscreen-mode');
    }
}

// Detectar mudanças no fullscreen
document.addEventListener('fullscreenchange', () => {
    isFullscreen = !!document.fullscreenElement;
    const gameContainer = document.querySelector('.game-container');
    if (gameContainer) {
        if (isFullscreen) {
            gameContainer.classList.add('fullscreen-mode');
        } else {
            gameContainer.classList.remove('fullscreen-mode');
        }
    }
});

document.addEventListener('webkitfullscreenchange', () => {
    isFullscreen = !!document.webkitFullscreenElement;
    const gameContainer = document.querySelector('.game-container');
    if (gameContainer) {
        gameContainer.classList.toggle('fullscreen-mode', isFullscreen);
    }
});

document.addEventListener('mozfullscreenchange', () => {
    isFullscreen = !!document.mozFullScreenElement;
    const gameContainer = document.querySelector('.game-container');
    if (gameContainer) {
        gameContainer.classList.toggle('fullscreen-mode', isFullscreen);
    }
});

document.addEventListener('MSFullscreenChange', () => {
    isFullscreen = !!document.msFullscreenElement;
    const gameContainer = document.querySelector('.game-container');
    if (gameContainer) {
        gameContainer.classList.toggle('fullscreen-mode', isFullscreen);
    }
});

window.toggleFullscreen = toggleFullscreen;
window.selectQuizAnswer = selectQuizAnswer;
window.initQuiz = initQuiz;
