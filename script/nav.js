window.addEventListener('load', () => {
  const navBurger = document.getElementById('navBurger');
  const disableNav = document.getElementById('disableNav');
  let previousX;

  document.body.addEventListener("touchstart", (eve) => {
    const maxRight = (window.innerWidth / 100) * 20;
    let touchobj = eve.changedTouches[0];
    let startX = parseInt(touchobj.clientX);
    previousX = startX;
    let touchendFunction;
    let touchmoveFunction;

    if (startX <= 50) {
      touchmoveFunction = (eve) => {
        if (startX <= 50) {
          touchobj = eve.changedTouches[0];
          let xCoord = parseInt(touchobj.clientX);
          let diff = xCoord - previousX;
          previousX = xCoord;
         
          let nav = document.getElementById('nav');
          let currentPosition = nav.style.right;
          
          if ((parseInt(currentPosition) - diff) >= maxRight) {
            nav.style.right = (parseInt(currentPosition) - diff) + 'px';
          }
        }
      }

      touchendFunction = () => {
        if (startX <= 50) {
          const nav = document.getElementById('nav');
    
          nav.style.transition = 'right 500ms ease-out';
      
          console.log(parseInt(nav.style.right));
          
          if (parseInt(nav.style.right) <= 500) {
            nav.style.right = (window.innerWidth / 100) * 20 + 'px';
            previousX = parseInt(nav.style.right);
            disableNav.style.display = 'block';
          } else {
            nav.style.right = (window.innerWidth / 100) * 101 + 'px';
            previousX = parseInt(nav.style.right);
            disableNav.style.display = 'none';
          }
      
          setTimeout(() => {
            nav.style.transition = 'none';
          }, 510);

          // document.body.removeEventListener('touchmove', touchmoveFunction);
        }
      }

      document.body.addEventListener('touchmove', (eve) => {
        touchmoveFunction(eve);
      });

      document.body.addEventListener("touchend", touchendFunction);
    } else {
      console.log('startX bigger than 50');
    }
  });

  navBurger.addEventListener('touchstart', () => {
    setTimeout(() => {
      nav.style.transition = 'right 500ms ease-out';

      if (nav.style.right === (window.innerWidth / 100) * 20 + 'px') {
        nav.style.right = (window.innerWidth / 100) * 101 + 'px';
        previousX = parseInt(nav.style.right);
        disableNav.style.display = 'none';
      } else {
        nav.style.right = (window.innerWidth / 100) * 20 + 'px';
        previousX = parseInt(nav.style.right);
        disableNav.style.display = 'block';
      }
  
      setTimeout(() => {
        nav.style.transition = 'none';
      }, 510);
    }, 100);
  });

  disableNav.addEventListener('touchstart', () => {
    setTimeout(() => {
      nav.style.transition = 'right 500ms ease-in-out';

      if (document.getElementById('nav').style.right === (window.innerWidth / 100) * 20 + 'px') {
        nav.style.right = (window.innerWidth / 100) * 101 + 'px';
        previousX = parseInt(nav.style.right);
        disableNav.style.display = 'none';
      }

      setTimeout(() => {
        nav.style.transition = 'none';
      }, 510);
    }, 100);
  });
});