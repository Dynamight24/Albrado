// CustomEase configuration
CustomEase.create("cubic", "0.83, 0, 0.17, 1");

// State variables
let isAnimating = false;
let isExpanded = false;
let currentCard = null;

// Function to split text into spans for animation
function splitTextIntoSpans(selector) {
  let elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    let text = element.innerText;
    let splitText = text
      .split("")
      .map(function (char) {
        return `<span>${char === " " ? "&nbsp;&nbsp;" : char}</span>`;
      })
      .join("");

    element.innerHTML = splitText;
  });
}

// Function to initialize card positions
function initializeCards() {
  let cards = Array.from(document.querySelectorAll(".card"));
  gsap.to(cards, {
    y: (i) => -15 + 15 * i + "%",
    z: (i) => 15 * i,
    ease: "cubic",
    stagger: -0.1,
  });
}

// Function to handle card click event and expand
function handleCardClick(event) {
  const card = event.currentTarget;
  if (!isExpanded) {
    scaleCardToFullScreen(card);
  }
}

// Function to scale card to full screen
function scaleCardToFullScreen(card) {
  isExpanded = true;
  currentCard = card;
  card.classList.add("card-expanded");

  // Hide the navbar
  document.querySelector("nav").style.display = "none";

  // Create and add the back button within the card
  let backButton = document.createElement("button");
  backButton.className = "back-button";
  backButton.innerText = "Back";
  card.appendChild(backButton); // Append the button to the card

  // Add event listener to the back button using event delegation
  card.addEventListener("click", handleBackButtonClick);

  gsap.to(card, {
    duration: 0.3,
    x: 0,
    y: 0,
    width: "100%",
    height: "100%",
    ease: "power2.out",
  });
}

// Function to handle click event on the back button
function handleBackButtonClick(event) {
  const backButton = event.target;
  if (backButton.classList.contains("back-button")) {
    shrinkCard();
  }
}

// Function to shrink card back to original size
function shrinkCard() {
  isExpanded = false;
  if (currentCard) {
    currentCard.classList.remove("card-expanded");
    let backButton = currentCard.querySelector(".back-button");
    if (backButton) {
      backButton.remove();
    }

    // Show the navbar again
    document.querySelector("nav").style.display = "block";

    gsap.to(currentCard, {
      duration: 0.3,
      width: "",
      height: "",
      ease: "power2.out",
      onComplete: () => {
        currentCard = null;
        initializeCards();
      },
    });
  }
}

// Event listener to handle card click
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("click", handleCardClick);
});

document.addEventListener("DOMContentLoaded", function () {
  splitTextIntoSpans(".copy h1");
  initializeCards();

  gsap.set("h1 span", { y: -200 });
  gsap.set(".slider .card:last-child h1 span", { y: 0 });

  // Add mouse enter/leave listeners to each card
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);
    card.addEventListener("click", () => {
      if (!isExpanded) {
        scaleCardToFullScreen(card);
      }
    });
  });
});

// Function to handle card animation
function handleEvent() {
  if (isAnimating || isExpanded) return;

  isAnimating = true;

  let slider = document.querySelector(".slider");
  let cards = Array.from(slider.querySelectorAll(".card"));
  let lastCard = cards.pop();
  let nextCard = cards[cards.length - 1];

  gsap.to(lastCard.querySelectorAll("h1 span"), {
    y: 200,
    duration: 0.3, // Reduced duration for quicker animation
    ease: "power1.inOut", // Changed easing for smoother transitions
  });

  gsap.to(lastCard, {
    y: "+=150%",
    duration: 0.3, // Reduced duration for quicker animation
    ease: "power1.inOut", // Changed easing for smoother transitions
    onComplete: () => {
      slider.prepend(lastCard);
      initializeCards();
      gsap.set(lastCard.querySelectorAll("h1 span"), { y: -200 });

      setTimeout(() => {
        isAnimating = false;
      }, 300); // Reduced timeout for quicker reset
    },
  });

  gsap.to(nextCard.querySelectorAll("h1 span"), {
    y: 0,
    duration: 0.5, // Reduced duration for quicker animation
    ease: "power1.inOut", // Changed easing for smoother transitions
    stagger: 0.03, // Slightly reduced stagger for smoother transitions
  });
}

// Function to handle mouse wheel event
function handleMouseWheel(event) {
  if (isExpanded) return; // Prevent scroll animation when a card is expanded

  // Prevent default behavior to avoid scrolling the page
  event.preventDefault();

  // Trigger the animation logic
  handleEvent();
}

// Function to start listening for mouse wheel events
function startListeningForMouseWheel() {
  document.addEventListener("wheel", handleMouseWheel, { passive: false });
}

// Function to stop listening for mouse wheel events
function stopListeningForMouseWheel() {
  document.removeEventListener("wheel", handleMouseWheel);
}

// Function to handle mouse enter event on a card
function handleMouseEnter() {
  startListeningForMouseWheel();
}

// Function to handle mouse leave event on a card
function handleMouseLeave() {
  stopListeningForMouseWheel();
}

// Function to handle click event and animate the background
const handleClick = () => {
  // Add overflow hidden to prevent scrollbars during transition
  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";

  const tl = gsap.timeline({
    onComplete: () => {
      // Remove overflow hidden after the transition is complete
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    },
  });

  tl.to(".initial-bg", {
    scale: 1.5, // Scale up to give zoom-out effect
    opacity: 0,
    duration: 1.5,
    ease: "power2.out",

    onComplete: () => {
      document.querySelector(".initial-bg").style.display = "none";
    },
  }).to(
    ".container",
    {
      opacity: 1,
      duration: 1.5,
      ease: "power2.out",
    },
    "-=1"
  ); // Start this animation 1 second before the previous one ends
};

// Add click event listener to the document
document.addEventListener("click", handleClick);
///////////////////////////////////////////////////////


let touchStartY = 0;
let touchEndY = 0;

// Function to start listening for touch events
function startListeningForTouch() {
  document.addEventListener("touchstart", handleTouchStart, { passive: false });
  document.addEventListener("touchmove", handleTouchMove, { passive: false });
}

// Function to stop listening for touch events
function stopListeningForTouch() {
  document.removeEventListener("touchstart", handleTouchStart);
  document.removeEventListener("touchmove", handleTouchMove);
}

// Function to handle touch start event
function handleTouchStart(event) {
  if (isExpanded) return; // Prevent scroll animation when a card is expanded
  touchStartY = event.touches[0].clientY;
}

// Function to handle touch move event
function handleTouchMove(event) {
  if (isExpanded) return; // Prevent scroll animation when a card is expanded
  event.preventDefault();

  touchEndY = event.touches[0].clientY;
  let deltaY = touchEndY - touchStartY;

  if (deltaY > 50 || deltaY < -50) { // Adjust this threshold as needed
    handleEvent();
  }
}

// Start listening for touch events
startListeningForTouch();
