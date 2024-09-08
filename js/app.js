(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(webP.height == 2);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = support === true ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    function addTouchClass() {
        if ("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch) ; else document.documentElement.classList.add("no-touch");
    }
    const lazyload = () => {
        window.addEventListener("load", (() => {
            const lazyObjs = document.querySelectorAll("[data-src], [data-srcset], [data-poster]");
            const updateLazyObject = arr => {
                arr.forEach((el => {
                    if (el.dataset.src) el.src = el.dataset.src;
                    if (el.dataset.srcset) el.srcset = el.dataset.srcset;
                    if (el.dataset.poster) el.poster = el.dataset.poster;
                }));
            };
            if (lazyObjs) updateLazyObject(lazyObjs);
        }));
    };
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        }));
    }
    function menuClose() {
        bodyUnlock();
        document.documentElement.classList.remove("menu-open");
    }
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    const getData = async function(url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Ошибка по адресу "${url}", статус ошибки ${response.status}!`);
        return await response.json();
    };
    const getCard = (element, id) => {
        getData(`./files/pets.json`).then((pets => {
            for (const pet of pets) if (pet.id == id) {
                element.innerHTML = `\n            <article class="card">\n              <a class="card__link" href="#">\n                <div class="card__image-ibg">\n                  <picture>\n                    <source \n                      data-srcset="img/pets/${pet.img.replace(/\.[^.]+$/, "")}.webp" \n                      srcset="img/pets/${pet.img.replace(/\.[^.]+$/, "")}.webp" type="image/webp"\n                    >\n                    <img src="img/pets/${pet.img}" data-src="img/pets/${pet.img}" alt="${pet.name}">\n                  </picture>\n                </div>\n                <div class="card__content">\n                  <h3 class="card__title">${pet.name}</h3>\n                  <div class="card__button button-secondary">Learn more</div>\n                </div>\n              </a>\n            </article>\n        `;
                return element;
            }
        }));
    };
    const initPetSlider = () => {
        const slider = document.querySelector(".pets-slider");
        if (!slider) return;
        const sliderWrapper = slider.querySelector(".pets-slider__wrapper");
        const sliderList = sliderWrapper.querySelector(".pets-slider__swiper");
        const btnPrev = slider.querySelector(".pets-slider__nav-button_prev");
        const btnNext = slider.querySelector(".pets-slider__nav-button_next");
        let originalPetList = [];
        let prevPetSubList = [];
        let currentPetSubList = [];
        let nextPetSubList = [];
        let oldWidth = window.innerWidth;
        window.addEventListener("resize", (() => {
            if (oldWidth >= 768 && window.innerWidth < 768 || oldWidth < 768 && window.innerWidth >= 768 || oldWidth >= 1280 && window.innerWidth < 1280 || oldWidth < 1280 && window.innerWidth >= 1280) renderSlider();
            oldWidth = window.innerWidth;
        }));
        const getCountSlides = () => {
            const width = window.innerWidth;
            return width < 768 ? 1 : width < 1280 ? 2 : 3;
        };
        const getNewPetSubList = () => {
            const countSlides = getCountSlides();
            const arr = originalPetList.reduce(((acc, item) => [ ...acc, item.id ]), []).sort((() => Math.random() - .5));
            return [ ...new Set([ ...currentPetSubList, ...arr ]) ].slice(-countSlides);
        };
        const movedSlides = (offset, navButton) => {
            const sliderItems = sliderList.querySelectorAll(".pets-slider__slide");
            return new Promise((resolve => {
                setTimeout((() => {
                    sliderList.style.transition = "transform 0s ease";
                    sliderList.style.transform = `translateX(${offset}px)`;
                    switch (navButton) {
                      case "prev":
                        nextPetSubList = currentPetSubList;
                        currentPetSubList = prevPetSubList;
                        prevPetSubList = getNewPetSubList();
                        prevPetSubList.forEach(((id, i) => {
                            sliderList.insertAdjacentElement("afterbegin", getSlide(id));
                            sliderItems[sliderItems.length - 1 - i].remove();
                        }));
                        break;

                      case "next":
                        prevPetSubList = currentPetSubList;
                        currentPetSubList = nextPetSubList;
                        nextPetSubList = getNewPetSubList();
                        nextPetSubList.forEach(((id, i) => {
                            sliderList.insertAdjacentElement("beforeend", getSlide(id));
                            sliderItems[i].remove();
                        }));
                    }
                    btnPrev.disabled = false;
                    btnNext.disabled = false;
                    resolve();
                }), 500);
            }));
        };
        const changeSlide = (navButton = "") => {
            const slideWidth = +getComputedStyle(sliderWrapper).width.replace("px", "") + +getComputedStyle(sliderList).columnGap.replace("px", "");
            let page = 1;
            switch (navButton) {
              case "prev":
                page = 0;
                break;

              case "next":
                page = 2;
            }
            if (navButton !== "") {
                btnPrev.disabled = true;
                btnNext.disabled = true;
                sliderList.style.transition = "transform 0.5s ease";
                movedSlides(-slideWidth, navButton);
            }
            sliderList.style.transform = `translateX(${-slideWidth * page}px)`;
        };
        const getSlide = id => {
            const pet = document.createElement("li");
            pet.classList.add("pets-slider__slide");
            pet.dataset.id = id;
            pet.append(getCard(pet, id));
            return pet;
        };
        const generateSlides = () => {
            let fullPetList = [];
            currentPetSubList = getNewPetSubList();
            prevPetSubList = getNewPetSubList();
            nextPetSubList = getNewPetSubList();
            fullPetList = [ ...prevPetSubList, ...currentPetSubList, ...nextPetSubList ];
            sliderList.innerHTML = "";
            fullPetList.forEach((id => {
                sliderList.insertAdjacentElement("beforeend", getSlide(id));
            }));
        };
        const renderSlider = () => {
            getData(`./files/pets.json`).then((pets => {
                originalPetList = [ ...pets ];
                generateSlides();
                changeSlide();
            }));
        };
        btnPrev.addEventListener("click", (() => changeSlide("prev")));
        btnNext.addEventListener("click", (() => changeSlide("next")));
        renderSlider();
    };
    initPetSlider();
    const initPagination = () => {
        const pets = document.querySelector(".html-pets .pets");
        if (!pets) return;
        const petsList = pets.querySelector(".pets__list");
        const page = pets.querySelector(".pets-pagination__page");
        const btnFirst = pets.querySelector(".pets-pagination__button_first");
        const btnPrev = pets.querySelector(".pets-pagination__button_prev");
        const btnNext = pets.querySelector(".pets-pagination__button_next");
        const btnLast = pets.querySelector(".pets-pagination__button_last");
        const COUNT_SET = 6;
        let originalPetList = [];
        let fullPetList = [];
        let currentPage = 1;
        let COUNT_PAGES_LIST = [ 6, 8, 16 ];
        let oldWidth = window.innerWidth;
        window.addEventListener("resize", (() => {
            if (oldWidth >= 768 && window.innerWidth < 768 || oldWidth < 768 && window.innerWidth >= 768 || oldWidth >= 1280 && window.innerWidth < 1280 || oldWidth < 1280 && window.innerWidth >= 1280) {
                currentPage = 1;
                renderPage();
            }
            oldWidth = window.innerWidth;
        }));
        const getCountPages = () => {
            const width = window.innerWidth;
            return width < 768 ? COUNT_PAGES_LIST[2] : width < 1280 ? COUNT_PAGES_LIST[1] : COUNT_PAGES_LIST[0];
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
        const changePage = (btn = "") => {
            switch (btn) {
              case "first":
                currentPage = 1;
                break;

              case "prev":
                currentPage = currentPage === 1 ? 1 : currentPage - 1;
                break;

              case "next":
                currentPage = currentPage === getCountPages() ? currentPage : currentPage + 1;
                break;

              case "last":
                currentPage = getCountPages();
            }
            renderPage();
        };
        const getItem = id => {
            const pet = document.createElement("li");
            pet.classList.add("pets__item");
            pet.dataset.id = id;
            pet.append(getCard(pet, id));
            return pet;
        };
        const generatePetList = () => {
            let arr = [];
            for (let i = 0; i < COUNT_SET; i++) {
                arr = originalPetList.reduce(((acc, item) => [ ...acc, item.id ]), []).sort((() => Math.random() - .5));
                fullPetList = [ ...fullPetList, ...arr ];
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
            petsList.innerHTML = "";
            pagePetList[currentPage - 1].forEach((id => {
                petsList.appendChild(getItem(id));
            }));
            updateBtns();
        };
        const renderPets = () => {
            getData(`./files/pets.json`).then((pets => {
                originalPetList = [ ...pets ];
                generatePetList();
                renderPage();
            }));
        };
        btnFirst.addEventListener("click", (() => changePage("first")));
        btnPrev.addEventListener("click", (() => changePage("prev")));
        btnNext.addEventListener("click", (() => changePage("next")));
        btnLast.addEventListener("click", (() => changePage("last")));
        renderPets();
    };
    initPagination();
    const modal = document.querySelector(".modal");
    const renderModal = (id, urlsImage) => {
        getData(`./files/pets.json`).then((pets => {
            for (const pet of pets) if (pet.id == id) {
                modal.querySelector(".modal__title").textContent = pet.name;
                modal.querySelector(".modal__subtitle").textContent = `${pet.type} - ${pet.breed}`;
                modal.querySelector(".modal__description").textContent = pet.description;
                modal.querySelector(".modal__parameters-item_age span").textContent = pet.age;
                modal.querySelector(".modal__parameters-item_inoculations span").textContent = pet.inoculations.join(", ");
                modal.querySelector(".modal__parameters-item_diseases span").textContent = pet.diseases.join(", ");
                modal.querySelector(".modal__parameters-item_parasites span").textContent = pet.parasites.join(", ");
                modal.querySelector(".modal__image img").src = urlsImage.src;
                modal.querySelector(".modal__image img").alt = pet.name;
                modal.querySelectorAll(".modal__image source").forEach((source => {
                    source.srcset = urlsImage.srcset;
                }));
                modal.classList.remove("hidden");
            }
        }));
    };
    const closeModal = e => {
        if (modal.classList.contains("hidden")) return;
        if (!e.target.closest(".modal__wrapper") || e.target.closest(".modal__btn")) {
            modal.classList.add("hidden");
            bodyUnlock();
        }
    };
    const openModal = e => {
        const card = e.target.closest(".card");
        if (!card || !modal) return;
        e.preventDefault();
        const id = card.closest("li[data-id]").dataset.id;
        const urlsImage = {
            src: card.querySelector(".card__image-ibg img").dataset.src,
            srcset: card.querySelector(".card__image-ibg source") ? card.querySelector(".card__image-ibg source").dataset.srcset : ""
        };
        renderModal(id, urlsImage);
        bodyLock();
    };
    document.addEventListener("click", closeModal);
    document.addEventListener("click", openModal);
    const links = document.querySelectorAll(".menu__link");
    links.forEach((link => link.addEventListener("click", (e => {
        if (e.target.closest(".html-menu") && e.target.closest(".menu__link_menu")) e.preventDefault();
        menuClose();
    }))));
    const closeMenuOverlay = ({target = e.target}) => {
        if (document.documentElement.classList.contains("menu-open") && !target.closest(".menu__list")) menuClose();
    };
    document.addEventListener("click", closeMenuOverlay);
    isWebp();
    addTouchClass();
    lazyload();
    menuInit();
})();