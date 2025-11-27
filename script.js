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
    }, { threshold: 0.1 });

    if (heroSection) heroObserver.observe(heroSection);

    // --- Animasi Counter Statistik ---
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.counter');
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    const duration = 2000; 
                    let start = 0;
                    const increment = target / (duration / 16); 

                    const updateCounter = () => {
                        start += increment;
                        if (start < target) {
                            counter.textContent = Math.ceil(start);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target;
                        }
                    };
                    updateCounter();
                });
                observer.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) counterObserver.observe(statsSection);



    // ===========================================
    // BAGIAN B: LOGIKA MODAL TRANSAKSI (QRIS)
    // ===========================================

    const modal = document.getElementById('transaction-modal');
    const closeButton = modal.querySelector('.close-button');
    const buyButtons = document.querySelectorAll('.buy-now-button');
    const productNameDisplay = document.getElementById('product-name-display');
    
    const step1 = document.getElementById('modal-step-1');
    const step2 = document.getElementById('modal-step-2');
    const step3 = document.getElementById('modal-step-3');
    const step4 = document.getElementById('modal-step-4');
    
    const progressLine = document.getElementById('progress-line');
    const stepDots = [
        document.getElementById('step-dot-1'),
        document.getElementById('step-dot-2'),
        document.getElementById('step-dot-3'),
        document.getElementById('step-dot-4')
    ];

    const eWalletSelect = document.getElementById('e-wallet-select');
    const btnNextToUpload = document.getElementById('btn-next-to-upload');
    const paymentProofUpload = document.getElementById('payment-proof-upload');
    const fileNameDisplay = document.getElementById('file-name-display');
    const btnSendProof = document.getElementById('btn-send-proof');
    const btnBackToQris = document.getElementById('btn-back-to-qris');
    const btnTransactionComplete = document.getElementById('btn-transaction-complete');
    const btnCancelTransaction = document.getElementById('btn-cancel-transaction');


    // --- Fungsi Bantuan ---
    function updateModalStep(currentStep) {
        // Reset semua langkah
        [step1, step2, step3, step4].forEach(el => el.style.display = 'none');
        
        // Atur tampilan langkah saat ini
        if (currentStep === 1) {
            step1.style.display = 'block';
        } else if (currentStep === 2) {
            step2.style.display = 'block';
        } else if (currentStep === 3) {
            step3.style.display = 'block';
        } else if (currentStep === 4) {
            step4.style.display = 'block';
        }

        // Update progress bar
        stepDots.forEach((dot, index) => {
            dot.classList.remove('active', 'complete');
            if (index < currentStep - 1) {
                dot.classList.add('complete');
            } else if (index === currentStep - 1) {
                dot.classList.add('active');
            }
        });

        // Hitung lebar garis (line)
        const linePercentage = (currentStep - 1) * 33.33; 
        progressLine.style.width = `${linePercentage}%`;
    }

    function closeQrisModal() {
        modal.style.display = 'none';
        updateModalStep(1); // Kembali ke langkah 1 saat ditutup
        eWalletSelect.value = '';
        btnNextToUpload.disabled = true;
        paymentProofUpload.value = '';
        fileNameDisplay.textContent = 'Belum ada file dipilih.';
        btnSendProof.disabled = true;
    }


    // --- Event Listeners ---
    buyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productName = button.getAttribute('data-product');
            productNameDisplay.textContent = `(${productName})`;
            modal.style.display = 'block';
            updateModalStep(1);
        });
    });

    closeButton.addEventListener('click', closeQrisModal);
    btnCancelTransaction.addEventListener('click', closeQrisModal);


    // Langkah 1: Pilih E-Wallet
    eWalletSelect.addEventListener('change', () => {
        btnNextToUpload.disabled = !eWalletSelect.value;
    });

    btnNextToUpload.addEventListener('click', () => {
        updateModalStep(2);
    });

    // Langkah 2: Upload Bukti
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
        updateModalStep(1);
    });

    btnSendProof.addEventListener('click', () => {
        updateModalStep(3);
        
        // Simulasikan proses verifikasi (3 detik)
        setTimeout(() => {
            updateModalStep(4);
        }, 3000);
    });

    // Langkah 4: Selesai
    btnTransactionComplete.addEventListener('click', closeQrisModal);


    // ===========================================
    // BAGIAN C: LOGIKA MODAL CALL CENTER
    // ===========================================

    const ccModal = document.getElementById('call-center-modal');
    const openCcModalBtn = document.getElementById('open-call-center-modal');
    const closeCcModalBtn = document.getElementById('close-call-center-modal');
    const btnCancelCc = document.getElementById('btn-cancel-call-center');
    
    const ccStep1 = document.getElementById('call-center-modal-step-1');
    const ccStep2 = document.getElementById('call-center-modal-step-2');
    const ccStep3 = document.getElementById('call-center-modal-step-3');
    
    const ccIdInput = document.getElementById('call-center-id-input-cc');
    const btnSendIdCc = document.getElementById('btn-send-id-cc');
    const waAdminLinkCc = document.getElementById('wa-admin-link-cc');
    const simulatedProgressCc = document.getElementById('simulated-progress-cc');
    let ccProgressInterval;

    function closeCcModal() {
        ccModal.style.display = 'none';
        ccStep1.style.display = 'block';
        ccStep2.style.display = 'none';
        ccStep3.style.display = 'none';
        ccIdInput.value = '';
        btnSendIdCc.disabled = true;
        simulatedProgressCc.style.width = '0%';
        clearInterval(ccProgressInterval);
    }

    openCcModalBtn.addEventListener('click', () => {
        ccModal.style.display = 'block';
    });

    closeCcModalBtn.addEventListener('click', closeCcModal);
    btnCancelCc.addEventListener('click', closeCcModal);

    // Validasi input CC ID
    ccIdInput.addEventListener('input', () => {
        btnSendIdCc.disabled = ccIdInput.value.trim().length === 0;
    });

    // Step 1: Kirim ID/Subjek
    btnSendIdCc.addEventListener('click', () => {
        const callCenterID = ccIdInput.value.trim();
        if (callCenterID === '') return;

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