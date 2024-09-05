import { getData } from "./functions.js";

const initPetSlider = () => {
  const slider = document.querySelector('.pets-slider');

  if (!slider) return;

  const sliderWrapper = slider.querySelector('.pets-slider__wrapper');
  const sliderList = sliderWrapper.querySelector('.pets-slider__swiper');
  const btnPrev = slider.querySelector('.pets-slider__nav-button_prev');
  const btnNext = slider.querySelector('.pets-slider__nav-button_next');
  let originalPetList = [];
  let prevPetSubList = []
  let currentPetSubList = []
  let nextPetSubList = []
  let oldWidth = window.innerWidth;

  window.addEventListener("resize", () => {
    if (
      oldWidth >= 768 && window.innerWidth < 768 ||
      oldWidth < 768 && window.innerWidth >= 768 ||
      oldWidth >= 1280 && window.innerWidth < 1280 ||
      oldWidth < 1280 && window.innerWidth >= 1280
    ) {
      renderSlider();
    }

    oldWidth = window.innerWidth;
  });

  const openModal = () => {
    sliderList.querySelectorAll('.pets-slider__slide').forEach(slide => {
      slide.addEventListener('click', e => e.preventDefault());
    });
  };

  const getCountSlides = () => {
    const width = window.innerWidth;
    return width < 768
      ? 1
      : width < 1280
        ? 2
        : 3
  };

  const getNewPetSubList = () => {
    const countSlides = getCountSlides();

    const arr = originalPetList
      .reduce((acc, item) => [...acc, item.id], [])
      .sort(() => Math.random() - 0.5)

    return [...new Set([...currentPetSubList, ...arr])].slice(-countSlides)
  };

  const movedSlides = (offset, navButton) => {
    const sliderItems = sliderList.querySelectorAll('.pets-slider__slide');

    return new Promise((resolve) => {
      setTimeout(() => {
        sliderList.style.transition = "transform 0s ease";
        sliderList.style.transform = `translateX(${offset}px)`;

        switch (navButton) {
          case 'prev':
            nextPetSubList = currentPetSubList;
            currentPetSubList = prevPetSubList;
            prevPetSubList = getNewPetSubList();

            prevPetSubList.forEach((id, i) => {
              sliderList.insertAdjacentHTML("afterbegin", getSlide(id));
              sliderItems[sliderItems.length - 1 - i].remove();
            });
            break;
          case 'next':
            prevPetSubList = currentPetSubList;
            currentPetSubList = nextPetSubList;
            nextPetSubList = getNewPetSubList();

            nextPetSubList.forEach((id, i) => {
              sliderList.insertAdjacentHTML("beforeend", getSlide(id));
              sliderItems[i].remove();
            });
        }

        btnPrev.disabled = false;
        btnNext.disabled = false;
        openModal();
        resolve();
      }, 500);
    });
  };

  const changeSlide = (navButton = '') => {
    const slideWidth = +getComputedStyle(sliderWrapper).width.replace('px', '') + +getComputedStyle(sliderList).columnGap.replace('px', '');
    let page = 1;

    switch (navButton) {
      case 'prev':
        page = 0
        break;
      case 'next':
        page = 2
    }

    if (navButton !== '') {
      btnPrev.disabled = true;
      btnNext.disabled = true;
      sliderList.style.transition = "transform 0.5s ease";
      movedSlides(-slideWidth, navButton);
    }

    sliderList.style.transform = `translateX(${-slideWidth * page}px)`;
  };

  const getSlide = (id) => {
    const pet = originalPetList.find(pet => pet.id == id);

    return `
      <li class="pets-slider__slide" data-id="${pet.id}">
        <article class="card">
          <a class="card__link" href="#">
            <div class="card__image-ibg">
              <picture>
                <source data-srcset="img/pets/${pet.img}.webp" srcset="img/pets/${pet.img}.webp" type="image/webp">
                <img src="img/pets/${pet.img}.jpg" data-src="img/pets/${pet.img}.jpg" alt="${pet.name}">
              </picture>
            </div>
            <div class="card__content">
              <h3 class="card__title">${pet.name}</h3>
              <div class="card__button button-secondary">Learn more</div>
            </div>
          </a>
        </article>
      </li>
    `
  };

  const generateSlides = () => {
    let fullPetList = [];

    currentPetSubList = getNewPetSubList();
    prevPetSubList = getNewPetSubList();
    nextPetSubList = getNewPetSubList();
    fullPetList = [...prevPetSubList, ...currentPetSubList, ...nextPetSubList]

    sliderList.innerHTML = ''

    fullPetList.forEach(id => {
      sliderList.insertAdjacentHTML("beforeend", getSlide(id))
    });

    openModal();
  };

  const renderSlider = () => {
    getData(`./files/pets.json`).then(pets => {
      originalPetList = [...pets];
      generateSlides();
      changeSlide();
    });
  };

  btnPrev.addEventListener('click', () => changeSlide('prev'));
  btnNext.addEventListener('click', () => changeSlide('next'));
  renderSlider();
}

initPetSlider();