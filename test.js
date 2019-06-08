window.addEventListener('load', () => {
  const navBurger = document.getElementById('navBurger');

  navBurger.addEventListener('click', () => {
    const b1 = document.getElementById('burger1');
    const b2 = document.getElementById('burger2');
    const b3 = document.getElementById('burger3');

    b1.classList.toggle('burger1Active');
    b2.classList.toggle('burger2Active');
    b3.classList.toggle('burger3Active');
  });
});
