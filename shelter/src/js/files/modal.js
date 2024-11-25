import { getData, bodyLock, bodyUnlock } from "./functions.js";

const modal = document.querySelector('.modal');

const renderModal = (id, urlsImage) => {
  getData(`./files/pets.json`).then(pets => {
    for (const pet of pets) {
      if (pet.id == id) {
        modal.querySelector('.modal__title').textContent = pet.name;
        modal.querySelector('.modal__subtitle').textContent = `${pet.type} - ${pet.breed}`
        modal.querySelector('.modal__description').textContent = pet.description;
        modal.querySelector('.modal__parameters-item_age span').textContent = pet.age;
        modal.querySelector('.modal__parameters-item_inoculations span').textContent = pet.inoculations.join(', ');
        modal.querySelector('.modal__parameters-item_diseases span').textContent = pet.diseases.join(', ');
        modal.querySelector('.modal__parameters-item_parasites span').textContent = pet.parasites.join(', ');

        modal.querySelector('.modal__image img').src = urlsImage.src;
        modal.querySelector('.modal__image img').alt = pet.name;
        modal.querySelectorAll('.modal__image source').forEach(source => {
          source.srcset = urlsImage.srcset;
        });

        modal.classList.remove('hidden');
      }
    }
  });
};

const closeModal = (e) => {
  if (modal.classList.contains('hidden')) return;

  if (!e.target.closest('.modal__wrapper') || e.target.closest('.modal__btn')) {
    modal.classList.add('hidden')
    bodyUnlock();
  }
};

export const openModal = (e) => {
  const card = e.target.closest('.card');

  if (!card || !modal) return;

  e.preventDefault();

  const id = card.closest('li[data-id]').dataset.id;
  const urlsImage = {
    src: card.querySelector('.card__image-ibg img').dataset.src,
    srcset: card.querySelector('.card__image-ibg source') ? card.querySelector('.card__image-ibg source').dataset.srcset : ''
  };

  renderModal(id, urlsImage);
  bodyLock();
};

document.addEventListener('click', closeModal);
document.addEventListener('click', openModal);