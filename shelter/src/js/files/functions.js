/* Проверка поддержки webp, добавление класса webp или no-webp для HTML */
export function isWebp() {
  // Проверка поддержки webp
  function testWebP(callback) {
    let webP = new Image();
    webP.onload = webP.onerror = function () {
      callback(webP.height == 2);
    };
    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
  }
  // Добавление класса _webp или _no-webp для HTML
  testWebP(function (support) {
    let className = support === true ? 'webp' : 'no-webp';
    document.documentElement.classList.add(className);
  });
}

/* Добавление класса no-touch для HTML, если браузер не поддерживает touch */
export function addTouchClass() {
  if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
  } else {
    document.documentElement.classList.add('no-touch');
  }
}

/* Ленивая загрузка lazyload */
export const lazyload = () => {
  window.addEventListener('load', () => {
    const lazyObjs = document.querySelectorAll('[data-src], [data-srcset], [data-poster]');

    const updateLazyObject = arr => {
      arr.forEach(el => {
        if (el.dataset.src) {
          el.src = el.dataset.src;
        }
        if (el.dataset.srcset) {
          el.srcset = el.dataset.srcset;
        }
        if (el.dataset.poster) {
          el.poster = el.dataset.poster;
        }
      });
    };

    if (lazyObjs) {
      updateLazyObject(lazyObjs);
    }
  });
};

//====================================================================
// Модуль работы с меню (бургер)
// Сниппет (HTML): menu
//====================================================================

export function menuInit() {
  if (document.querySelector(".icon-menu")) {
    document.addEventListener("click", function (e) {
      if (bodyLockStatus && e.target.closest('.icon-menu')) {
        bodyLockToggle();
        document.documentElement.classList.toggle("menu-open");
      }
    });
  };
}
export function menuOpen() {
  bodyLock();
  document.documentElement.classList.add("menu-open");
}
export function menuClose() {
  bodyUnlock();
  document.documentElement.classList.remove("menu-open");
}

//====================================================================
// Вспомогательные модули блокировки прокрутки и скочка 
//====================================================================

export let bodyLockStatus = true;
export let bodyLockToggle = (delay = 500) => {
  if (document.documentElement.classList.contains('lock')) {
    bodyUnlock(delay);
  } else {
    bodyLock(delay);
  }
}
export let bodyUnlock = (delay = 500) => {
  let body = document.querySelector("body");
  if (bodyLockStatus) {
    let lock_padding = document.querySelectorAll("[data-lp]");
    setTimeout(() => {
      for (let index = 0; index < lock_padding.length; index++) {
        const el = lock_padding[index];
        el.style.paddingRight = '0px';
      }
      body.style.paddingRight = '0px';
      document.documentElement.classList.remove("lock");
    }, delay);
    bodyLockStatus = false;
    setTimeout(function () {
      bodyLockStatus = true;
    }, delay);
  }
}
export let bodyLock = (delay = 500) => {
  let body = document.querySelector("body");
  if (bodyLockStatus) {
    let lock_padding = document.querySelectorAll("[data-lp]");
    for (let index = 0; index < lock_padding.length; index++) {
      const el = lock_padding[index];
      el.style.paddingRight = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
    }
    body.style.paddingRight = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
    document.documentElement.classList.add("lock");

    bodyLockStatus = false;
    setTimeout(function () {
      bodyLockStatus = true;
    }, delay);
  }
}

export const getData = async function (url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Ошибка по адресу "${url}", статус ошибки ${response.status}!`);
  }

  return await response.json();
};