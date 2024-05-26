CustomEase.create("cubic", "0.83, 0, 0.17, 1");
let isAnimating = false;

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
// Function to scale the card to full screen
function scaleCardToFullScreen() {
    const container = document.querySelector('.container');
    const card = document.querySelector('.card');

    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    const scaleX = containerWidth / card.offsetWidth;
    const scaleY = containerHeight / card.offsetHeight;
    const scale = Math.max(scaleX, scaleY);

    return scale;
}

document.addEventListener("DOMContentLoaded", function(){
    splitTextIntoSpans(".copy h1");
    initializeCards();

    const scale = scaleCardToFullScreen();
    gsap.set("h1 span", {y: -200});
    gsap.set(".slider .card:last-child h1 span", {y:0})
    gsap.set(".slider .card:last-child", {scaleX:scale, scaleY:scale,ZIndex: 1000,})
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
            gsap.set(lastCard, {scaleX: 1, scaleY: 1, ZIndex: 1});
            
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

document.addEventListener("click", handleEvent);


// let nextSection = document.querySelector(".service");
// window.scrollTo({
//     top: nextSection.offsetTop,
//     behavior: 'smooth'
// });