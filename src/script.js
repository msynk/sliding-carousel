const carousel = document.querySelector('.crsl');
const items = [].slice.call(carousel.children);
const itemsCount = items.length;

const showCount = 7;
const scrollCount = 5;
const transitionTime = 0.5;

let currentIndices = [];
let otherIndices = [];

init()

function init() {
  currentIndices = Array(showCount).fill().map((_, i) => i);
  otherIndices = Array(scrollCount).fill().map((_, i) => i);

  const { width, height } = carousel.getBoundingClientRect();
  items.forEach((item, i) => {
    item.style.height = `${height}px`;
    item.style.width = `${width / showCount}px`;
    item.style.transform = `translateX(${100 * i}%)`;
    item.classList.add('item');
  });
}

function prev(delayed) {
  otherIndices = otherIndices.map((_, i) => {
    let idx = currentIndices[0] - (i + 1);
    if (idx < 0) idx = itemsCount + idx;
    return idx;
  }).reverse();

  go(delayed);
}

function next(delayed) {
  otherIndices = otherIndices.map((_, i) => {
    let idx = currentIndices[showCount - 1] + (i + 1);
    if (idx > itemsCount - 1) idx = idx - itemsCount;
    return idx;
  });

  go(delayed, true);
}

function go(delayed, isNext) {
  const diff = showCount - scrollCount
  const newIndices = isNext
    ? [...(diff === 0 ? [] : currentIndices.slice(-diff)), ...otherIndices]
    : [...otherIndices, ...currentIndices.slice(0, diff)];

  const currents = currentIndices.map(i => items[i]);
  const others = otherIndices.map(i => items[i]);

  let sign = isNext ? 1 : -1;
  let offset = isNext ? showCount : scrollCount;
  others.forEach((o, i) => {
    o.style.transition = '';
    o.style.transform = `translateX(${sign * 100 * (offset + (sign * i))}%)`;
  });


  // to prevent the weird behavior of the chromium browsers when the devtools is open, use this 20 instead
  const delayedTimeout = 0; // 20;
  sign *= -1;
  offset = isNext ? showCount - scrollCount : 0;
  setTimeout(() => {
    others.forEach((o, i) => (o.style.transform = `translateX(${100 * (offset + i)}%)`, o.style.transition = `all ${transitionTime}s`));
    currents.forEach((c, i) => (c.style.transform = `translateX(${sign * 100 * (scrollCount + (sign * i))}%)`, c.style.transition = `all ${transitionTime}s`));
  }, delayed ? delayedTimeout : 0);

  currentIndices = newIndices;
}

// ============================================================================

let x = -1;
let isDown = false;
carousel.addEventListener('pointermove', pointerMove);
carousel.addEventListener('pointerdown', pointerDown);
carousel.addEventListener('pointerleave', pointerUp);
carousel.addEventListener('pointerup', pointerUp);
carousel.addEventListener('touchmove', e => e.preventDefault())

function pointerMove(e) {
  if (!isDown) return;

  e.preventDefault();

  const delta = e.clientX - x;

  if (Math.abs(delta) > 20) {
    isDown = false;
    carousel.style.cursor = '';
    delta < 0 ? next(true) : prev(true);
  }
}
function pointerDown(e) {
  isDown = true;
  x = e.clientX;
  carousel.style.cursor = 'grabbing';
}
function pointerUp() {
  isDown = false;
  carousel.style.cursor = '';
}