let currentIndex = 1;
let nextIndex = 1;
let isInTransition = false;

function prev() {
  if (isInTransition) return;

  nextIndex = currentIndex - 1;
  if (nextIndex < 1) nextIndex = 4;

  go();
}

function next() {
  if (isInTransition) return;

  nextIndex = currentIndex + 1;
  if (nextIndex > 4) nextIndex = 1;

  go(true);
}

function go(isNext) {
  isInTransition = true;

  const current = document.querySelector(
    `.crsl .item:nth-child(${currentIndex})`
  );
  const other = document.querySelector(
    `.crsl .item:nth-child(${nextIndex})`
  );

  other.classList.add(isNext ? "right" : "left", "active", "entering");
  current.classList.add(isNext ? "left" : "right", "transition");

  setTimeout(() => {
    other.classList.add("transition", "center");
  });

  setTimeout(() => {
    current.classList.remove("left", "right", "active", "transition");
    other.classList.remove("left", "right", "center", "transition", "entering");
    isInTransition = false;
  }, 500);

  currentIndex = nextIndex;
}