/* =========================
   LOVEFLIX — 1ST MENSIVERSARY
   TEICY 🤍 DARREL
========================= */


/* =========================
   CONFIG
========================= */

const CORRECT_PIN = "0506";

let heartsCollected = 0;
const totalHearts = 5;

let achievements = {
    login: false,
    letter: false,
    quiz: false,
    memory: false,
    hearts: false,
    secret: false
};

let completedAchievements = 0;

let matchedPairs = 0;
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let memoryCompleted = false;
let secretOpened = false;


/* =========================
   LOADING SCREEN
========================= */

window.addEventListener("load", () => {
    setTimeout(() => {
        const loadingScreen =
            document.getElementById("loadingScreen");

        const pinScreen =
            document.getElementById("pinScreen");

        if (loadingScreen) {
            loadingScreen.classList.add("hidden");
        }

        if (pinScreen) {
            pinScreen.classList.remove("hidden");
        }
    }, 2000);
});


/* =========================
   PIN LOGIN
========================= */

function checkPin() {
    const pinInput =
        document.getElementById("pinInput");

    const error =
        document.getElementById("pinError");

    const pinScreen =
        document.getElementById("pinScreen");

    const profileScreen =
        document.getElementById("profileScreen");

    if (!pinInput || !error) return;

    if (pinInput.value === CORRECT_PIN) {
        if (pinScreen) {
            pinScreen.classList.add("hidden");
        }

        if (profileScreen) {
            profileScreen.classList.remove("hidden");
        }

        error.textContent = "";

        unlockAchievement(
            "login",
            "🤍 First Login"
        );
    } else {
        error.textContent =
            "PIN-nya salah 😭 Coba lagi yaa, el!";

        pinInput.value = "";
        pinInput.focus();
    }
}


/* =========================
   ENTER LOVEFLIX
========================= */

function enterLoveflix() {
    const profileScreen =
        document.getElementById("profileScreen");

    const mainApp =
        document.getElementById("mainApp");

    if (profileScreen) {
        profileScreen.classList.add("hidden");
    }

    if (mainApp) {
        mainApp.classList.remove("hidden");
    }

    const music =
        document.getElementById("bgMusic");

    if (music) {
        music.volume = 0.7;

        music.play().catch(() => {
            // Musik dapat dimulai lewat tombol Play.
        });
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================
   PLAY OUR STORY
========================= */

function playStory() {
    const music =
        document.getElementById("bgMusic");

    if (music) {
        music.play().catch(() => {});
    }

    createConfetti();
    scrollToSection("continue");
}


/* =========================
   SCROLL HELPER
========================= */

function scrollToSection(id) {
    const section =
        document.getElementById(id);

    if (!section) return;

    section.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


/* =========================
   ACHIEVEMENT SYSTEM
========================= */

function unlockAchievement(key, title) {
    if (
        !Object.prototype.hasOwnProperty.call(
            achievements,
            key
        )
    ) {
        return;
    }

    if (achievements[key]) return;

    achievements[key] = true;
    completedAchievements++;

    showAchievementPopup(title);

    updateAchievementUI();
    updateProgress();
}


/* =========================
   ACHIEVEMENT UI
========================= */

function updateAchievementUI() {
    const achievementData = {
        login: {
            id: "ach1",
            text: "✅ First Login"
        },

        letter: {
            id: "ach2",
            text: "✅ Read Our Letter"
        },

        quiz: {
            id: "ach3",
            text: "✅ Couple Quiz Master"
        },

        memory: {
            id: "ach4",
            text: "✅ Memory Hunter"
        },

        hearts: {
            id: "ach5",
            text: "✅ Hidden Heart Finder"
        },

        secret: {
            id: "ach6",
            text: "✅ Secret Episode"
        }
    };

    Object.keys(achievementData).forEach(key => {
        const item = achievementData[key];

        const element =
            document.getElementById(item.id);

        if (!element) return;

        if (achievements[key]) {
            element.classList.add("done");
            element.textContent = item.text;
        }
    });
}


/* =========================
   ACHIEVEMENT POPUP
========================= */

function showAchievementPopup(title) {
    const popup =
        document.getElementById("achievementPopup");

    if (!popup) return;

    popup.textContent =
        "🏆 Achievement Unlocked! " + title;

    popup.classList.remove("show");

    void popup.offsetWidth;

    popup.classList.add("show");

    setTimeout(() => {
        popup.classList.remove("show");
    }, 2500);
}


/* =========================
   PROGRESS BAR
========================= */

function updateProgress() {
    const progress =
        document.getElementById("seasonProgress");

    const progressText =
        document.getElementById("progressText");

    const seasonBadge =
        document.getElementById("seasonBadge");

    const percent =
        (completedAchievements / 6) * 100;

    if (progress) {
        progress.style.width = percent + "%";
    }

    if (progressText) {
        progressText.textContent =
            completedAchievements +
            " / 6 Achievements Completed";
    }

    if (seasonBadge) {
        if (completedAchievements >= 6) {
            seasonBadge.textContent =
                "🏆 Our Story Completed 🤍";
        } else {
            seasonBadge.textContent =
                "🤍 " + completedAchievements +
                " of 6 Memories Unlocked";
        }
    }

    if (completedAchievements >= 6) {
        const popup =
            document.getElementById("seasonUnlocked");

        if (
            popup &&
            popup.classList.contains("hidden")
        ) {
            setTimeout(() => {
                if (completedAchievements >= 6) {
                    popup.classList.remove("hidden");
                }
            }, 800);
        }
    }
}


/* =========================
   LETTER DETECTION
========================= */

function checkLetterRead() {
    const letter =
        document.getElementById("letter");

    if (!letter) return;

    const rect =
        letter.getBoundingClientRect();

    const visible =
        rect.top < window.innerHeight * 0.75 &&
        rect.bottom > 100;

    if (visible) {
        unlockAchievement(
            "letter",
            "💌 Read Our Letter"
        );
    }
}

window.addEventListener(
    "scroll",
    checkLetterRead,
    { passive: true }
);


/* =========================
   HIDDEN HEARTS
========================= */

function collectHeart(element) {
    if (!element) return;

    if (element.classList.contains("found")) {
        return;
    }

    element.classList.add("found");

    element.style.opacity = "0.3";
    element.style.pointerEvents = "none";

    heartsCollected++;

    createConfetti();

    if (heartsCollected >= totalHearts) {
        unlockAchievement(
            "hearts",
            "🤍 Hidden Heart Finder"
        );

        const unlockBtn =
            document.getElementById("unlockBtn");

        if (unlockBtn) {
            unlockBtn.disabled = false;
            unlockBtn.classList.add("active");

            unlockBtn.textContent =
                "Unlock Secret Episode 🤍";
        }
    }
}


/* =========================
   SECRET EPISODE
========================= */

function openSecretEpisode() {
    if (heartsCollected < totalHearts) {
        return;
    }

    const secretContent =
        document.getElementById("secretContent");

    if (!secretContent) return;

    secretContent.classList.remove("hidden");

    if (!secretOpened) {
        secretOpened = true;

        unlockAchievement(
            "secret",
            "🎁 Secret Episode Unlocked"
        );

        createConfetti();
    }

    scrollToSection("secretEpisode");
}

document.addEventListener(
    "DOMContentLoaded",
    () => {
        const unlockBtn =
            document.getElementById("unlockBtn");

        if (unlockBtn) {
            unlockBtn.addEventListener(
                "click",
                openSecretEpisode
            );
        }
    }
);


/* =========================
   QUIZ SYSTEM
========================= */

function correctAnswer() {
    const result =
        document.getElementById("quizResult");

    if (!result) return;

    result.textContent =
        "IHH BENER BANGETT! DARREL TERUSSS 🤍👻";

    result.style.color = "#4ade80";

    unlockAchievement(
        "quiz",
        "🤍 Couple Quiz Master"
    );

    createConfetti();
}

function wrongAnswer() {
    const result =
        document.getElementById("quizResult");

    if (!result) return;

    result.textContent =
        "SALAHH 😭 MASA BUKAN DARREL SIH?";

    result.style.color = "#ff4d4d";
}


/* =========================
   CONFETTI EFFECT
========================= */

function createConfetti() {
    const container =
        document.getElementById("confettiContainer");

    if (!container) return;

    const icons = [
        "🤍",
        "👻",
        "🫰",
        "✨",
        "💌",
        "💕",
        "🥰"
    ];

    for (let i = 0; i < 25; i++) {
        const confetti =
            document.createElement("span");

        confetti.classList.add("confetti");

        confetti.textContent =
            icons[
                Math.floor(
                    Math.random() * icons.length
                )
            ];

        confetti.style.left =
            Math.random() * 100 + "%";

        confetti.style.animationDuration =
            (Math.random() * 2 + 2) + "s";

        confetti.style.animationDelay =
            Math.random() * 0.5 + "s";

        container.appendChild(confetti);

        setTimeout(() => {
            confetti.remove();
        }, 4500);
    }
}


/* =========================
   NEXT CHAPTER
========================= */

function renewSeason() {
    const renewMessage =
        document.getElementById("renewMessage");

    if (!renewMessage) return;

    renewMessage.textContent =
        "YEAYYY! More memories with you, Darrel. I'm glad it's you. I love you, my favorite headache! 👻🤍";

    createConfetti();
}


/* =========================
   CLOSE COMPLETION POPUP
========================= */

function closeSeasonUnlocked() {
    const popup =
        document.getElementById("seasonUnlocked");

    if (!popup) return;

    popup.classList.add("hidden");
}


/* =========================
   MEMORY MATCH GAME
========================= */

function resetMemoryBoard() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

function flipCard() {
    if (lockBoard || memoryCompleted) return;

    if (this === firstCard) return;

    if (this.classList.contains("matched")) {
        return;
    }

    this.classList.add("flip");

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;

    checkMemoryMatch();
}

function checkMemoryMatch() {
    const isMatch =
        firstCard.dataset.card ===
        secondCard.dataset.card;

    if (isMatch) {
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");

        firstCard.removeEventListener(
            "click",
            flipCard
        );

        secondCard.removeEventListener(
            "click",
            flipCard
        );

        matchedPairs++;

        resetMemoryBoard();

        const cards =
            document.querySelectorAll(".memory-card");

        const uniqueTypes = new Set(
            Array.from(cards).map(
                card => card.dataset.card
            )
        );

        if (matchedPairs >= uniqueTypes.size) {
            memoryCompleted = true;

            const result =
                document.getElementById("memoryResult");

            if (result) {
                result.textContent =
                    "YEAYYY! You matched all our little memories! 🤍🎉";
            }

            unlockAchievement(
                "memory",
                "🧩 Memory Hunter"
            );

            createConfetti();
        }
    } else {
        lockBoard = true;

        setTimeout(() => {
            if (firstCard) {
                firstCard.classList.remove("flip");
            }

            if (secondCard) {
                secondCard.classList.remove("flip");
            }

            resetMemoryBoard();
        }, 900);
    }
}


/* =========================
   SHUFFLE MEMORY CARDS
========================= */

function shuffleMemoryCards() {
    const grid =
        document.querySelector(".memory-grid");

    if (!grid) return;

    const cards =
        Array.from(
            grid.querySelectorAll(".memory-card")
        );

    // Reset the game state.
    matchedPairs = 0;
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    memoryCompleted = false;

    cards.forEach(card => {
        card.classList.remove(
            "flip",
            "matched"
        );

        card.style.order =
            Math.floor(Math.random() * cards.length);

        // Avoid adding the same listener repeatedly.
        card.removeEventListener("click", flipCard);
        card.addEventListener("click", flipCard);
    });

    const result =
        document.getElementById("memoryResult");

    if (result) {
        result.textContent = "";
    }
}


/* =========================
   ENTRANCE ANIMATION
========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {
        const sections =
            document.querySelectorAll(".section");

        if (!("IntersectionObserver" in window)) {
            sections.forEach(section => {
                section.style.opacity = "1";
                section.style.transform = "translateY(0)";
            });

            return;
        }

        const observer =
            new IntersectionObserver(
                entries => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.style.opacity = "1";

                            entry.target.style.transform =
                                "translateY(0)";

                            observer.unobserve(entry.target);
                        }
                    });
                },
                {
                    threshold: 0.08
                }
            );

        sections.forEach(section => {
            section.style.opacity = "0";

            section.style.transform =
                "translateY(35px)";

            section.style.transition =
                "opacity 0.8s ease, transform 0.8s ease";

            observer.observe(section);
        });
    }
);


/* =========================
   HERO TITLE ANIMATION
========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {
        const heroTitle =
            document.querySelector(".hero-content h1");

        if (!heroTitle) return;

        heroTitle.style.transition =
            "transform 0.6s ease";

        setInterval(() => {
            heroTitle.style.transform =
                "translateY(-3px)";

            setTimeout(() => {
                heroTitle.style.transform =
                    "translateY(0)";
            }, 600);
        }, 2500);
    }
);


/* =========================
   ENTER KEY FOR PIN
========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {
        const pinInput =
            document.getElementById("pinInput");

        if (!pinInput) return;

        pinInput.addEventListener(
            "keydown",
            event => {
                if (event.key === "Enter") {
                    checkPin();
                }
            }
        );
    }
);


/* =========================
   INITIALIZATION
========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {
        updateAchievementUI();
        updateProgress();
        shuffleMemoryCards();
    }
);


/* =========================
   INITIAL CONFETTI
========================= */

window.addEventListener("load", () => {
    setTimeout(() => {
        createConfetti();
    }, 3500);
});


/* =========================
   END
   LOVEFLIX — OUR STORY
   TEICY 🤍 DARREL
========================= */
