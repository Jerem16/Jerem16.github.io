const slides = [
    {
        image: "slide1.jpg",
        tagLine:
            "Impressions tous formats <span>en boutique et en ligne</span>",
    },
    {
        image: "slide2.jpg",
        tagLine:
            "Tirages haute définition grand format <span>pour vos bureaux et events</span>",
    },
    {
        image: "slide3.jpg",
        tagLine: "Grand choix de couleurs <span>de CMJN aux pantones</span>",
    },
    {
        image: "slide4.png",
        tagLine: "Autocollants <span>avec découpe laser sur mesure</span>",
    },
];

/**      Ajout des Event Listeners sur les flèches       **/

const leftArrow = document.querySelector(".arrow_left");
const rightArrow = document.querySelector(".arrow_right");

leftArrow.addEventListener("click", function () {
    //console.log("leftArrow");
    clickLeft();
});
rightArrow.addEventListener("click", function () {
    //console.log("rightArrow");
    clickRight();
});

/***                Modification du slide au click sur arrows             ***/

let compteur = 0;
for (let i in slides) {
    let bullet = document.createElement("div");
    document.querySelector(".dots").appendChild(bullet);
    bullet.classList.add("dot");

    if (i == compteur) {
        bullet.classList.add("dot_selected");
    }

    var bullets = bullet.addEventListener("click", function () {
        bullets = i * 1;
        let bannerImages = document.querySelector(".banner-img");
        bannerImages.src = "assets/images/slideshow/" + slides[i].image;

        let bannerText = document.querySelector("#banner > p");
        bannerText.innerHTML = slides[i].tagLine;
        compteur = 0;
        for (let compteur in slides) {
            document
                .querySelectorAll(".dot")
                .forEach((bullet) => bullet.classList.remove("dot_selected"));
            if ((compteur = slides.length)) {
                bullet.classList.add("dot_selected");
            }
        }
        console.log("----------Dot-----------");
        console.log("compteur", compteur);
        console.log("Bullets", bullets);
        console.log("------------------------------");
    });
}

var bullet = document.querySelectorAll(".dot");
bullets = 0;

function bannerSlider() {
    for (let i in slides) {
        //console.log("Bullets", bullets, "compteur", compteur);

        let bannerImages = document.querySelector(".banner-img");
        bannerImages.src =
            "assets/images/slideshow/" + slides[compteur + bullets].image;

        let bannerText = document.querySelector("#banner > p");
        bannerText.innerHTML = slides[compteur + bullets].tagLine;

        if (i == compteur + bullets) {
            bullet[i].classList.add("dot_selected");
        } else {
            bullet[i].classList.remove("dot_selected");
        }
    }
    console.log("----------Slider----------");
    console.log("bullets", this.bullets);
    console.log("compteur", compteur);
    console.log("------------------------------");
}

function clickLeft() {
    compteur--;
    if (compteur + bullets < 0) {
        compteur = slides.length - 1;
        bullets = 0;
    }
    bannerSlider();
}

function clickRight() {
    compteur++;
    if (compteur + bullets > slides.length - 1) {
        compteur = 0;
        bullets = 0;
    }
    bannerSlider();
}
