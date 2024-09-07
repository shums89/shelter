import { getData } from "./functions.js";

export const getCard = (element, id) => {
  getData(`./files/pets.json`).then(pets => {
    for (const pet of pets) {
      if (pet.id == id) {
        element.innerHTML = `
            <article class="card">
              <a class="card__link" href="#">
                <div class="card__image-ibg">
                  <picture>
                    <source 
                      data-srcset="img/pets/${pet.img.replace(/\.[^.]+$/, "")}.webp" 
                      srcset="img/pets/${pet.img.replace(/\.[^.]+$/, "")}.webp" type="image/webp"
                    >
                    <img src="img/pets/${pet.img}" data-src="img/pets/${pet.img}" alt="${pet.name}">
                  </picture>
                </div>
                <div class="card__content">
                  <h3 class="card__title">${pet.name}</h3>
                  <div class="card__button button-secondary">Learn more</div>
                </div>
              </a>
            </article>
        `
        return element;
      }
    }
  });
};
