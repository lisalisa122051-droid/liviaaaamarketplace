document.addEventListener('DOMContentLoaded', () => {
    
    // ===========================================
    // BAGIAN A: ANIMASI HEADER & COUNTER
    // ===========================================

    const countingTextElement = document.getElementById('counting-text');
    const heroSection = document.querySelector('.hero-section');
    const targetText = countingTextElement ? countingTextElement.textContent.trim() : '';
    if (countingTextElement) countingTextElement.textContent = ''; 
    let isHeroTextAnimated = false;

    // --- Animasi Teks (Typing Effect) ---
    function animateCountingText(textElement, fullText, duration = 3000) {
        if (!textElement || isHeroTextAnimated) return;
        isHeroTextAnimated = true;
        textElement.style.opacity = '1'; 
        let index = 0;
        const totalLength = fullText.length;
        const intervalTime = duration / totalLength;

        const typingInterval = setInterval(() => {
            if (index < totalLength) {
                textElement.textContent += fullText.charAt(index);
                index++;
            } else {
                clearInterval(typingInterval);
                textElement.style.borderRight = 'none'; 
            }
        }, intervalTime);
    }
    
    // --- Observer untuk memulai animasi Teks ---
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isHeroTextAnimated) {
                animateCountingText(countingTextElement, targetText);
            }
        });
    }, { threshold: 0.5 }); 

    if (heroSection) {
        heroObserver.observe(heroSection);
    }

    // --- Animasi Counter Statistik ---
    const counters = document.querySelectorAll('.counter');
    const statsSection = document.querySelector('.stats-section');
    let isCountingStarted = false; 

    function startCounting(counterElement) {
        const target = +counterElement.getAttribute('data-target');
        const duration = 2000; 
        const fps = 60; 
        const totalFrames = duration / (1000 / fps);
        const increment = target / totalFrames; 
        let current = 0;
        let frame = 0;
        
        const interval = setInterval(() => {
            frame++;
            current += increment;
            
            if (frame >= totalFrames) {
                clearInterval(interval);
                counterElement.innerText = target; 
            } else {
                counterElement.innerText = Math.ceil(current);
            }
        }, 1000 / fps);
    }

    function checkVisibility() {
        if (!statsSection) return;

        const sectionTop = statsSection.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (sectionTop < windowHeight * 0.75 && !isCountingStarted) {
            isCountingStarted = true;
            counters.forEach(startCounting);
            window.removeEventListener('scroll', checkVisibility);
        }
    }

    if (statsSection) {
        window.addEventListener('scroll', checkVisibility);
        checkVisibility(); 
    }

    // ===========================================
    // BAGIAN B: LOGIKA MODAL TRANSAKSI (QRIS)
    // ===========================================

    // --- Elemen Modal QRIS ---
    const modal = document.getElementById('transaction-modal');
    const closeButton = modal.querySelector('.close-button');
    const buyButtons = document.querySelectorAll('.buy-now-button'); 
    
    // --- Elemen Langkah-langkah QRIS ---
    const step1 = document.getElementById('modal-step-1'); // QRIS
    const step2 = document.getElementById('modal-step-2'); // Upload
    const step3 = document.getElementById('modal-step-3'); // Verifikasi
    const step4 = document.getElementById('modal-step-4'); // Selesai

    // --- Elemen Progress Bar QRIS ---
    const progressLine = document.getElementById('progress-line'); 
    
    // --- Elemen Input & Tombol QRIS ---
    const productNameDisplay = document.getElementById('product-name-display');
    const eWalletSelect = document.getElementById('e-wallet-select');
    const btnNextToUpload = document.getElementById('btn-next-to-upload');
    const btnCancelTransaction = document.getElementById('btn-cancel-transaction');
    const paymentProofUpload = document.getElementById('payment-proof-upload');
    const fileNameDisplay = document.getElementById('file-name-display');
    const btnSendProof = document.getElementById('btn-send-proof');
    const btnBackToQris = document.getElementById('btn-back-to-qris');
    const btnTransactionComplete = document.getElementById('btn-transaction-complete');

    let currentStep = 1;
    let selectedProduct = '';

    // Fungsi Pembantu: Update Progress Bar
    function updateProgressBar(step) {
        const totalSteps = 4;
        currentStep = step;
        
        for (let i = 1; i <= totalSteps; i++) {
            const dot = document.getElementById(`step-dot-${i}`);
            dot.classList.remove('active', 'complete');
            if (i < currentStep) {
                dot.classList.add('complete');
            } else if (i === currentStep) {
                dot.classList.add('active');
            }
        }

        let progressWidth = 0;
        if (currentStep > 1) {
            progressWidth = ((currentStep - 1) / (totalSteps - 1)) * 100;
        }
        progressLine.style.width = `${progressWidth}%`;
    }

    // Fungsi Buka Modal QRIS
    function openQrisModal(productName) {
        selectedProduct = productName || 'Pesanan Anda';
        productNameDisplay.textContent = `(${selectedProduct})`;

        // Reset ke Step 1
        step1.style.display = 'block';
        step2.style.display = 'none';
        step3.style.display = 'none';
        step4.style.display = 'none';
        updateProgressBar(1); 
        
        // Reset input
        eWalletSelect.value = '';
        btnNextToUpload.disabled = true;
        paymentProofUpload.value = '';
        fileNameDisplay.textContent = 'Belum ada file dipilih.';
        btnSendProof.disabled = true;

        modal.style.display = 'block';
    }

    function closeQrisModal() {
        modal.style.display = 'none';
    }
    
    // --- Event Listeners Pembuka Modal QRIS ---
    buyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); 
            // Tutup Call Center modal jika terbuka
            document.getElementById('call-center-modal').style.display = 'none'; 
            openQrisModal(button.getAttribute('data-product'));
        });
    });

    // Event Listeners Penutup Modal QRIS
    closeButton.addEventListener('click', closeQrisModal);
    btnCancelTransaction.addEventListener('click', closeQrisModal);
    btnTransactionComplete.addEventListener('click', closeQrisModal);
    
    // --- Logika Alur QRIS ---

    // Step 1: QRIS
    eWalletSelect.addEventListener('change', () => {
        btnNextToUpload.disabled = eWalletSelect.value === '';
    });
    
    btnNextToUpload.addEventListener('click', () => {
        if (btnNextToUpload.disabled) return;
        step1.style.display = 'none';
        step2.style.display = 'block';
        updateProgressBar(2); 
    });

    // Step 2: Upload
    paymentProofUpload.addEventListener('change', () => {
        if (paymentProofUpload.files.length > 0) {
            fileNameDisplay.textContent = paymentProofUpload.files[0].name;
            btnSendProof.disabled = false;
        } else {
            fileNameDisplay.textContent = 'Belum ada file dipilih.';
            btnSendProof.disabled = true;
        }
    });

    btnBackToQris.addEventListener('click', () => {
        step2.style.display = 'none';
        step1.style.display = 'block';
        updateProgressBar(1);
    });

    btnSendProof.addEventListener('click', () => {
        if (btnSendProof.disabled) return;
        
        step2.style.display = 'none';
        step3.style.display = 'block';
        updateProgressBar(3); 
        
        // Simulasi Verifikasi (Pindah ke Selesai setelah 3 detik)
        setTimeout(() => {
            step3.style.display = 'none';
            step4.style.display = 'block';
            updateProgressBar(4); 
        }, 3000); 
    });

    // ===========================================
    // BAGIAN C: LOGIKA MODAL CALL CENTER ID
    // ===========================================

    // --- Elemen Modal Call Center ---
    const ccModal = document.getElementById('call-center-modal');
    const btnOpenCallCenter = document.getElementById('open-call-center-modal');
    const closeCcModalButton = document.getElementById('close-call-center-modal');
    
    // --- Elemen Langkah-langkah Call Center ---
    const ccStep1 = document.getElementById('call-center-modal-step-1'); 
    const ccStep2 = document.getElementById('call-center-modal-step-2'); 
    const ccStep3 = document.getElementById('call-center-modal-step-3'); 

    // --- Elemen Input & Tombol Call Center ---
    const ccIdInput = document.getElementById('call-center-id-input-cc');
    const btnSendIdCc = document.getElementById('btn-send-id-cc');
    const btnCancelCc = document.getElementById('btn-cancel-call-center');
    const waAdminLinkCc = document.getElementById('wa-admin-link-cc');
    const simulatedProgressCc = document.getElementById('simulated-progress-cc');
    let ccProgressInterval;

    // Fungsi Buka Modal Call Center
    function openCcModal() {
        // Tutup QRIS modal jika terbuka
        document.getElementById('transaction-modal').style.display = 'none'; 

        // Reset ke Step 1
        ccStep1.style.display = 'block';
        ccStep2.style.display = 'none';
        ccStep3.style.display = 'none';
        
        // Reset input dan progress
        ccIdInput.value = '';
        btnSendIdCc.disabled = true;
        clearInterval(ccProgressInterval); 
        simulatedProgressCc.style.width = '0%';

        ccModal.style.display = 'block';
    }
    
    function closeCcModal() {
        ccModal.style.display = 'none';
        clearInterval(ccProgressInterval);
    }
    
    // --- Event Listeners Pembuka & Penutup Call Center ---
    btnOpenCallCenter.addEventListener('click', openCcModal);
    closeCcModalButton.addEventListener('click', closeCcModal);
    btnCancelCc.addEventListener('click', closeCcModal);

    // --- Logika Alur Call Center ---
    
    // Step 1: Input
    ccIdInput.addEventListener('input', () => {
        btnSendIdCc.disabled = ccIdInput.value.trim() === '';
    });
    
    btnSendIdCc.addEventListener('click', () => {
        if (btnSendIdCc.disabled) return;

        const callCenterID = ccIdInput.value.trim();
        
        ccStep1.style.display = 'none';
        ccStep2.style.display = 'block';
        startSimulatedCcProgress(callCenterID); 
    });
    
    // Step 2: Simulasi Proses Pengiriman Pesan WA
    function startSimulatedCcProgress(callCenterID) {
        let currentProgress = 0;
        
        const increaseProgress = () => {
            currentProgress += 15; 
            if (currentProgress > 100) currentProgress = 100;

            simulatedProgressCc.style.width = `${currentProgress}%`;

            if (currentProgress >= 100) {
                clearInterval(ccProgressInterval);
                
                // Pindah ke Step 3 (Selesai)
                setTimeout(() => {
                    ccStep2.style.display = 'none';
                    ccStep3.style.display = 'block';
                    
                    // Siapkan link WA admin
                    const waMessage = `Halo Admin Livia, saya ingin memproses Subjek/ID Call Center: *${callCenterID}*. Mohon bantuannya.`;
                    waAdminLinkCc.href = `https://wa.me/6281234567890?text=${encodeURIComponent(waMessage)}`; 
                }, 500); 
            }
        };

        clearInterval(ccProgressInterval);
        ccProgressInterval = setInterval(increaseProgress, 300); 
    }

    // --- Global Listener untuk Menutup Modal ---
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeQrisModal();
        }
        if (event.target === ccModal) {
            closeCcModal();
        }
    });

});