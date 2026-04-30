document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const wizardContainer = document.getElementById('onboardingWizard');
    const mainDashboard = document.getElementById('mainDashboard');
    
    const steps = [
        document.getElementById('wizard-step-1'),
        document.getElementById('wizard-step-2'),
        document.getElementById('wizard-step-3')
    ];
    
    const indicators = [
        document.getElementById('indicator-step-1'),
        document.getElementById('indicator-step-2'),
        document.getElementById('indicator-step-3')
    ];
    
    const stepLines = document.querySelectorAll('.step-line');
    
    // Buttons
    const btnNext1 = document.getElementById('btn-next-1');
    const btnNext2 = document.getElementById('btn-next-2');
    const btnPrev2 = document.getElementById('btn-prev-2');
    const btnPrev3 = document.getElementById('btn-prev-3');
    const btnFinish = document.getElementById('btn-finish');
    
    const btnUploadFile = document.getElementById('btn-upload-file');
    const btnDownloadTpl = document.getElementById('btn-download-tpl');
    const dataOptionsContainer = document.getElementById('data-options-container');
    const columnMappingContainer = document.getElementById('column-mapping');
    
    // First Landing Elements
    const firstLanding = document.getElementById('first-landing');
    const btnGotoDashboard = document.getElementById('btn-goto-dashboard');
    const landingWelcome = document.getElementById('landing-welcome');
    const landingAssetName = document.getElementById('landing-asset-name');
    
    // Inputs
    const inputCompany = document.getElementById('ob-company');
    const inputIndustry = document.getElementById('ob-industry');
    const industryCards = document.querySelectorAll('.industry-card');
    const inputCoreAsset = document.getElementById('ob-core-asset');
    const assetLabelDisplay = document.getElementById('asset-label-display');
    
    let currentStep = 0;
    let SYSTEM_CORE_ASSET = '';

    // Step Navigation Function
    function goToStep(stepIndex) {
        // Hide all steps
        steps.forEach(s => s.classList.remove('active'));
        // Show target step
        steps[stepIndex].classList.add('active');
        
        // Update Indicators
        indicators.forEach((ind, idx) => {
            if (idx === stepIndex) {
                ind.classList.add('active');
                ind.classList.remove('completed');
            } else if (idx < stepIndex) {
                ind.classList.remove('active');
                ind.classList.add('completed');
                ind.innerHTML = '<i class="fa-solid fa-check"></i>';
            } else {
                ind.classList.remove('active', 'completed');
                ind.innerHTML = idx + 1;
            }
        });
        
        // Update Lines
        stepLines.forEach((line, idx) => {
            if (idx < stepIndex) {
                line.classList.add('active');
            } else {
                line.classList.remove('active');
            }
        });

        currentStep = stepIndex;
    }

    // Event Listeners for Navigation
    btnNext1.addEventListener('click', () => {
        // Validation could be added here
        goToStep(1);
    });

    btnNext2.addEventListener('click', () => {
        SYSTEM_CORE_ASSET = inputCoreAsset.value.trim() || 'Recurso Base';
        assetLabelDisplay.innerText = `(Vincular a: ${SYSTEM_CORE_ASSET})`;
        goToStep(2);
    });

    btnPrev2.addEventListener('click', () => goToStep(0));
    btnPrev3.addEventListener('click', () => goToStep(1));

    // Industry Selection & Theming
    industryCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove selected class from all
            industryCards.forEach(c => c.classList.remove('selected'));
            // Add to clicked
            card.classList.add('selected');
            
            const industry = card.getAttribute('data-industry');
            inputIndustry.value = industry;
            
            // Apply Theme based on industry
            applyTheme(industry);
        });
    });

    function applyTheme(industry) {
        const root = document.documentElement;
        
        if (industry === 'Clínica') {
            root.style.setProperty('--primary-color', '#4361ee'); // Blue
            // Icon replacements would happen here on the main dashboard if needed
        } else if (industry === 'Taller') {
            root.style.setProperty('--primary-color', '#e67e22'); // Orange
            // Replace some icons in sidebar just to demo the effect
            document.querySelectorAll('.sidebar .fa-notes-medical, .sidebar .fa-heart-pulse').forEach(icon => {
                icon.className = 'fa-solid fa-screwdriver-wrench logo-icon';
            });
        } else if (industry === 'Servicios') {
            root.style.setProperty('--primary-color', '#8A64D6'); // Purple
            document.querySelectorAll('.sidebar .fa-notes-medical, .sidebar .fa-heart-pulse').forEach(icon => {
                icon.className = 'fa-solid fa-briefcase logo-icon';
            });
        }
    }

    // Step 3: Mock File Upload Validation
    btnUploadFile.addEventListener('click', () => {
        // Simulate file picker open and selection delay
        btnUploadFile.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Analizando Estructura...';
        btnUploadFile.style.pointerEvents = 'none';
        
        setTimeout(() => {
            dataOptionsContainer.style.display = 'none';
            columnMappingContainer.style.display = 'block';
            btnFinish.style.display = 'block';
        }, 1500);
    });

    // Generate and Download Excel Template
    btnDownloadTpl.addEventListener('click', () => {
        // Create a new workbook
        const wb = XLSX.utils.book_new();

        // 1. VENTAS
        const wsVentas = XLSX.utils.aoa_to_sheet([
            ["Fecha", "Ítem_Vendido", "Categoría", "Precio_Venta", "Especialista_ID", "Cliente_ID"],
            ["2026-04-29", "Consulta Especialista", "Servicio", 150000, "ESP-001", "CLI-992"],
            ["2026-04-29", "Procedimiento Menor", "Cirugía", 850000, "ESP-002", "CLI-105"]
        ]);
        XLSX.utils.book_append_sheet(wb, wsVentas, "VENTAS");

        // 2. OPERACIONES
        const wsOperaciones = XLSX.utils.aoa_to_sheet([
            ["Fecha", "Recurso_ID", "Hora_Inicio", "Hora_Fin", "Estado"],
            ["2026-04-29", "Sala-101", "08:00", "08:45", "Cumplida"],
            ["2026-04-29", "Sala-102", "09:00", "10:00", "No-Show"]
        ]);
        XLSX.utils.book_append_sheet(wb, wsOperaciones, "OPERACIONES");

        // 3. COSTOS
        const wsCostos = XLSX.utils.aoa_to_sheet([
            ["Ítem_Vendido", "Costo_Insumo", "Gasto_Fijo_Asociado"],
            ["Consulta Especialista", 25000, 15000],
            ["Procedimiento Menor", 350000, 120000]
        ]);
        XLSX.utils.book_append_sheet(wb, wsCostos, "COSTOS");

        // Generate and download the file
        XLSX.writeFile(wb, "Sentinel_Template_Dorado.xlsx");
    });

    // Finish Wizard -> Transition to First Landing
    btnFinish.addEventListener('click', () => {
        // Check if mappings are selected (optional validation)
        const priceMap = document.getElementById('map-price').value;
        const costMap = document.getElementById('map-cost').value;
        const resourceMap = document.getElementById('map-resource').value;
        
        btnFinish.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Procesando Insights...';
        
        // Populate First Landing Dynamic Text
        const companyName = inputCompany.value.trim() || 'Empresa';
        const industryName = inputIndustry.value || 'General';
        landingWelcome.innerText = `Bienvenido, ${companyName} | Empresa: ${industryName}`;
        landingAssetName.innerText = SYSTEM_CORE_ASSET;

        setTimeout(() => {
            // Fade out wizard
            wizardContainer.style.opacity = '0';
            
            setTimeout(() => {
                wizardContainer.style.display = 'none';
                // Show First Landing
                firstLanding.style.display = 'flex';
                // Trigger a reflow
                void firstLanding.offsetWidth;
                firstLanding.style.opacity = '1';
            }, 500);
        }, 1200);
    });

    // Transition: First Landing -> Dashboard
    btnGotoDashboard.addEventListener('click', () => {
        btnGotoDashboard.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Cargando Centro de Mando...';
        
        setTimeout(() => {
            firstLanding.style.opacity = '0';
            
            setTimeout(() => {
                firstLanding.style.display = 'none';
                mainDashboard.style.display = 'flex';
                void mainDashboard.offsetWidth;
                mainDashboard.style.opacity = '1';
                
                // Trigger chart rendering in dashboard
                if (typeof window.dispatchEvent === 'function') {
                    window.dispatchEvent(new Event('resize'));
                }
            }, 500);
        }, 800);
    });
});
