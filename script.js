// ================================================
// LOVEFLIX — TEICY × DARREL
// EPISODE 01: I'M GLAD IT'S YOU
// ================================================


// ================================================
// CONFIGURATION
// ================================================

const CORRECT_PIN = "0506";
const TOTAL_HEARTS = 5;
const TOTAL_ACHIEVEMENTS = 6;

let heartsCollected = 0;
let completedAchievements = 0;
let matchedPairs = 0;
let moves = 0;

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let quizCompleted = false;
let letterUnlocked = false;
let completionPopupShown = false;
let popupTimeout = null;
let toastTimeout = null;

const achievements = {
    login: false,
    letter: false,
    quiz: false,
    memory: false,
    hearts: false,
    secret: false
};


// ================================================
// DOM ELEMENTS
// ================================================

const loadingScreen = document.getElementById("loadingScreen");
const pinScreen = document.getElementById("pinScreen");
const profileScreen = document.getElementById("profileScreen");
const mainApp = document.getElementById("mainApp");

const pinInput = document.getElementById("pinInput");
const pinError = document.getElementById("pinError");
const pinForm = document.getElementById("pinForm");

const bgMusic = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
const musicIcon = document.getElementById("musicIcon");
const musicLabel = document.getElementById("musicLabel");

const achievementPopup = document.getElementById("achievementPopup");
const popupIcon = document.getElementById("popupIcon");
const popupTitle = document.getElementById("popupTitle");
const popupDescription = document.getElementById("popupDescription");

const openSecretBtn = document.getElementById("openSecretBtn");
const secretContent = document.getElementById("secretContent");
const seasonUnlocked = document.getElementById("seasonUnlocked");

const heartToast = document.getElementById("heartToast");


// ================================================
// LOADING SCREEN
// ================================================

window.addEventListener("load", () => {
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.classList.add("fade-out");

            setTimeout(() => {
                loadingScreen.classList.add("hidden");
            }, 750);
        }

        if (pinScreen) {
            pinScreen.classList.remove("hidden");
        }

        if (pinInput) {
            pinInput.focus();
        }
    }, 1800);
});


// ================================================
// PIN LOGIN
// ================================================

if (pinForm) {
    pinForm.addEventListener("submit", function (event) {
        event.preventDefault();
        checkPin();
    });
}

function checkPin() {
    const enteredPin = pinInput.value.trim();

    if (enteredPin === CORRECT_PIN) {
        pinError.textContent = "";
        pinInput.blur();

        unlockAchievement(
            "login",
            "Welcome Home",
            "Darrel berhasil membuka cerita kalian!",
            "🔓"
        );

        pinScreen.classList.add("hidden");
        profileScreen.classList.remove("hidden");

        createConfetti(25);

    } else {
        pinError.textContent = "Hmm, PIN-nya belum tepat, sayang. Coba lagi ya ♡";

        pinInput.value = "";
        pinInput.focus();

        const pinCard = document.querySelector(".pin-card");

        if (pinCard) {
            pinCard.classList.remove("shake");

            // Memulai ulang animasi shake.
            void pinCard.offsetWidth;

            pinCard.classList.add("shake");
        }
    }
}


// ================================================
// ENTER LOVEFLIX
// ================================================

async function enterLoveflix() {
    profileScreen.classList.add("hidden");
    mainApp.classList.remove("hidden");

    window.scrollTo({
        top: 0,
        behavior: "instant"
    });

    document.body.classList.remove("no-scroll");

    // Browser mungkin memerlukan interaksi pengguna
    // sebelum musik dapat diputar.
    if (bgMusic) {
        try {
            await bgMusic.play();
            updateMusicButton(true);
        } catch (error) {
            updateMusicButton(false);
            showHeartToast("Tap tombol Music On untuk memutar lagu ♡");
        }
    }

    setTimeout(() => {
        createConfetti(35);
    }, 500);

    updateAchievementUI();
    updateProgress();

    setTimeout(checkLetterRead, 500);
}


// ================================================
// MUSIC CONTROLS
// ================================================

if (musicBtn) {
    musicBtn.addEventListener("click", toggleMusic);
}

async function toggleMusic() {
    if (!bgMusic) return;

    if (bgMusic.paused) {
        try {
            await bgMusic.play();
            updateMusicButton(true);
        } catch (error) {
            showHeartToast("Lagu belum bisa diputar. Coba tekan lagi ya ♡");
            updateMusicButton(false);
        }
    } else {
        bgMusic.pause();
        updateMusicButton(false);
    }
}

function updateMusicButton(isPlaying) {
    if (!musicBtn) return;

    musicBtn.classList.toggle("playing", isPlaying);

    if (musicIcon) {
        musicIcon.textContent = isPlaying ? "♫" : "♪";
    }

    if (musicLabel) {
        musicLabel.textContent = isPlaying ? "Music On" : "Music Off";
    }
}


// ================================================
// NAVIGATION
// ================================================

function playStory() {
    scrollToSection("continue");
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);

    if (!section) return;

    section.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


// ================================================
// ACHIEVEMENT SYSTEM
// ================================================

const achievementDetails = {
    login: {
        id: "ach1",
        title: "Welcome Home",
        description: "You unlocked your private love story.",
        icon: "🔓"
    },

    letter: {
        id: "ach2",
        title: "Words From Teicy",
        description: "You took the time to read Teicy's letter.",
        icon: "💌"
    },

    quiz: {
        id: "ach3",
        title: "Love Expert",
        description: "You know who made this little website!",
        icon: "💘"
    },

    memory: {
        id: "ach4",
        title: "Memory Keeper",
        description: "You matched all the memory cards.",
        icon: "🧩"
    },

    hearts: {
        id: "ach5",
        title: "Heart Collector",
        description: "You found all five hidden hearts.",
        icon: "💗"
    },

    secret: {
        id: "ach6",
        title: "Secret Episode",
        description: "You discovered the secret message.",
        icon: "🔐"
    }
};

function unlockAchievement(key, title, description, icon) {
    if (!Object.prototype.hasOwnProperty.call(achievements, key)) {
        return;
    }

    // Jangan hitung achievement yang sama dua kali.
    if (achievements[key]) {
        return;
    }

    achievements[key] = true;
    completedAchievements++;

    updateAchievementUI();
    updateProgress();

    const detail = achievementDetails[key];

    showAchievementPopup(
        title || detail.title,
        description || detail.description,
        icon || detail.icon
    );

    createConfetti(16);

    if (completedAchievements === TOTAL_ACHIEVEMENTS) {
        setTimeout(() => {
            if (!completionPopupShown) {
                completionPopupShown = true;
                showSeasonUnlocked();
            }
        }, 1300);
    }
}


// ================================================
// UPDATE ACHIEVEMENT CARDS
// ================================================

function updateAchievementUI() {
    Object.keys(achievements).forEach((key) => {
        const detail = achievementDetails[key];
        const card = document.getElementById(detail.id);

        if (!card) return;

        const status = card.querySelector(".achievement-status");

        if (achievements[key]) {
            card.classList.add("unlocked");

            if (status) {
                status.textContent = "UNLOCKED";
            }
        } else {
            card.classList.remove("unlocked");

            if (status) {
                status.textContent = "LOCKED";
            }
        }
    });
}


// ================================================
// PROGRESS BAR
// ================================================

function updateProgress() {
    const completedCount = document.getElementById("completedCount");
    const progressPercent = document.getElementById("progressPercent");
    const progressBar = document.getElementById("progressBar");
    const progressMessage = document.getElementById("progressMessage");

    const percent = Math.round(
        (completedAchievements / TOTAL_ACHIEVEMENTS) * 100
    );

    if (completedCount) {
        completedCount.textContent = completedAchievements;
    }

    if (progressPercent) {
        progressPercent.textContent = percent + "%";
    }

    if (progressBar) {
        progressBar.style.width = percent + "%";
    }

    if (progressMessage) {
        if (percent === 0) {
            progressMessage.textContent =
                "Your story is just getting started. ♡";
        } else if (percent < 35) {
            progressMessage.textContent =
                "You're discovering the little things. Keep going! ♡";
        } else if (percent < 70) {
            progressMessage.textContent =
                "You're getting closer to the secret episode!";
        } else if (percent < 100) {
            progressMessage.textContent =
                "Almost there, Darrel. Just a little more love to discover.";
        } else {
            progressMessage.textContent =
                "All missions completed! You found every little surprise. ♥";
        }
    }
}


// ================================================
// ACHIEVEMENT POPUP
// ================================================

function showAchievementPopup(title, description, icon) {
    if (!achievementPopup) return;

    popupTitle.textContent = title;
    popupDescription.textContent = description;
    popupIcon.textContent = icon;

    achievementPopup.classList.add("show");

    clearTimeout(popupTimeout);

    popupTimeout = setTimeout(() => {
        hideAchievementPopup();
    }, 4500);
}

function hideAchievementPopup() {
    if (!achievementPopup) return;

    achievementPopup.classList.remove("show");
    clearTimeout(popupTimeout);
}


// ================================================
// LETTER ACHIEVEMENT
// ================================================

function checkLetterRead() {
    if (letterUnlocked) return;

    const letter = document.getElementById("loveLetter");

    if (!letter || mainApp.classList.contains("hidden")) {
        return;
    }

    const rect = letter.getBoundingClientRect();
    const visibleHeight = Math.min(rect.bottom, window.innerHeight) -
                          Math.max(rect.top, 0);

    const visibleRatio = rect.height > 0
        ? visibleHeight / rect.height
        : 0;

    // Surat harus benar-benar terlihat sebelum dihitung.
    if (visibleRatio >= 0.55 || (
        rect.top >= 0 &&
        rect.bottom <= window.innerHeight
    )) {
        letterUnlocked = true;

        unlockAchievement(
            "letter",
            "Words From Teicy",
            "You took the time to read the letter. That's sweet! ♡",
            "💌"
        );
    }
}

window.addEventListener("scroll", checkLetterRead, {
    passive: true
});

window.addEventListener("resize", checkLetterRead);


// ================================================
// HIDDEN HEART COLLECTION
// ================================================

function collectHeart(element) {
    if (!element || element.classList.contains("collected")) {
        return;
    }

    element.classList.add("collected");
    element.textContent = "♥";
    element.setAttribute("aria-label", "Hati sudah ditemukan");

    heartsCollected = Math.min(heartsCollected + 1, TOTAL_HEARTS);

    showHeartToast(
        `♡ You found a hidden heart! (${heartsCollected}/${TOTAL_HEARTS})`
    );

    createFloatingHeart(element);

    if (heartsCollected === TOTAL_HEARTS) {
        unlockAchievement(
            "hearts",
            "Heart Collector",
            "Darrel found all five hidden hearts!",
            "💗"
        );

        unlockSecretButton();
        createConfetti(50);
    }
}


// ================================================
// HEART COLLECTION EFFECT
// ================================================

function createFloatingHeart(element) {
    const rect = element.getBoundingClientRect();
    const heart = document.createElement("div");

    heart.textContent = "♥";

    heart.style.position = "fixed";
    heart.style.left = rect.left + rect.width / 2 + "px";
    heart.style.top = rect.top + "px";
    heart.style.zIndex = "2500";
    heart.style.color = "#ff456d";
    heart.style.fontSize = "26px";
    heart.style.pointerEvents = "none";
    heart.style.transition = "all 1s ease";

    document.body.appendChild(heart);

    requestAnimationFrame(() => {
        heart.style.transform = "translateY(-70px) scale(1.5)";
        heart.style.opacity = "0";
    });

    setTimeout(() => {
        heart.remove();
    }, 1100);
}

function showHeartToast(message) {
    if (!heartToast) return;

    heartToast.textContent = message;
    heartToast.classList.add("show");

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() => {
        heartToast.classList.remove("show");
    }, 2500);
}


// ================================================
// SECRET EPISODE
// ================================================

function unlockSecretButton() {
    if (!openSecretBtn) return;

    openSecretBtn.disabled = false;
    openSecretBtn.textContent = "Unlock Secret Episode ♥";

    const lockIcon = document.getElementById("secretLockIcon");

    if (lockIcon) {
        lockIcon.textContent = "🔓";
    }

    const secretCard = document.querySelector(".secret-episode-card");

    if (secretCard) {
        secretCard.style.borderColor = "rgba(255, 158, 175, .45)";
    }
}

function openSecretEpisode() {
    if (heartsCollected < TOTAL_HEARTS) {
        showHeartToast("Find all five hearts first, sayang ♡");
        return;
    }

    if (!secretContent) return;

    secretContent.classList.remove("hidden");

    unlockAchievement(
        "secret",
        "Secret Episode",
        "You found the special message made just for you.",
        "🔐"
    );

    setTimeout(() => {
        secretContent.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }, 150);

    createConfetti(45);
}

function closeSeasonUnlocked() {
    if (seasonUnlocked) {
        seasonUnlocked.classList.add("hidden");
    }

    if (secretContent && !secretContent.classList.contains("hidden")) {
        secretContent.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }
}

function showSeasonUnlocked() {
    if (!seasonUnlocked) return;

    seasonUnlocked.classList.remove("hidden");
    createConfetti(75);
}


// ================================================
// QUIZ
// ================================================

function correctAnswer(button) {
    if (quizCompleted) return;

    quizCompleted = true;

    const options = document.querySelectorAll(".quiz-option");
    const feedback = document.getElementById("quizFeedback");

    options.forEach((option) => {
        option.disabled = true;
    });

    button.classList.add("correct");

    if (feedback) {
        feedback.textContent =
            "Correct, sayang! It's Teicy, your favorite headache. WKWKWK ♡";
    }

    unlockAchievement(
        "quiz",
        "Love Expert",
        "Darrel knows exactly who made this website!",
        "💘"
    );

    createConfetti(25);
}

function wrongAnswer(button) {
    if (quizCompleted) return;

    button.classList.add("wrong");

    const feedback = document.getElementById("quizFeedback");

    if (feedback) {
        feedback.textContent =
            "WKWKWK bukan itu, sayang. Coba pilih jawaban lain! 😭";
    }

    setTimeout(() => {
        button.classList.remove("wrong");
    }, 900);
}


// ================================================
// MEMORY MATCH GAME
// ================================================

const memoryBoard = document.getElementById("memoryGameBoard");

function shuffleMemoryCards() {
    if (!memoryBoard) return;

    const cards = Array.from(
        memoryBoard.querySelectorAll(".memory-card")
    );

    // Fisher-Yates shuffle.
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    cards.forEach((card) => {
        memoryBoard.appendChild(card);
    });
}

function setupMemoryGame() {
    if (!memoryBoard) return;

    const cards = memoryBoard.querySelectorAll(".memory-card");

    cards.forEach((card) => {
        card.addEventListener("click", function () {
            flipMemoryCard(this);
        });
    });

    shuffleMemoryCards();
}

function flipMemoryCard(card) {
    if (lockBoard) return;
    if (card.classList.contains("flipped")) return;
    if (card.classList.contains("matched")) return;

    card.classList.add("flipped");

    if (!firstCard) {
        firstCard = card;
        return;
    }

    secondCard = card;
    moves++;

    updateMovesCount();
    checkMemoryMatch();
}

function checkMemoryMatch() {
    if (!firstCard || !secondCard) return;

    const isMatch =
        firstCard.dataset.card === secondCard.dataset.card;

    if (isMatch) {
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");

        matchedPairs++;

        resetTurn();

        if (matchedPairs === 3) {
            finishMemoryGame();
        }

    } else {
        lockBoard = true;

        setTimeout(() => {
            if (firstCard) {
                firstCard.classList.remove("flipped");
            }

            if (secondCard) {
                secondCard.classList.remove("flipped");
            }

            resetTurn();
        }, 850);
    }
}

function resetTurn() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

function updateMovesCount() {
    const movesCount = document.getElementById("movesCount");

    if (movesCount) {
        movesCount.textContent = moves;
    }
}

function finishMemoryGame() {
    const gameMessage = document.getElementById("gameMessage");

    if (gameMessage) {
        gameMessage.textContent =
            `You matched all the memories in ${moves} moves! Proud of you, Darrel. ♡`;
    }

    unlockAchievement(
        "memory",
        "Memory Keeper",
        "Darrel matched every pair in the memory game!",
        "🧩"
    );

    createConfetti(35);
}

function resetMemoryGame() {
    if (!memoryBoard) return;

    matchedPairs = 0;
    moves = 0;
    firstCard = null;
    secondCard = null;
    lockBoard = false;

    const cards = memoryBoard.querySelectorAll(".memory-card");

    cards.forEach((card) => {
        card.classList.remove("flipped", "matched");
    });

    updateMovesCount();

    const gameMessage = document.getElementById("gameMessage");

    if (gameMessage) {
        gameMessage.textContent =
            "Take your time, sayang. You can do it! ♡";
    }

    shuffleMemoryCards();
}


// ================================================
// PHOTO GALLERY LIGHTBOX
// ================================================

function openPhoto(button) {
    if (!button) return;

    const photoPath = button.dataset.full;
    const lightbox = document.getElementById("photoLightbox");
    const lightboxImage = document.getElementById("lightboxImage");

    if (!lightbox || !lightboxImage || !photoPath) return;

    lightboxImage.src = photoPath;
    lightbox.classList.remove("hidden");

    document.body.classList.add("no-scroll");
}

function closePhoto(event, forceClose = false) {
    const lightbox = document.getElementById("photoLightbox");

    if (!lightbox) return;

    // Klik foto tidak menutup lightbox.
    if (!forceClose && event && event.target.id !== "photoLightbox") {
        return;
    }

    lightbox.classList.add("hidden");
    document.body.classList.remove("no-scroll");
}


// ================================================
// CONFETTI EFFECT
// ================================================

function createConfetti(amount = 25) {
    const symbols = ["♥", "✦", "♡", "✧"];
    const colors = [
        "#e50935",
        "#ff6d8c",
        "#ffb3c1",
        "#e5bd83",
        "#ffffff"
    ];

    for (let i = 0; i < amount; i++) {
        const piece = document.createElement("div");

        piece.className = "confetti-piece";
        piece.textContent =
            symbols[Math.floor(Math.random() * symbols.length)];

        piece.style.left = Math.random() * 100 + "vw";
        piece.style.color =
            colors[Math.floor(Math.random() * colors.length)];

        piece.style.fontSize =
            (10 + Math.random() * 13) + "px";

        piece.style.animationDuration =
            (2.4 + Math.random() * 2.6) + "s";

        piece.style.animationDelay =
            (Math.random() * .5) + "s";

        piece.style.setProperty(
            "--drift",
            (Math.random() * 180 - 90) + "px"
        );

        document.body.appendChild(piece);

        setTimeout(() => {
            piece.remove();
        }, 6000);
    }
}


// ================================================
// ENTRANCE ANIMATIONS
// ================================================

function setupEntranceAnimations() {
    const elements = document.querySelectorAll(
        ".section-heading, .continue-card, .letter-card, " +
        ".memory-feature, .gallery-photo, .quiz-card, " +
        ".achievement-card, .achievement-progress-card, " +
        ".secret-episode-card"
    );

    if (!("IntersectionObserver" in window)) {
        elements.forEach((element) => {
            element.style.opacity = "1";
        });

        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08
    });

    elements.forEach((element) => {
        element.classList.add("reveal-on-scroll");
        observer.observe(element);
    });
}


// ================================================
// DYNAMIC SCROLL ANIMATION STYLE
// ================================================

const revealStyle = document.createElement("style");

revealStyle.textContent = `
    .reveal-on-scroll {
        opacity: 0;
        transform: translateY(20px);
        transition:
            opacity .65s ease,
            transform .65s ease;
    }

    .reveal-on-scroll.visible {
        opacity: 1;
        transform: translateY(0);
    }
`;

document.head.appendChild(revealStyle);


// ================================================
// KEYBOARD CONTROLS
// ================================================

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        const lightbox = document.getElementById("photoLightbox");

        if (lightbox && !lightbox.classList.contains("hidden")) {
            lightbox.classList.add("hidden");
            document.body.classList.remove("no-scroll");
        }

        if (seasonUnlocked && !seasonUnlocked.classList.contains("hidden")) {
            closeSeasonUnlocked();
        }

        hideAchievementPopup();
    }
});


// ================================================
// INITIALIZATION
// ================================================

document.addEventListener("DOMContentLoaded", function () {
    updateAchievementUI();
    updateProgress();
    setupMemoryGame();
    setupEntranceAnimations();

    // Pastikan secret episode tetap terkunci
    // sampai semua hati ditemukan.
    if (openSecretBtn) {
        openSecretBtn.disabled = true;
    }

    if (secretContent) {
        secretContent.classList.add("hidden");
    }

    if (seasonUnlocked) {
        seasonUnlocked.classList.add("hidden");
    }

    if (achievementPopup) {
        achievementPopup.classList.remove("show");
    }

    if (bgMusic) {
        bgMusic.volume = 0.65;
    }

    console.log(
        "LOVEFLIX Teicy × Darrel is ready. Made with love. ♥"
    );
});
