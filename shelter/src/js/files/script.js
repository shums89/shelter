import { menuClose } from "./functions.js";

const links = document.querySelectorAll('.menu__link');

links.forEach(link => link.addEventListener('click', e => {
  if (e.target.closest('.html-menu') && e.target.closest('.menu__link_menu')) {
    e.preventDefault();
  }

  menuClose();
}));

const closeMenuOverlay = ({ target = e.target }) => {
  if (document.documentElement.classList.contains('menu-open') && !target.closest('.menu__list')) {
    menuClose();
  }
};

document.addEventListener('click', closeMenuOverlay);