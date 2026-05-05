const obState = {
    company_name: "",
    industry: "",
    team_size: "",
    challenge: "",
    core_asset: "",
    file_uploaded: false
};

// Navegación de Pasos
function goToStep(step) {
    // Validaciones antes de avanzar
    if (step === 3) { // Intentando ir de 2 a 3
        const company = document.getElementById('ob-company').value.trim();
        const industry = document.getElementById('ob-industry').value;
        if (!company || !industry || !obState.team_size) {
            alert('Por favor, completa Nombre, Industria y Tamaño de equipo.');
            return;
        }
        obState.company_name = company;
        obState.industry = industry;
    }
    
    if (step === 4) { // Intentando ir de 3 a 4
        const asset = document.getElementById('ob-asset').value.trim();
        if (!asset) {
            alert('Por favor, indica tu activo crítico.');
            return;
        }
        obState.core_asset = asset;
    }
    
    if (step === 5) { // Preparar confirmación
        renderConfirmation();
    }

    // Ocultar todos los steps
    document.querySelectorAll('.wizard-step').forEach(el => el.classList.remove('active'));
    // Mostrar target
    document.getElementById(`wizard-step-${step}`).classList.add('active');

    // Controlar Header de Indicadores
    const header = document.getElementById('ob-header');
    if (step === 1 || step === 5) {
        header.style.display = 'none';
    } else {
        header.style.display = 'block';
        updateIndicators(step);
    }
}

function updateIndicators(step) {
    const bar = document.getElementById('progress-bar');
    if (bar) {
        // Calculamos el porcentaje:
        // Paso 2 = 33%
        // Paso 3 = 66%
        // Paso 4 = 100%
        let percentage = 0;
        if (step === 2) percentage = 33;
        if (step === 3) percentage = 66;
        if (step === 4) percentage = 100;
        
        bar.style.width = percentage + '%';
    }
}

// Interacciones UI - Botones (Paso 2)
document.addEventListener('DOMContentLoaded', () => {
    // Team Grid
    document.querySelectorAll('.grid-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.grid-btn').forEach(b => b.classList.remove('selected'));
            e.target.classList.add('selected');
            obState.team_size = e.target.getAttribute('data-value');
        });
    });

    // Challenge Stack
    document.querySelectorAll('.stack-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.stack-btn').forEach(b => b.classList.remove('selected'));
            e.target.classList.add('selected');
            obState.challenge = e.target.getAttribute('data-value');
        });
    });

    // File Input (Paso 4)
    const fileInput = document.getElementById('file-input');
    const uploadZone = document.getElementById('upload-zone');
    
    if(fileInput && uploadZone) {
        fileInput.addEventListener('change', (e) => {
            if(e.target.files.length > 0) {
                handleFileUpload(e.target.files[0].name);
            }
        });

        // Drag & Drop
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });
        uploadZone.addEventListener('dragleave', () => {
            uploadZone.classList.remove('dragover');
        });
        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            if(e.dataTransfer.files.length > 0) {
                handleFileUpload(e.dataTransfer.files[0].name);
            }
        });
    }
});

function handleFileUpload(filename) {
    const zone = document.getElementById('upload-zone');
    zone.classList.add('success');
    zone.innerHTML = `<i class="fa-solid fa-check-circle text-success" style="font-size: 40px; margin-bottom: 15px;"></i>
                      <h4 style="margin-bottom: 5px; color: var(--success-color);">¡Archivo detectado!</h4>
                      <p style="font-size: 13px; color: var(--text-muted);">${filename}</p>`;
    obState.file_uploaded = true;
    
    setTimeout(() => {
        goToStep(5);
    }, 1500);
}

function skipDataUpload() {
    obState.file_uploaded = false;
    goToStep(5);
}

function updateAssetPlaceholder() {
    const ind = document.getElementById('ob-industry').value;
    const txt = document.getElementById('ob-asset');
    
    const placeholders = {
        'Salud': 'Ej: Salas de cirugía, Equipos médicos, Médicos...',
        'Automotriz': 'Ej: Máquinas CNC, Mecánicos, Vehículos en taller...',
        'Retail': 'Ej: Puntos de venta, Vendedores, Inventario...',
        'SaaS': 'Ej: Servidores, Desarrolladores, Clientes activos...',
        'Consultoría': 'Ej: Horas de consultor, Proyectos activos...',
        'Manufactura': 'Ej: Líneas de ensamblaje, Materia prima...',
        'Otro': 'Ej: Máquinas, Personal, Inventario...'
    };
    
    txt.placeholder = placeholders[ind] || placeholders['Otro'];
}

function renderConfirmation() {
    document.getElementById('summary-name').innerText = obState.company_name;
    document.getElementById('summary-industry').innerText = obState.industry;
    document.getElementById('summary-team').innerText = `${obState.team_size} personas`;
    document.getElementById('summary-asset').innerText = obState.core_asset;

    const statusEl = document.getElementById('summary-data-status');
    const diagCard = document.getElementById('diagnosis-card');

    if (obState.file_uploaded) {
        statusEl.innerHTML = '<i class="fa-solid fa-check text-success"></i> Datos Cargados';
        diagCard.innerHTML = `
            <div style="font-size: 13px; font-weight: 600; color: var(--success-color); margin-bottom: 10px; display: flex; align-items: center; gap: 5px;"><i class="fa-solid fa-wand-magic-sparkles"></i> Escaneo IA Completado</div>
            <h4 style="margin-bottom: 15px; font-size: 16px;">Diagnóstico de ${obState.core_asset}</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div style="background: #f8fafc; padding: 10px; border-radius: 8px;">
                    <span style="font-size: 11px; color: var(--text-muted); display: block;">Margen Promedio</span>
                    <span style="font-size: 18px; font-weight: 700; color: var(--primary-color);">24%</span>
                </div>
                <div style="background: #f8fafc; padding: 10px; border-radius: 8px;">
                    <span style="font-size: 11px; color: var(--text-muted); display: block;">Oportunidad</span>
                    <span style="font-size: 18px; font-weight: 700; color: var(--warning-color);">30%</span>
                </div>
            </div>
            <div style="font-size: 13px; color: var(--text-color); border-left: 3px solid var(--primary-color); padding-left: 10px;">
                <strong>Quick Win:</strong> Hay capacidad subutilizada en fines de semana.
            </div>
        `;
    } else {
        statusEl.innerHTML = '<i class="fa-solid fa-clock text-warning"></i> Datos Pendientes';
        diagCard.innerHTML = `
            <div style="font-size: 13px; font-weight: 600; color: var(--primary-color); margin-bottom: 10px; display: flex; align-items: center; gap: 5px;"><i class="fa-solid fa-lightbulb"></i> Potencial de NRV</div>
            <h4 style="margin-bottom: 10px; font-size: 16px;">¿Qué descubrirás aquí?</h4>
            <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 15px;">Al cargar datos sobre <strong>${obState.core_asset}</strong>, NRV detectará automáticamente anomalías, calculará tu margen real y te dará alertas de negocio.</p>
            <div style="display: flex; gap: 10px; font-size: 12px; color: var(--primary-color);">
                <span style="background: rgba(67, 97, 238, 0.1); padding: 5px 10px; border-radius: 20px;">Rentabilidad</span>
                <span style="background: rgba(67, 97, 238, 0.1); padding: 5px 10px; border-radius: 20px;">Cuellos de botella</span>
            </div>
        `;
    }
}

function finishOnboarding() {
    // Guardar en localStorage para uso global
    localStorage.setItem('nrv_onboarding_state', JSON.stringify(obState));
    
    // Transición visual al dashboard
    const wiz = document.getElementById('onboardingWizard');
    wiz.style.opacity = '0';
    setTimeout(() => {
        wiz.style.display = 'none';
        
        // Show main dashboard
        const main = document.getElementById('mainDashboard');
        main.style.display = 'flex';
        void main.offsetWidth; // Trigger reflow
        main.style.opacity = '1';
        
        // Disparar evento para app.js
        window.dispatchEvent(new Event('onboardingCompleted'));
        
        // Trigger chart rendering in dashboard
        if (typeof window.dispatchEvent === 'function') {
            window.dispatchEvent(new Event('resize'));
        }
    }, 500);
}
