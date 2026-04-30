document.addEventListener('DOMContentLoaded', () => {
    // Global Alert Collapse Toggle (Top Banner)
    const marginAlertHeader = document.getElementById('marginAlertHeader');
    if (marginAlertHeader) {
        marginAlertHeader.addEventListener('click', () => {
            const body = document.getElementById('marginAlertBody');
            const icon = marginAlertHeader.querySelector('.toggle-alert-icon');
            if (body.style.display === 'none') {
                body.style.display = 'block';
                icon.style.transform = 'rotate(180deg)';
                marginAlertHeader.style.paddingBottom = '15px';
            } else {
                body.style.display = 'none';
                icon.style.transform = 'rotate(0deg)';
                marginAlertHeader.style.paddingBottom = '20px';
            }
        });
    }

    // Chart 1: Donut Chart for Capacity
    const capacityCanvas = document.getElementById('capacityChart');
    if (capacityCanvas) {
        const capacityCtx = capacityCanvas.getContext('2d');
    
    // Gradient for Donut Chart
    const gradientSaturado = capacityCtx.createLinearGradient(0, 0, 0, 400);
    gradientSaturado.addColorStop(0, '#FFB042');
    gradientSaturado.addColorStop(1, '#FFD18C');

    const gradientLibre = capacityCtx.createLinearGradient(0, 0, 0, 400);
    gradientLibre.addColorStop(0, '#4361EE');
    gradientLibre.addColorStop(1, '#7A8CFF');

    new Chart(capacityCtx, {
        type: 'doughnut',
        data: {
            labels: ['Saturado', 'Subutilizado'],
            datasets: [{
                data: [30, 70],
                backgroundColor: [
                    gradientSaturado,
                    gradientLibre
                ],
                borderWidth: 0,
                hoverOffset: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: {
                legend: {
                    display: false // Using custom HTML legend
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return ` ${context.label}: ${context.raw}%`;
                        }
                    }
                }
            }
        }
    });
    }

    // Configuración del Gráfico de Facturación vs Margen (Sentinel-1)
    const financeCanvas = document.getElementById('financeChart');
    if (financeCanvas) {
    const ctxFinance = financeCanvas.getContext('2d');

    var financeChart = new Chart(ctxFinance, {
        type: 'bar', // Base de barras para facturación
        data: {
            labels: ['Radiología', 'Ginecología', 'Cardiología', 'Ortopedia', 'Laboratorio'],
            datasets: [
                {
                    label: 'Facturación ($)',
                    data: [2035000, 1450000, 1850000, 1100000, 2215000],
                    backgroundColor: 'rgba(138, 100, 214, 0.7)', // Púrpura Sentinel
                    borderColor: '#8A64D6',
                    borderWidth: 1,
                    borderRadius: 5,
                    order: 2 // Se dibuja detrás
                },
                {
                    label: 'Margen Real (%)',
                    data: [38, 25, 31, 28, 18], // Datos de eficiencia
                    type: 'line', // Convertimos este dataset en línea
                    borderColor: '#00ff9d', // Verde Neón (Cian de éxito)
                    backgroundColor: '#00ff9d',
                    borderWidth: 3,
                    pointBackgroundColor: '#00ff9d',
                    tension: 0.4,
                    yAxisID: 'y1', // Eje derecho para porcentajes
                    order: 1 // Se dibuja al frente
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: { color: '#8b8b8b', font: { family: 'Inter' } }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#8b8b8b' },
                    title: { display: true, text: 'Facturación (COP)', color: '#8b8b8b' }
                },
                y1: {
                    beginAtZero: true,
                    position: 'right', // Eje para el Margen %
                    grid: { drawOnChartArea: false }, // No ensucia la gráfica principal
                    ticks: { 
                        color: '#00ff9d',
                        callback: function(value) { return value + '%'; }
                    },
                    title: { display: true, text: 'Margen de Utilidad', color: '#00ff9d' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#8b8b8b' }
                }
            }
        }
    });
    }

    // Chat Widget Logic
    const chatToggle = document.getElementById('chatToggle');
    const chatWidget = document.getElementById('chatWidget');
    const chatClose = document.getElementById('chatClose');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatBody = document.getElementById('chatBody');

    // Toggle Chat
    chatToggle.addEventListener('click', () => {
        chatWidget.classList.add('active');
        const badge = chatToggle.querySelector('.chat-badge');
        if (badge) badge.style.display = 'none';
    });

    chatClose.addEventListener('click', () => {
        chatWidget.classList.remove('active');
    });

    // Send Message
    const sendMessage = () => {
        const text = chatInput.value.trim();
        if (!text) return;

        // User message
        const userMsg = document.createElement('div');
        userMsg.className = 'chat-message user';
        userMsg.innerHTML = `<p>${text}</p><span class="chat-time">Now</span>`;
        chatBody.appendChild(userMsg);
        chatInput.value = '';
        
        chatBody.scrollTop = chatBody.scrollHeight;

        // Bot simulation
        setTimeout(() => {
            const botMsg = document.createElement('div');
            botMsg.className = 'chat-message bot';
            botMsg.innerHTML = `<p>He registrado el comando. Monitoreando cambios en Google Drive bajo directiva Live Stream...</p><span class="chat-time">Now</span>`;
            chatBody.appendChild(botMsg);
            chatBody.scrollTop = chatBody.scrollHeight;
        }, 1000);
    };

    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Sentinel-1 Live Mapping Logic (Regla de Oro de Rentabilidad)
    let liveDataStore = {
        especialidades: {
            'Radiología': { ingresos: 2035000, historico_ingresos: 2035000, costo_insumos: 1261700, historico_costo: 1261700, uso_insumos: 100, historico_uso: 100 }, // 38%
            'Ginecología': { ingresos: 1450000, historico_ingresos: 1450000, costo_insumos: 1087500, historico_costo: 1087500, uso_insumos: 50, historico_uso: 50 }, // 25%
            'Cardiología': { ingresos: 1850000, historico_ingresos: 1850000, costo_insumos: 1276500, historico_costo: 1276500, uso_insumos: 80, historico_uso: 80 }, // 31%
            'Ortopedia': { ingresos: 1100000, historico_ingresos: 1100000, costo_insumos: 792000, historico_costo: 792000, uso_insumos: 40, historico_uso: 40 },    // 28%
            'Laboratorio': { ingresos: 2215000, historico_ingresos: 2215000, costo_insumos: 1816300, historico_costo: 1550500, uso_insumos: 300, historico_uso: 150 }  // 18% (Mismos ingresos, pero uso de insumos disparado)
        }
    };

    window.SentinelSyncDrive = function(updatedCosts) {
        // Expose a global function to simulate a Google Drive file update
        // Eg: window.SentinelSyncDrive({ 'Laboratorio': 2000000 })
        if (updatedCosts) {
            Object.keys(updatedCosts).forEach(esp => {
                if (liveDataStore.especialidades[esp]) {
                    liveDataStore.especialidades[esp].costo_insumos = updatedCosts[esp];
                }
            });
        }
        mapClinicalMargins();
    };

    function mapClinicalMargins() {
        let alertsGenerated = 0;
        let totalIngresos = 0;
        let totalCostos = 0;

        const listItems = document.querySelectorAll('.list-item');
        
        const currentLabels = financeChart.data.labels;
        const marginDataset = financeChart.data.datasets[1];
        let chartUpdated = false;

        Object.keys(liveDataStore.especialidades).forEach(esp => {
            const data = liveDataStore.especialidades[esp];
            const margin = ((data.ingresos - data.costo_insumos) / data.ingresos) * 100;
            
            totalIngresos += data.ingresos;
            totalCostos += data.costo_insumos;

            // Update Chart.js specific data point
            const index = currentLabels.indexOf(esp);
            if (index !== -1 && marginDataset.data[index] !== parseFloat(margin.toFixed(0))) {
                marginDataset.data[index] = parseFloat(margin.toFixed(0));
                chartUpdated = true;
            }

            // Update DOM List Items if they exist
            listItems.forEach(item => {
                const nameEl = item.querySelector('.list-name');
                if (nameEl && nameEl.innerText === esp) {
                    const badge = item.querySelector('.badge-margin');
                    const dot = item.querySelector('.status-dot');
                    
                    if (badge) badge.innerText = `${margin.toFixed(0)}% Margen`;

                    if (margin < 22) { // UMBRAL DE REGLA DE ORO DE RENTABILIDAD: 22%
                        
                        // Diagnóstico de Causa Raíz
                        let causas = [];
                        let costoUnitario = data.costo_insumos / data.uso_insumos;
                        let costoUnitarioHist = data.historico_costo / data.historico_uso;
                        
                        if (costoUnitario > costoUnitarioHist) causas.push('Aumento de costo de proveedor');
                        if (data.uso_insumos > data.historico_uso) causas.push('Uso excesivo de insumos por parte del especialista');
                        if (data.ingresos < data.historico_ingresos) causas.push('Disminución del valor pagado por la aseguradora');
                        
                        let diagnosticoTexto = causas.length > 0 ? causas.join(' / ') : 'Variación anómala desconocida';

                        if (badge) badge.className = 'badge-margin negative';
                        if (badge) badge.innerText = `CRÍTICO (${margin.toFixed(0)}%)`; // Visual target required by User
                        if (dot) dot.className = 'status-dot red';
                        item.classList.add('critical-row');
                        
                        if (!badge.hasAttribute('data-alert-triggered')) {
                            alertsGenerated++;
                            badge.setAttribute('data-alert-triggered', 'true');
                            
                            // Notificar en el Chat de Sentinel
                            const chatBody = document.getElementById('chatBody');
                            if (chatBody) {
                                const alertMsg = document.createElement('div');
                                alertMsg.className = 'chat-message bot warning';
                                alertMsg.innerHTML = `<p>🚨 <b>REGLA DE ORO QUEBRANTADA:</b> El margen de <i>${esp}</i> ha caído por debajo del umbral mínimo del 22% (Actual: ${margin.toFixed(1)}%).<br><br><b>DIAGNÓSTICO:</b> Se detecta <b>${diagnosticoTexto}</b> en los registros maestros.</p><span class="chat-time">Sentinel-1 Core</span>`;
                                chatBody.appendChild(alertMsg);
                                chatBody.scrollTop = chatBody.scrollHeight;
                            }
                        }
                    } else {
                        if (badge) badge.className = 'badge-margin positive';
                        if (dot) dot.className = 'status-dot green';
                        item.classList.remove('critical-row');
                        if (badge) badge.removeAttribute('data-alert-triggered');
                    }
                }
            });
        });

        if (chartUpdated) {
            financeChart.update();
        }

        // 1. Actualizar KPI Global ("Margen Clínico")
        const globalMargin = ((totalIngresos - totalCostos) / totalIngresos) * 100;
        const marginHeaders = document.querySelectorAll('.kpi-card.orange h4');
        marginHeaders.forEach(header => {
            if (header.innerText === 'Margen Clínico') {
                const h2 = header.nextElementSibling;
                if (h2) h2.innerText = `${globalMargin.toFixed(1)}%`;
            }
        });

        // 2. Generar Notificación en Campana Header
        if (alertsGenerated > 0) {
            const bellBadge = document.querySelector('.header .notification .badge');
            if (bellBadge) {
                let currentCount = parseInt(bellBadge.innerText) || 0;
                bellBadge.innerText = currentCount + alertsGenerated;
                bellBadge.style.boxShadow = '0 0 10px #f72585';
                bellBadge.style.display = 'flex';
                
                // Abre el chat automáticamente si hay alerta
                document.getElementById('chatWidget').classList.add('active');
            }
        }
    }

    // Ejecutar mapeo inicial simulando lectura de DB
    setTimeout(mapClinicalMargins, 1500); 

    // Sentinel-1 Predicción de Abastecimiento (Cruce de Operaciones e Insumos)
    function forecastSupplyRisk() {
        // Mocked real-time cross-referencing between "Citas (7 Days)" & "Current Stock Drive"
        const inventoryData = {
            'Reactivos Laboratorio': { currentStock: 140, consumePerAppt: 2.5, upcomingAppts: 85 }, // 212.5 needed (140 < 212.5) -> CRITICAL
            'Insumos Radiología': { currentStock: 750, consumePerAppt: 1.8, upcomingAppts: 110 }   // 198 needed (750 > 198) -> OK
        };

        const listContainer = document.querySelector('#supplyForecastCard .list-container');
        if (!listContainer) return;

        let alerts = 0;
        let listItemsHtml = '';

        Object.keys(inventoryData).forEach(item => {
            const data = inventoryData[item];
            const neededForWeek = data.consumePerAppt * data.upcomingAppts;
            const daysLeftBeforeEmpty = (data.currentStock / data.consumePerAppt) / (data.upcomingAppts / 7);

            let statusClass = 'ok';
            let statusText = 'Suficiente para 7 días';
            let rowStyle = '';

            // Si el stock actual es menor a lo que requerirán las citas en los próximos 7 días
            if (data.currentStock < neededForWeek) {
                statusClass = 'low';
                statusText = `${daysLeftBeforeEmpty.toFixed(1)} días restantes`;
                rowStyle = 'critical-row';
                alerts++;
                
                // Alert Sentinel Action
                const chatBody = document.getElementById('chatBody');
                if (chatBody && alerts === 1) { // Prevenir spam en caso de múltiple rotura de stock
                    const alertMsg = document.createElement('div');
                    alertMsg.className = 'chat-message bot warning';
                    alertMsg.innerHTML = `<p>⚠️ <b>ROTURA DE STOCK (FORECAST):</b> Cruzando las ${data.upcomingAppts} citas próximas vs. el log de insumos, los <i>${item}</i> se agotarán en ${daysLeftBeforeEmpty.toFixed(1)} días (faltan ${(neededForWeek - data.currentStock).toFixed(0)} unidades para cubrir la semana). Recomiendo emitir orden de compra hoy.</p><span class="chat-time">IA Supply Chain</span>`;
                    chatBody.appendChild(alertMsg);
                    chatBody.scrollTop = chatBody.scrollHeight;
                }
            }

            listItemsHtml += `
            <div class="list-item ${rowStyle}">
                <span class="list-name">${item}</span>
                <span class="stock-level ${statusClass}">${statusText}</span>
            </div>
            `;
        });

        // Reemplazar la lista estática por los datos de predicción dinámicos
        listContainer.innerHTML = listItemsHtml;

        if (alerts > 0) {
            const bellBadge = document.querySelector('.header .notification .badge');
            if (bellBadge) {
                let currentCount = parseInt(bellBadge.innerText) || 0;
                bellBadge.innerText = currentCount + alerts;
                bellBadge.style.boxShadow = '0 0 10px #f72585';
                bellBadge.style.display = 'flex';
                
                // Forzar apertura de chat para urgencia logística
                document.getElementById('chatWidget').classList.add('active');
            }
        }
    }

    setTimeout(forecastSupplyRisk, 2500); // Trigger a bit after margins to feel like layered analysis

    // ==========================================
    // Mobile UX: Responsive Accordion System
    // ==========================================
    if (window.innerWidth <= 768) {
        const cards = document.querySelectorAll('.card');
        
        cards.forEach(card => {
            const header = card.querySelector('.card-header');
            
            // Exclude main hero card and kpi-grid (kpi-grid has no .card-header)
            // Only collapse analytical cards (charts, lists, secondary hero)
            if (header && !card.classList.contains('hero-card') || (header && card.classList.contains('secondary'))) {
                
                // Add chevron icon for visual feedback
                header.style.cursor = 'pointer';
                const toggleIcon = document.createElement('i');
                toggleIcon.className = 'fa-solid fa-chevron-up toggle-icon-mobile';
                header.appendChild(toggleIcon);

                // Default state: collapsed
                card.classList.add('collapsed-mobile');

                // Toggle click event
                header.addEventListener('click', () => {
                    const isCollapsed = card.classList.toggle('collapsed-mobile');
                    
                    // Si se abre una gráfica, forzamos un update de Chart.js para evitar que se aplaste
                    if (!isCollapsed) {
                        const canvas = card.querySelector('canvas');
                        if (canvas) {
                            // Find which chart it is based on ID
                            if (canvas.id === 'capacityChart') capacityChart.update('none');
                            if (canvas.id === 'financeChart') financeChart.update('none');
                        }
                    }
                });
            }
        });
    // ==========================================
    // Skill Store Engine (Sentinel Modules)
    // ==========================================
    const defaultSkills = [
        {
            id: 'supply_auditor',
            name: 'Supply Auditor',
            icon: 'fa-solid fa-file-invoice-dollar',
            description: 'Analiza variaciones de precios de proveedores en tiempo real cruzando facturas y costos.',
            saving: '$5,000 USD Ahorro Proyectado',
            price: '$20 USD',
            is_active: false
        },
        {
            id: 'growth_hacker',
            name: 'Growth Hacker',
            icon: 'fa-solid fa-chart-line',
            description: 'Calcula el ROI por canal de adquisición de pacientes/clientes y sugiere reasignación de pauta.',
            saving: '+15% Conversión Proyectada',
            price: '$35 USD',
            is_active: false
        },
        {
            id: 'payroll_predictor',
            name: 'Payroll Predictor',
            icon: 'fa-solid fa-users-gear',
            description: 'Proyecta gastos de personal y turnos según la agenda cargada para optimizar capacidad.',
            saving: '-12% Horas Extra Proyectadas',
            price: '$25 USD',
            is_active: false
        }
    ];

    let skillStore = [];
    const savedSkills = localStorage.getItem('nrv_skills');
    if (savedSkills) {
        try {
            skillStore = JSON.parse(savedSkills);
            if (!Array.isArray(skillStore)) throw new Error('Not an array');
        } catch(e) {
            console.error('Error parsing skills from localStorage', e);
            skillStore = defaultSkills;
            localStorage.setItem('nrv_skills', JSON.stringify(skillStore));
        }
    } else {
        skillStore = defaultSkills;
        localStorage.setItem('nrv_skills', JSON.stringify(skillStore));
    }

    // Expose globally to allow onclick calling
    window.unlockSkill = function(skillId) {
        const skill = skillStore.find(s => s.id === skillId);
        if (skill && !skill.is_active) {
            const confirmed = confirm(`¿Autorizar pago seguro de ${skill.price} para desbloquear ${skill.name}?`);
            if (confirmed) {
                skill.is_active = true;
                localStorage.setItem('nrv_skills', JSON.stringify(skillStore));
                alert(`¡${skill.name} desbloqueado exitosamente! El widget ahora está procesando datos.`);
                renderSkills();
            }
        }
    };

    function renderSkills(filterText = '') {
        const container = document.getElementById('skillsGridContent');
        if (!container) return;
        
        container.innerHTML = `
            <div style="grid-column: 1 / -1; display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
                <!-- Action Card: Build Your Own -->
                <div class="skill-card" style="border: 2px dashed #ffb042; background: rgba(255, 176, 66, 0.05); display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 20px 15px; cursor: pointer; transition: transform 0.3s; margin: 0; min-height: 200px;" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
                    <div style="width: 40px; height: 40px; border-radius: 50%; background: rgba(255, 176, 66, 0.1); display: flex; justify-content: center; align-items: center; margin: 0 auto 10px auto;">
                        <i class="fa-solid fa-hammer" style="font-size: 16px; color: #ffb042;"></i>
                    </div>
                    <h3 style="font-size: 15px; color: #ffb042; margin-bottom: 5px; line-height: 1.2;">Construir<br>desde cero</h3>
                    <p style="font-size: 11px; color: var(--text-muted); margin-bottom: 10px; line-height: 1.3;">Crea tu algoritmo con lienzo en blanco.</p>
                    <button class="btn-unlock" style="background: transparent; color: #ffb042; border: 1px solid #ffb042; width: 100%; padding: 8px; font-size: 12px; margin-top: auto;" onclick="alert('Abriendo creador de Skills...')">Empezar</button>
                </div>

                <!-- Action Card: Connect Integration -->
                <div class="skill-card" style="border: 2px dashed var(--primary-color); background: rgba(67, 97, 238, 0.02); display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 20px 15px; cursor: pointer; transition: transform 0.3s; margin: 0; min-height: 200px;" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
                    <div style="width: 40px; height: 40px; border-radius: 50%; background: rgba(67, 97, 238, 0.1); display: flex; justify-content: center; align-items: center; margin: 0 auto 10px auto;">
                        <i class="fa-solid fa-plug" style="font-size: 16px; color: var(--primary-color);"></i>
                    </div>
                    <h3 style="font-size: 15px; color: var(--primary-color); margin-bottom: 5px; line-height: 1.2;">Conectar<br>App (API)</h3>
                    <p style="font-size: 11px; color: var(--text-muted); margin-bottom: 10px; line-height: 1.3;">Vincula datos de Zapier, Make o APIs.</p>
                    <button class="btn-unlock" style="background: transparent; color: var(--primary-color); border: 1px solid var(--primary-color); width: 100%; padding: 8px; font-size: 12px; margin-top: auto;" onclick="alert('Abriendo configuración de Webhooks...')">Integrar App</button>
                </div>
            </div>
        `;

        const filteredSkills = skillStore.filter(skill => {
            const searchStr = filterText.toLowerCase();
            return skill.name.toLowerCase().includes(searchStr) || skill.description.toLowerCase().includes(searchStr);
        });

        filteredSkills.forEach(skill => {
            const isLocked = !skill.is_active;
            const html = `
                <div class="skill-card ${isLocked ? 'locked' : ''}">
                    <div class="skill-header">
                        <i class="${skill.icon}"></i>
                        <h4>${skill.name}</h4>
                        ${isLocked ? '<span class="badge-premium"><i class="fa-solid fa-lock" style="font-size:10px; color:#000;"></i> Premium</span>' : '<span class="badge-premium" style="background:var(--success-color);color:white"><i class="fa-solid fa-check" style="font-size:10px; color:white;"></i> Activa</span>'}
                    </div>
                    <div class="skill-preview">
                        <p>${skill.description}</p>
                        ${isLocked ? `
                        <div class="blurred-content">
                            <span>${skill.saving}</span>
                        </div>
                        ` : `
                        <div class="unlocked-content" style="padding:15px;background:rgba(67, 97, 238, 0.05);border-radius:8px;margin-top:15px; border: 1px solid rgba(67, 97, 238, 0.2);">
                            <strong style="color:var(--primary-color);font-size:13px;"><i class="fa-solid fa-circle-play"></i> Reporte Activo</strong><br>
                            <span style="font-size:12px; color:var(--text-muted);">Sentinel está operando este módulo silenciosamente.</span>
                        </div>
                        `}
                    </div>
                    ${isLocked ? `<button class="btn-unlock" onclick="window.unlockSkill('${skill.id}')">Desbloquear por ${skill.price}</button>` : ''}
                </div>
            `;
            container.innerHTML += html;
        });
    }

    // Global Navigation Handlers
    const dashboardGrid = document.getElementById('dashboardGrid');
    const skillsGrid = document.getElementById('skillsGrid');

    window.openSkillsStore = function(e) {
        if (e) e.preventDefault();
        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('[data-nav="skills"]').forEach(el => el.classList.add('active'));
        if (dashboardGrid) dashboardGrid.style.display = 'none';
        if (skillsGrid) {
            skillsGrid.style.display = 'flex';
            skillsGrid.style.flexDirection = 'column';
        }
        const topSearchBar = document.getElementById('topSearchBar');
        if (topSearchBar) topSearchBar.style.display = 'none';
        
        const searchInput = document.getElementById('skillSearch');
        renderSkills(searchInput ? searchInput.value : '');
    };

    window.openDashboard = function(e) {
        if (e) e.preventDefault();
        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('[data-nav="dashboard"]').forEach(el => el.classList.add('active'));
        if (skillsGrid) skillsGrid.style.display = 'none';
        if (dashboardGrid) dashboardGrid.style.display = 'grid';
        
        const topSearchBar = document.getElementById('topSearchBar');
        if (topSearchBar) topSearchBar.style.display = 'flex';
    };

    // Nav navigation logic for Skills Store
    const navDashboard = document.getElementById('nav-dashboard');
    const navSkills = document.getElementById('nav-skills');

    if (navSkills) {
        navSkills.addEventListener('click', window.openSkillsStore);
    }

        const skillSearchInput = document.getElementById('skillSearch');
        if (skillSearchInput) {
            skillSearchInput.addEventListener('input', (e) => {
                renderSkills(e.target.value);
            });
        }

        if (navDashboard) {
            navDashboard.addEventListener('click', window.openDashboard);
        }
    }

    // Call render once to initialize if opened
    renderSkills();

    // Sentinel Pitch Protocol (Internal Sales)
    function runSentinelPitchProtocol() {
        const auditor = skillStore.find(s => s.id === 'supply_auditor');
        if (auditor && !auditor.is_active) {
            // Simular un escaneo silencioso y lanzar una alerta de venta interna
            setTimeout(() => {
                const chatBody = document.getElementById('chatBody');
                if (chatBody) {
                    const alertMsg = document.createElement('div');
                    alertMsg.className = 'chat-message bot warning';
                    alertMsg.innerHTML = `
                        <p>💡 <b>OPORTUNIDAD DETECTADA:</b> He realizado un escaneo silencioso y detecté una oportunidad de optimización en compras y variación de precios de proveedores.<br><br>
                        <a href="#" onclick="document.getElementById('nav-skills').click(); document.getElementById('chatWidget').classList.remove('active'); return false;" style="color:var(--primary-color);font-weight:bold;text-decoration:underline;">Desbloquea la Skill de Supply Auditor</a> para ver el reporte detallado y capturar un ahorro proyectado de $5,000 USD.</p>
                        <span class="chat-time">Sentinel Pitch Engine</span>
                    `;
                    chatBody.appendChild(alertMsg);
                    chatBody.scrollTop = chatBody.scrollHeight;
                    
                    // Notificar con badge de campana
                    const bellBadge = document.querySelector('.header .notification .badge');
                    if (bellBadge) {
                        let currentCount = parseInt(bellBadge.innerText) || 0;
                        bellBadge.innerText = currentCount + 1;
                        bellBadge.style.boxShadow = '0 0 10px #ffb042';
                        bellBadge.style.display = 'flex';
                    }
                    
                    // Notificar en el toggle del chat
                    const chatToggleBadge = document.querySelector('#chatToggle .chat-badge');
                    if (chatToggleBadge) {
                        chatToggleBadge.style.display = 'flex';
                        chatToggleBadge.innerText = '1';
                    }
                }
            }, 6000); // 6 seconds after page load
        }
    }
    
    // Iniciar el protocolo de venta
    runSentinelPitchProtocol();

});
