export const openModal = () => {
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', e => {
      e.preventDefault();
      console.log(card);
    });
  });
};