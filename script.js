CustomEase.create("cubic", "0.83, 0, 0.17, 1");
let isAnimating = false;
let currentIndex = 0;

function splitTextIntoSpans(selector){
    let elements = document.querySelectorAll(selector);
    elements.forEach((element)=>{
        let text = element.innerText;
        let splitText = text
        .split("")
        .map(function(char){
            return `<span>${char === " " ? "&nbsp;&nbsp;" : char}</span>`
        })
        .join("");

        element.innerHTML = splitText;
    });
}

function initializeCards(){
    let cards = Array.from(document.querySelectorAll(".card"));
    gsap.to(cards,{
        y: (i) => -15 + 15 * i + "%",
        z: (i) => 15 * i,
        ease: "cubic",
        stagger: -0.1,
    });

}

document.addEventListener("DOMContentLoaded", function(){
    splitTextIntoSpans(".copy h1");
    initializeCards();

    const scale = scaleCardToFullScreen();
    gsap.set("h1 span", {y: -200});
    gsap.set(".slider .card:last-child h1 span", {y:0})
});

function handleEvent(){
    if(isAnimating) return;

    isAnimating = true;

    let slider = document.querySelector(".slider");
    let cards = Array.from(slider.querySelectorAll(".card"));
    let lastCard = cards.pop();
    let nextCard = cards[cards.length - 1];

    gsap.to(lastCard.querySelectorAll("h1 span"), {
        y: 200,
        duration: 0.75,
        ease: "cubic",
    });
 
    gsap.to(lastCard, {
        y: "+=150%",
        duration: 0.75,
        ease: "cubic",
        onComplete: () => {
            slider.prepend(lastCard);
            initializeCards();
            gsap.set(lastCard.querySelectorAll("h1 span"), {y: -200});
            // gsap.set(lastCard, {scaleX: 1, scaleY: 1, ZIndex: 1})

            // Update the current index
            currentIndex = (currentIndex + 1);

            if (currentIndex === cards.length+1) {
                document.querySelector('.service-heading').scrollIntoView({ behavior: 'smooth' });
                currentIndex = 0;
            }

            setTimeout(() => {
                isAnimating = false;
            },1000)
        },
    });
 
    gsap.to(nextCard.querySelectorAll("h1 span"), {
        y: 0,
        duration: 1,
        ease: "cubic",
        stagger: 0.05,
    });
}

document.addEventListener("scroll", handleEvent);


const handleClick = () => {
    const tl = gsap.timeline();

    tl.to('.initial-bg', {
      scale: 1.5, // Scale up to give zoom-out effect
      opacity: 0,
      duration: 1.5,
      ease: 'power2.out',
      onComplete: () => {
        document.querySelector('.initial-bg').style.display = 'none';
      }
    })
    .to('.container', {
      opacity: 1,
      duration: 1.5,
      ease: 'power2.out'
    }, "-=1"); // Start this animation 1 second before the previous one ends

  };
  document.addEventListener("click", handleClick);