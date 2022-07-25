let isDown = false;
let x = -1;
const carousel = document.querySelector('.crsl');
carousel.addEventListener('pointerdown', e => {
  isDown = true;
  x = e.clientX;
  carousel.style.cursor = 'grabbing';
});
carousel.addEventListener('pointerup', resetPointer);
carousel.addEventListener('pointerleave', resetPointer);
function resetPointer() {
  isDown = false;
  carousel.style.cursor = 'grab';
}

carousel.addEventListener('pointermove', e => {
  if (!isDown) return;

  e.preventDefault();

  const delta = e.clientX - x;

  if (!isInTransition && Math.abs(delta) > 20) {
    isDown = false;
    carousel.style.cursor = 'grab';
    delta < 0 ? next(true) : prev(true);
  }
});

carousel.addEventListener('touchmove', e => {
  e.preventDefault();
})


let currentIndex = 1;
let otherIndex = 1;
let isInTransition = false;

function prev(delayed) {
  if (isInTransition) return;

  otherIndex = currentIndex - 1;
  if (otherIndex < 1) otherIndex = 4;

  go(delayed);
}

function next(delayed) {
  if (isInTransition) return;

  otherIndex = currentIndex + 1;
  if (otherIndex > 4) otherIndex = 1;

  go(delayed, true);
}

function go(delayed, isNext) {
  isInTransition = true;

  const current = document.querySelector(
    `.crsl .item:nth-child(${currentIndex})`
  );
  const other = document.querySelector(
    `.crsl .item:nth-child(${otherIndex})`
  );

  other.classList.add(isNext ? "right" : "left", "active", "entering", "transition");
  current.classList.add(isNext ? "left" : "right", "transition");

  // to prevent the weird behavior of the chromium browsers when the devtools is open, use this 20 instead
  const delayedTimeout = 0; // 20;
  setTimeout(() => {
    other.classList.add("center");
  }, delayed ? delayedTimeout : 0);

  setTimeout(() => {
    current.classList.remove("left", "right", "active", "transition");
    other.classList.remove("left", "right", "center", "transition", "entering");
    isInTransition = false;
  }, 500);

  currentIndex = otherIndex;
}