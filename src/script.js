let x = -1;
let isDown = false;
const carousel = document.querySelector('.crsl');
const items = [].slice.call(carousel.children);
const itemsCount = items.length;

const showCount = 4;
const scrollCount = 2;

const transitionTime = 0.5;

let currentIndices = [];
let otherIndices = [];
let isInTransition = false;

currentIndices = Array(showCount).fill().map((_, i) => i);
otherIndices = Array(scrollCount).fill().map((_, i) => i);

items.forEach(it => carousel.removeChild(it));
currentIndices.forEach(i => carousel.appendChild(items[i]));

function prev(delayed) {
  if (isInTransition) return;

  otherIndices = otherIndices.map((_, i) => {
    let idx = currentIndices[0] - (i + 1);
    if (idx < 0) idx = itemsCount + idx;
    return idx;
  }).reverse();

  go(delayed);
}

function next(delayed) {
  if (isInTransition) return;

  otherIndices = otherIndices.map((_, i) => {
    let idx = currentIndices[showCount - 1] + (i + 1);
    if (idx > itemsCount - 1) idx = idx - itemsCount;
    return idx;
  });

  go(delayed, true);
}

function go(delayed, isNext) {
  isInTransition = true;
  const newIndices = isNext
    ? [...currentIndices.slice(scrollCount - currentIndices.length), ...otherIndices]
    : [...otherIndices, ...currentIndices.slice(0, currentIndices.length - scrollCount)];

  const currents = currentIndices.map(i => items[i]);
  const others = otherIndices.map(i => items[i]);
  const news = newIndices.map(i => items[i]);

  const { width, height } = currents[0].getBoundingClientRect();
  carousel.style.height = `${height}px`;
  let sign = isNext ? 1 : -1;
  let offset = isNext ? showCount : scrollCount;
  others.forEach((o, i) => {
    o.style.width = `${width}px`;
    o.style.transform = `translateX(${sign * 100 * (offset + (sign * i))}%)`;
    o.style.transition = `all ${transitionTime}s`;
    o.classList.add("absolute")
  });
  others.forEach(o => carousel.appendChild(o));

  sign *= -1;
  currents.forEach((c, i) => {
    c.style.width = `${width}px`;
    c.style.transform = `translateX(${100 * i}%)`;
    c.classList.add("absolute");
  });

  // to prevent the weird behavior of the chromium browsers when the devtools is open, use this 20 instead
  const delayedTimeout = 0; // 20;
  offset = isNext ? showCount - scrollCount : 0;
  setTimeout(() => {
    others.forEach((o, i) => o.style.transform = `translateX(${100 * (offset + i)}%)`);
    currents.forEach((c, i) => (c.style.transition = `all ${transitionTime}s`, c.style.transform = `translateX(${sign * 100 * (scrollCount + (sign * i))}%)`));
  }, delayed ? delayedTimeout : 0);

  setTimeout(() => {
    currents.forEach(c => (c.style.transform = '', c.style.transition = '', c.classList.remove("absolute"), carousel.removeChild(c)));
    news.forEach(n => (n.style.width = '', n.style.transform = '', n.style.transition = '', n.classList.remove("absolute"), carousel.appendChild(n)));
    carousel.style.height = '';

    isInTransition = false;
  }, transitionTime * 1000);

  currentIndices = newIndices;
}





carousel.addEventListener('pointerdown', e => {
  isDown = true;
  x = e.clientX;
  carousel.style.cursor = 'grabbing';
});
carousel.addEventListener('pointerup', resetPointer);
carousel.addEventListener('pointerleave', resetPointer);
function resetPointer() {
  isDown = false;
  carousel.style.cursor = '';
}
carousel.addEventListener('pointermove', e => {
  if (!isDown) return;

  e.preventDefault();

  const delta = e.clientX - x;

  if (!isInTransition && Math.abs(delta) > 20) {
    isDown = false;
    carousel.style.cursor = '';
    delta < 0 ? next(true) : prev(true);
  }
});
carousel.addEventListener('touchmove', e => {
  e.preventDefault();
})
