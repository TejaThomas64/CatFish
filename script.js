
let currentPage = 1;
let selectedAvatar = null;
let expandedCard = null;
let touchStartX = 0;
let touchEndX = 0;
let currentMatchIndex = 0;
let userProfile = null;
let isMobile = window.innerWidth <= 768;
let currentMobileCardIndex = 0;
let mobileCards = [];



const sampleMatches = [
    {
        name: "Whiskers",
        species: "Cat",
        hobbies: "Laser chase, naps, knocking things off tables",
        lookingFor: "A lazy goldfish to vibe with",
        message: "Let's knock stuff off the table together!",
        avatar: "cat3.jpg"
    },
    {
        name: "Bubbles",
        species: "Fish",
        hobbies: "Swimming in circles, blowing bubbles, hiding in castles",
        lookingFor: "A dog who won't bark at me",
        message: "Don't tap on my glass, tap on my heart.",
        avatar: "fish.jpg"
    },
    {
        name: "Rover",
        species: "Dog",
        hobbies: "Belly rubs, barking at mailmen, playing fetch",
        lookingFor: "Someone who appreciates a good game of fetch",
        message: "Will you throw my heart like a ball?",
        avatar: "dog4.jpg"
    },
    {
        name: "Princess Mittens",
        species: "Cat",
        hobbies: "Scratching couches, posing for photos, ignoring humans",
        lookingFor: "Someone worthy of my royal attention",
        message: "Bow to me... or swipe right!",
        avatar: "cat5.jpg"
    },
    {
        name: "Captain grab",
        species: "Koala",
        hobbies: "sleeping in trees, eating eucalyptus, climbing",
        lookingFor: "An adventurous soul to explore the tank with",
        message: "Dive deep into love with me",
        avatar: "koala.jpg"
    },
    {
        name: "Goldie",
        species: "Dog",
        hobbies: "Paw shakes, swimming, chasing my tail",
        lookingFor: "Someone to splash around with at the beach",
        message: "I'll fetch your heart in no time!",
        avatar: "https://placedog.net/301/301"
    }
];

// Check for mobile on resize
window.addEventListener('resize', function () {
    isMobile = window.innerWidth <= 768;
});

document.addEventListener('DOMContentLoaded', function () {
    // Avatar selection
    const avatarOptions = document.querySelectorAll('.avatar-option');
    avatarOptions.forEach(avatar => {
        avatar.addEventListener('click', function (e) {
            e.stopPropagation();
            avatarOptions.forEach(a => a.classList.remove('selected'));
            this.classList.add('selected');
            selectedAvatar = this.src;
        });
    });

    // Find matches button
    const findMatchesBtn = document.getElementById('findMatchesBtn');
    findMatchesBtn.addEventListener('click', submitProfile);

    // Chat button
    const chatBtn = document.getElementById('chatBtn');
    chatBtn.addEventListener('click', function () {
        alert('Chat feature coming soon!');
        document.getElementById('matchScreen').classList.remove('active');
        document.getElementById('overlay').classList.remove('active');
    });

    // Form submission
    const profileForm = document.getElementById('profileForm');
    profileForm.addEventListener('submit', function (e) {
        e.preventDefault();
        submitProfile();
    });
});

function goToPage(pageNumber) {
    const currentPageEl = document.getElementById(`page${currentPage}`);
    const nextPageEl = document.getElementById(`page${pageNumber}`);

    currentPageEl.classList.remove('active');

    setTimeout(() => {
        nextPageEl.classList.add('active');
        if (pageNumber === 3) {
            loadMatches();
        }
    }, 50);

    currentPage = pageNumber;
}

function submitProfile() {
    if (!selectedAvatar) {
        alert('Please select an avatar!');
        return;
    }

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'age', 'gender', 'hobbies', 'lookingFor'];
    for (const field of requiredFields) {
        const value = document.getElementById(field).value.trim();
        if (!value) {
            alert(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field`);
            return;
        }
    }

    userProfile = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        age: document.getElementById('age').value,
        gender: document.getElementById('gender').value,
        hobbies: document.getElementById('hobbies').value,
        lookingFor: document.getElementById('lookingFor').value,
        avatar: selectedAvatar,
        species: document.getElementById('species').value
    };

    console.log('Profile submitted:', userProfile);
    goToPage(3);
}

function loadMatches() {
    const loader = document.getElementById('loader');
    loader.style.display = 'block';

    // Simulate loading delay
    setTimeout(() => {
        loader.style.display = 'none';

        if (isMobile) {
            loadMobileMatches();
        } else {
            loadDesktopMatches();
        }
    }, 1000);
}

function loadMobileMatches() {
    const container = document.getElementById('mobileMatchesContainer');
    container.innerHTML = '';
    mobileCards = [];

    sampleMatches.forEach((match, index) => {
        const card = document.createElement('div');
        card.className = 'mobile-match-card';
        card.dataset.index = index;
        card.innerHTML = `
                    <img src="${match.avatar}" class="match-avatar" />
                    <h3 class="match-name">${match.name} the ${match.species}</h3>
                    <p class="match-hobbies"><strong>Hobbies:</strong> ${match.hobbies}</p>
                    <p class="match-looking"><strong>Looking For:</strong> ${match.lookingFor}</p>
                    <p class="match-looking"><strong>Message:</strong> ${match.message}</p>
                    <div class="action-buttons">
                        <button class="dislike-btn" onclick="handleMobileDislike(this.parentElement.parentElement)"><i class="fas fa-times"></i></button>
                        <button class="like-btn" onclick="handleMobileLike(this.parentElement.parentElement, ${index})"><i class="fas fa-check"></i></button>
                    </div>
                `;

        // Touch events for swipe
        card.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);

        card.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touchX = e.changedTouches[0].screenX;
            const deltaX = touchX - touchStartX;
            card.style.transform = `translateX(${deltaX}px) translateX(-50%) rotate(${deltaX * 0.1}deg)`;
        }, false);

        card.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleMobileSwipe(card);
        }, false);

        container.appendChild(card);
        mobileCards.push(card);
    });

    // Show first card
    if (mobileCards.length > 0) {
        mobileCards[0].classList.add('active');
        currentMobileCardIndex = 0;
    }
}

function loadDesktopMatches() {
    const container = document.getElementById('desktopMatchesContainer');
    const overlay = document.getElementById('overlay');
    container.innerHTML = '';

    sampleMatches.forEach((match, index) => {
        const card = document.createElement('div');
        card.className = 'desktop-match-card';
        card.innerHTML = `
                    <img src="${match.avatar}" class="match-avatar" />
                    <h3 class="match-name">${match.name} the ${match.species}</h3>
                    <p class="match-hobbies"><strong>Hobbies:</strong> ${match.hobbies}</p>
                    <p class="match-looking"><strong>Looking For:</strong> ${match.lookingFor}</p>
                    <p class="match-looking"><strong>Message:</strong> ${match.message}</p>
                    <div class="action-buttons">
                        <button class="dislike-btn" onclick="handleDesktopDislike(this.parentElement.parentElement)"><i class="fas fa-times"></i></button>
                        <button class="like-btn" onclick="handleDesktopLike(this.parentElement.parentElement, ${index})"><i class="fas fa-check"></i></button>
                    </div>
                `;

        // Click to expand
        card.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'I') return;

            if (expandedCard) {
                expandedCard.classList.remove('expanded');
                overlay.classList.remove('active');
            }

            if (!card.classList.contains('expanded')) {
                card.classList.add('expanded');
                overlay.classList.add('active');
                expandedCard = card;
                currentMatchIndex = index;
            } else {
                expandedCard = null;
            }
        });

        container.appendChild(card);
    });

    // Close expanded card when clicking overlay
    overlay.addEventListener('click', () => {
        if (expandedCard) {
            expandedCard.classList.remove('expanded');
            overlay.classList.remove('active');
            expandedCard = null;
        }
    });
}

// Mobile card handlers
function handleMobileLike(card, index) {
    event.stopPropagation();
    card.classList.add('swipe-right');

    setTimeout(() => {
        card.remove();
        checkForMobileMatch(index);
        showNextMobileCard();
    }, 300);
}

function handleMobileDislike(card) {
    event.stopPropagation();
    card.classList.add('swipe-left');
    setTimeout(() => {
        card.remove();
        showNextMobileCard();
    }, 300);
}

function handleMobileSwipe(card) {
    const swipeThreshold = 50;
    const swipeDistance = touchEndX - touchStartX;

    if (Math.abs(swipeDistance) < swipeThreshold) {
        card.style.transform = 'translateX(-50%)';
        return;
    }

    if (swipeDistance > 0) {
        card.classList.add('swipe-right');
        setTimeout(() => {
            card.remove();
            checkForMobileMatch(parseInt(card.dataset.index));
            showNextMobileCard();
        }, 300);
    } else {
        card.classList.add('swipe-left');
        setTimeout(() => {
            card.remove();
            showNextMobileCard();
        }, 300);
    }
}

function showNextMobileCard() {
    currentMobileCardIndex++;
    if (currentMobileCardIndex < mobileCards.length) {
        mobileCards[currentMobileCardIndex].classList.add('active');
    } else {
        // No more cards
        document.getElementById('mobileMatchesContainer').innerHTML =
            '<p style="text-align: center; color: #00796b; font-size: 1.2rem;">No more matches right now. Check back later!</p>';
    }
}

// Desktop card handlers
function handleDesktopLike(card, index) {
    event.stopPropagation();
    card.classList.add('swipe-right');

    setTimeout(() => {
        card.remove();
        checkForMatch(index);
    }, 300);
}

function handleDesktopDislike(card) {
    event.stopPropagation();
    card.classList.add('swipe-left');
    setTimeout(() => {
        card.remove();
    }, 300);
}

function showMatchScreen(match) {
    const matchScreen = document.getElementById('matchScreen');
    const overlay = document.getElementById('overlay');

    // Set user avatar
    document.getElementById('userAvatar').src = userProfile.avatar;
    // Set matched avatar and name
    document.getElementById('matchedAvatar').src = match.avatar;
    document.getElementById('matchedName').textContent = match.name;

    // Show the match screen
    overlay.classList.add('active');
    matchScreen.classList.add('active');
}

function checkForMatch(index) {
    const isMatch = Math.random() < 0.7;

    if (isMatch) {
        setTimeout(() => {
            showMatchScreen(sampleMatches[index]);
        }, 350);
    }
}

function checkForMobileMatch(index) {
    const isMatch = Math.random() < 0.7;

    if (isMatch) {
        setTimeout(() => {
            showMatchScreen(sampleMatches[index]);
        }, 350);
    }
}


function gotochat() {
    sessionStorage.setItem("currentPage", currentPage);
    sessionStorage.setItem("userProfile", JSON.stringify(userProfile));
    
    const matchedPet = sampleMatches[currentMatchIndex];
    sessionStorage.setItem("matchedPet", JSON.stringify(matchedPet)); // Store entire object
    
    window.location.href = "new.html";
}