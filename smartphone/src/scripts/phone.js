let unlocked = false; // Stato di sblocco globale

document.addEventListener('DOMContentLoaded', () => {
    // --- LOCKSCREEN LOGIC ---
    const lockscreen = document.getElementById('lockscreen');
    const lockscreenMain = document.getElementById('lockscreen-main');
    const lockscreenPasscode = document.getElementById('lockscreen-passcode');
    const homebar = document.getElementById('lockscreen-homebar');
    const keypad = document.getElementById('lockscreen-keypad');
    const dots = document.getElementById('keypad-dots')?.children || [];
    let input = "";

    function updateLockscreenTime() {
        const time = document.getElementById('lockscreen-time');
        const date = document.getElementById('lockscreen-date');
        if (!time || !date) return;
        const now = new Date();
        time.textContent = now.toLocaleTimeString('it-IT', {hour: '2-digit', minute:'2-digit', hour12: false});
        let dateStr = now.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' });
        date.textContent = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
    }

    function showPasscode() {
        // Mostra la schermata di inserimento codice solo se il telefono non è sbloccato
        if (unlocked) return;
        lockscreenMain.classList.remove('active');
        lockscreenPasscode.classList.add('active');
        keypad.style.display = 'flex';
        input = "";
        updateDots();
    }

    function hidePasscode() {
        lockscreenMain.classList.add('active');
        lockscreenPasscode.classList.remove('active');
        keypad.style.display = 'none';
        input = "";
        updateDots();
    }

    function updateDots() {
        for(let i=0; i<4; i++) {
            if (dots[i]) dots[i].className = input.length > i ? 'filled' : '';
        }
    }

    function unlockIfCorrect() {
        if(input === "1111") {
            lockscreen.classList.remove('active');
            document.body.classList.remove('locked');
            unlocked = true;
            hidePasscode();
        } else if (input.length === 4) {
            lockscreenPasscode.classList.add('shake');
            setTimeout(() => {
                lockscreenPasscode.classList.remove('shake');
                input = "";
                updateDots();
            }, 500);
        }
    }

    // Inizializza lockscreen SOLO all'avvio
    if (!unlocked) {
        lockscreen.classList.add('active');
        document.body.classList.add('locked');
        hidePasscode(); // Mostra solo lockscreen con notifiche, NON la schermata codice
    }
    updateLockscreenTime();
    setInterval(updateLockscreenTime, 1000);

    // Eventi lockscreen
    if(homebar) {
        homebar.addEventListener('click', showPasscode);
        homebar.addEventListener('touchstart', showPasscode);
    }
    if (keypad) {
        Array.from(keypad.querySelectorAll('button')).forEach(btn => {
            btn.addEventListener('click', e => {
                const val = btn.textContent;
                if(val === "⌫") {
                    input = input.slice(0, -1);
                    updateDots();
                } else if(val === "OK") {
                    unlockIfCorrect();
                } else if(/[0-9]/.test(val) && input.length < 4) {
                    input += val;
                    updateDots();
                    if(input.length === 4) unlockIfCorrect();
                }
            });
        });
    }

    // --- RESTO DELLA LOGICA (homepage, apps, ecc) ---

    // --- Fix: chiusura app a schermo intero (Maps, Integrali, Settings) ---
    // Maps
    const mapsScreen = document.getElementById('maps-screen');
    const mapsCloseBtn = document.getElementById('maps-close-btn');
    const mapsHomebar = document.querySelector('.maps-homebar');
    let leafletMapInstance = null;
    let markerLayer = null;

    function destroyMapInstance() {
      if (leafletMapInstance) {
        leafletMapInstance.remove();
        leafletMapInstance = null;
        markerLayer = null;
      }
    }

    if (mapsHomebar) {
      mapsHomebar.addEventListener('click', function(e) {
        e.stopPropagation();
        mapsScreen.classList.remove('active');
        destroyMapInstance();
      });
    }
    if (mapsCloseBtn) {
      mapsCloseBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        mapsScreen.classList.remove('active');
        destroyMapInstance();
      });
    }
    if (mapsScreen) {
      mapsScreen.addEventListener('mousedown', function(e) {
        if (e.target === mapsScreen) {
          mapsScreen.classList.remove('active');
          destroyMapInstance();
        }
      });
    }

    document.querySelectorAll('.app-icon').forEach(icon => {
      if (icon.querySelector('span')?.textContent.trim().toLowerCase() === 'maps') {
        icon.addEventListener('click', function(e) {
          e.stopPropagation();
          mapsScreen.classList.add('active');
          setTimeout(() => {
            destroyMapInstance();
            leafletMapInstance = L.map('map', {
              zoomControl: false,
              attributionControl: false,
              minZoom: 2,
              maxZoom: 6,
              center: [20, 0],
              zoom: 2,
              dragging: true,
              scrollWheelZoom: true,
              doubleClickZoom: true,
              boxZoom: false,
              keyboard: false,
            });
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              minZoom: 2,
              maxZoom: 6,
              noWrap: true
            }).addTo(leafletMapInstance);
            // Optional: Overlay GTA-style map if you have the image
            // L.imageOverlay('assets/gta6_map.png', [[-60,-180],[85,180]]).addTo(leafletMapInstance);
            markerLayer = L.layerGroup().addTo(leafletMapInstance);
            leafletMapInstance.invalidateSize();
            document.getElementById('map').style.pointerEvents = 'auto';
          }, 100);
        });
      }
    });

    // Integrali
    const integraliModal = document.getElementById('integrali-modal');
    const integraliClose = document.getElementById('integrali_close');
    if (integraliModal && integraliClose) {
      integraliClose.addEventListener('click', function(e) {
        e.stopPropagation();
        integraliModal.style.display = 'none';
      });
      integraliModal.addEventListener('mousedown', function(e) {
        if (e.target === integraliModal) integraliModal.style.display = 'none';
      });
    }

    // Settings
    const settingsApp = document.getElementById('settings-app');
    const settingsScreen = document.getElementById('settings-screen');
    const settingsClose = document.getElementById('settings-close');

    function closeSettingsApp() {
        if (!settingsScreen) return;
        settingsScreen.classList.remove('active');
    }

    if (settingsApp) {
        settingsApp.addEventListener('click', () => {
            if (settingsScreen) settingsScreen.classList.add('active');
        });
    }

    if (settingsClose) {
        settingsClose.addEventListener('click', (e) => {
            e.stopPropagation();
            closeSettingsApp();
        });
    }

    if (settingsScreen) {
        settingsScreen.addEventListener('mousedown', (e) => {
            if (e.target === settingsScreen) {
                closeSettingsApp();
            }
        });
    }

    // App Management System (solo UNA volta!)
    const apps = {
        settings: {
            id: 'settings-app',
            screen: 'settings-screen',
            close: 'settings-close',
            homebar: '.app-homebar'
        },
        maps: {
            id: 'maps-app',
            screen: 'maps-screen',
            close: 'maps-close-btn',
            homebar: '.maps-homebar'
        },
        integrali: {
            id: 'integrali-app',
            screen: 'integrali-app-screen',
            close: 'integrali-close-btn',
            homebar: '.app-homebar'
        }
    };

    function closeApp(appScreen) {
        if (!appScreen) return;
        appScreen.classList.add('closing');
        setTimeout(() => {
            appScreen.classList.remove('active', 'closing');
        }, 350);
    }

    function setupApp(appName, config) {
        const appScreen = document.getElementById(config.screen || config.id);
        const closeBtn = document.getElementById(config.close);
        const homebar = config.homebar ? document.querySelector(config.homebar) : null;
        const appIcon = document.getElementById(config.id);

        if (!appIcon || !appScreen) return;

        // Open
        appIcon.addEventListener('click', () => {
            appScreen.classList.add('active');
        });

        // Close con X
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                closeApp(appScreen);
            });
        }

        // Close con homebar
        if (homebar) {
            homebar.addEventListener('click', (e) => {
                e.stopPropagation();
                closeApp(appScreen);
            });
        }

        // Click fuori per chiudere
        appScreen.addEventListener('mousedown', (e) => {
            if (e.target === appScreen) {
                closeApp(appScreen);
            }
        });
    }

    Object.entries(apps).forEach(([appName, config]) => {
        setupApp(appName, config);
    });

    // --- Integrali App stile iOS ---
    function numericIntegrate(f, a, b, steps = 2000) {
        const dx = (b - a) / steps;
        let sum = 0.5 * (f(a) + f(b));
        for (let i = 1; i < steps; i++) {
            sum += f(a + i * dx);
        }
        return sum * dx;
    }

    // Setup calcolatore integrali
    const integraliForm = document.getElementById('integrali-form');
    const integraliFx = document.getElementById('integrali-fx');
    const integraliVar = document.getElementById('integrali-var');
    const integraliA = document.getElementById('integrali-a');
    const integraliB = document.getElementById('integrali-b');
    const integraliResult = document.getElementById('integrali-result-math');

    function calcolaIntegrale(e) {
        if (e) e.preventDefault();

        const fx = integraliFx.value.trim();
        const variable = integraliVar.value.trim() || 'x';
        const a = integraliA.value.trim();
        const b = integraliB.value.trim();

        if (!fx) {
            integraliResult.textContent = 'Inserisci una funzione';
            return;
        }

        if (a && b) {
            let f;
            try {
                f = (x) => math.evaluate(fx, { [variable]: x });
            } catch (err) {
                integraliResult.textContent = 'Errore: funzione non valida';
                return;
            }
            const aNum = Number(a);
            const bNum = Number(b);
            if (isNaN(aNum) || isNaN(bNum)) {
                integraliResult.textContent = 'Limiti non validi';
                return;
            }
            try {
                const result = numericIntegrate(f, aNum, bNum, 2000);
                integraliResult.textContent = `∫[${a},${b}] ${fx} d${variable} ≈ ${result.toPrecision(8)}`;
            } catch (err) {
                integraliResult.textContent = 'Errore nel calcolo numerico';
            }
        } else {
            integraliResult.textContent = 'Calcolo simbolico non disponibile. Inserisci anche i limiti per il calcolo numerico.';
        }
    }

    if (integraliForm) {
        integraliForm.addEventListener('submit', calcolaIntegrale);
    }

    [integraliFx, integraliVar, integraliA, integraliB].forEach(input => {
        if (input) {
            let typingTimer;
            input.addEventListener('input', () => {
                clearTimeout(typingTimer);
                typingTimer = setTimeout(() => {
                    if (integraliFx.value.trim()) {
                        calcolaIntegrale();
                    }
                }, 600);
            });
        }
    });

    // --- Animazione chiusura per tutte le app con homebar ---
    document.querySelectorAll('.maps-homebar, .app-homebar').forEach(homebar => {
        homebar.addEventListener('click', function(e) {
            const parent = homebar.closest('.maps-screen, .settings-screen, .integrali-app-screen');
            if (parent) {
                closeApp(parent);
            }
        });
    });

    // MDT APP LOGIC
    const mdtAppIcon = document.getElementById('mdt-app');
    const mdtScreen = document.querySelector('.background');
    const mdtCloseBtn = document.getElementById('mdt-close');
    if (mdtAppIcon && mdtScreen) {
        mdtAppIcon.addEventListener('click', () => {
            mdtScreen.style.display = 'block';
        });
    }
    if (mdtCloseBtn && mdtScreen) {
        mdtCloseBtn.addEventListener('click', () => {
            mdtScreen.style.display = 'none';
        });
    }

    // --- HOME PAGE PAGINATION (dots) ---
    const pages = document.querySelectorAll('.apps-grid.page');
    const pageDots = document.querySelectorAll('.dots .dot');
    let currentPage = 0;
    let isSliding = false;

    function showPage(idx) {
        if (!pages.length || idx === currentPage || isSliding) return;
        isSliding = true;
        const direction = idx > currentPage ? 'left' : 'right';
        const prevPage = pages[currentPage];
        const nextPage = pages[idx];

        // Rimuovi classi di animazione precedenti
        pages.forEach(page => {
            page.classList.remove('active', 'slide-left', 'slide-right');
        });

        // Imposta la pagina in uscita
        prevPage.classList.add(direction === 'left' ? 'slide-left' : 'slide-right');

        // Mostra la nuova pagina con animazione
        nextPage.classList.add('active');
        nextPage.style.opacity = 0;
        nextPage.style.transform = `translateX(${direction === 'left' ? '60px' : '-60px'})`;

        setTimeout(() => {
            nextPage.style.transition = 'opacity 0.35s cubic-bezier(.4,1.2,.4,1), transform 0.35s cubic-bezier(.4,1.2,.4,1)';
            nextPage.style.opacity = 1;
            nextPage.style.transform = 'translateX(0)';
            pageDots.forEach((dot, i) => {
                dot.classList.toggle('active', i === idx);
            });
            setTimeout(() => {
                // Reset styles
                pages.forEach(page => {
                    page.style.transition = '';
                    page.style.opacity = '';
                    page.style.transform = '';
                    page.classList.remove('slide-left', 'slide-right');
                });
                pages.forEach((page, i) => {
                    page.classList.toggle('active', i === idx);
                });
                currentPage = idx;
                isSliding = false;
            }, 350);
        }, 10);
    }

    // Inizializza pagine e dots
    if (pages.length && pageDots.length) {
        showPage(0);
        pageDots.forEach((dot, idx) => {
            dot.addEventListener('click', () => showPage(idx));
        });
    }

    // --- SWIPE TRA PAGINE HOME (opzionale, solo se vuoi swipe touch) ---
    let startX = null;
    const pagesContainer = document.getElementById('pages-container');
    if (pagesContainer && pages.length > 1) {
        pagesContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        pagesContainer.addEventListener('touchend', (e) => {
            if (startX === null) return;
            const endX = e.changedTouches[0].clientX;
            if (endX - startX > 50 && currentPage > 0) {
                showPage(currentPage - 1);
            } else if (startX - endX > 50 && currentPage < pages.length - 1) {
                showPage(currentPage + 1);
            }
            startX = null;
        });
    }

    // --- APERTURA APP MESSAGGI, TELEFONO, PCTO ---
    function openAppScreen(appId, screenId) {
        const appIcon = document.getElementById(appId);
        const appScreen = document.getElementById(screenId);
        if (appIcon && appScreen) {
            appIcon.addEventListener('click', () => {
                appScreen.classList.add('active');
                // Scroll to top when opening
                appScreen.scrollTop = 0;
            });
            // Chiudi cliccando fuori o su homebar (se presente)
            appScreen.addEventListener('mousedown', (e) => {
                if (e.target === appScreen) appScreen.classList.remove('active');
            });
            const homebar = appScreen.querySelector('.app-homebar');
            if (homebar) {
                homebar.addEventListener('click', (e) => {
                    e.stopPropagation();
                    appScreen.classList.remove('active');
                });
            }
        }
    }

    // Messaggi
    openAppScreen('messages-app', 'messages-screen');
    // Telefono
    openAppScreen('phone-app', 'phone-screen');
    // PCTO
    openAppScreen('pcto-app', 'pcto-app-screen');
});