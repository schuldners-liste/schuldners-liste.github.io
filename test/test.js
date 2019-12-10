window.addEventListener('load', () => {
  const navBurger = document.getElementById('navBurger');

  navBurger.addEventListener('click', () => {
    const b1 = document.getElementById('burger1');
    const b2 = document.getElementById('burger2');
    const b3 = document.getElementById('burger3');
    const nav = document.getElementById('nav');
    const burger = document.getElementById('navBurger');

    b1.classList.toggle('burger1Active');
    b2.classList.toggle('burger2Active');
    b3.classList.toggle('burger3Active');

    if (nav.style.left === '0px') {
      nav.style.left = '-90vw';
      burger.style.left = 0;
    } else {
      nav.style.left = 0;
      burger.style.left = '82vw';
    }
  });
});
