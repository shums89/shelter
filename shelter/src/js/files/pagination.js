import { getData } from "./functions.js";
import { getCard } from "./card.js";

const initPagination = () => {
  const pets = document.querySelector('.html-pets .pets');

  if (!pets) return;

  const petsList = pets.querySelector('.pets__list');
  const page = pets.querySelector('.pets-pagination__page');
  const btnFirst = pets.querySelector('.pets-pagination__button_first');
  const btnPrev = pets.querySelector('.pets-pagination__button_prev');
  const btnNext = pets.querySelector('.pets-pagination__button_next');
  const btnLast = pets.querySelector('.pets-pagination__button_last');
  const COUNT_SET = 6;
  let originalPetList = [];
  let fullPetList = [];
  let currentPage = 1;
  let COUNT_PAGES_LIST = [6, 8, 16];
  let oldWidth = window.innerWidth;

  window.addEventListener("resize", () => {
    if (
      oldWidth >= 768 && window.innerWidth < 768 ||
      oldWidth < 768 && window.innerWidth >= 768 ||
      oldWidth >= 1280 && window.innerWidth < 1280 ||
      oldWidth < 1280 && window.innerWidth >= 1280
    ) {
      currentPage = 1;
      renderPage();
    }

    oldWidth = window.innerWidth;
  });

  const getCountPages = () => {
    const width = window.innerWidth;
    return width < 768
      ? COUNT_PAGES_LIST[2]
      : width < 1280
        ? COUNT_PAGES_LIST[1]
        : COUNT_PAGES_LIST[0]
  };

  const updateBtns = () => {
    btnFirst.disabled = false;
    btnPrev.disabled = false;
    btnNext.disabled = false;
    btnLast.disabled = false;

    switch (currentPage) {
      case 1:
        btnFirst.disabled = true;
        btnPrev.disabled = true;
        break;
      case getCountPages():
        btnNext.disabled = true;
        btnLast.disabled = true;
        break;
    }
  };

  const changePage = (btn = '') => {
    switch (btn) {
      case 'first':
        currentPage = 1;
        break;
      case 'prev':
        currentPage = currentPage === 1 ? 1 : currentPage - 1;
        break;
      case 'next':
        currentPage = currentPage === getCountPages() ? currentPage : currentPage + 1;
        break;
      case 'last':
        currentPage = getCountPages();
    }
    renderPage();
  };

  const getItem = (id) => {
    const pet = document.createElement('li');
    pet.classList.add('pets__item');
    pet.dataset.id = id;

    pet.append(getCard(pet, id));

    return pet;
  };

  const generatePetList = () => {
    let arr = [];

    for (let i = 0; i < COUNT_SET; i++) {
      arr = originalPetList
        .reduce((acc, item) => [...acc, item.id], [])
        .sort(() => Math.random() - 0.5)

      fullPetList = [...fullPetList, ...arr]
    }
  };

  const sliceIntoChunks = (arr, chunkSize) => {
    const res = [];

    for (let i = 0; i < arr.length; i += chunkSize) {
      const chunk = arr.slice(i, i + chunkSize);
      res.push(chunk);
    }

    return res;
  };

  const renderPage = () => {
    const size = fullPetList.length / getCountPages();
    const pagePetList = sliceIntoChunks(fullPetList, size);

    page.textContent = currentPage;
    petsList.innerHTML = ''

    pagePetList[currentPage - 1].forEach(id => {
      petsList.appendChild(getItem(id));
    });

    updateBtns();
  };

  const renderPets = () => {
    getData(`./files/pets.json`).then(pets => {
      originalPetList = [...pets];
      generatePetList();
      renderPage();
    });
  };

  btnFirst.addEventListener('click', () => changePage('first'));
  btnPrev.addEventListener('click', () => changePage('prev'));
  btnNext.addEventListener('click', () => changePage('next'));
  btnLast.addEventListener('click', () => changePage('last'));
  renderPets();
};

initPagination();