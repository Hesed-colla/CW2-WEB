const gallerySlides = [
  ["assets/images/joyful-community-moments.png", "Friends with and without disabilities smiling together outdoors", "Joyful moments with friends"],
  ["assets/images/extra-activity-moments.jpg", "A young ice skater using a support frame on the ice", "Ice skating with support"],
  ["assets/images/healthy-meal-moments.webp", "A person with Down syndrome preparing to eat with support from a community instructor", "Sharing a mealtime activity"],
  ["assets/images/inclusive-classroom-high-five.jpg", "Children sharing a high-five with their teacher in an inclusive classroom", "High-fives in an inclusive classroom"],
  ["assets/images/shared-community-moments.jpg", "Children using wheelchairs participating together in a group activity", "Shared community moments"],
  ["assets/images/special-connections.jpg", "Two young children sharing a happy conversation", "Special connections"],
  ["assets/images/special-needs-awareness.webp", "A child holding a colorful puzzle-piece heart", "A heart for awareness and inclusion"],
  ["assets/images/sports-moments.jpg", "A basketball player with Down syndrome playing with teammates", "Sports moments"],
  ["assets/images/swimming-moments.jpg", "Children swimming together with an instructor", "Swimming together"]
];

document.addEventListener("DOMContentLoaded", () => {
  const carouselInner = document.querySelector("#galleryCarousel .carousel-inner");
  const indicators = document.querySelector("#galleryCarousel .carousel-indicators");
  if (carouselInner && indicators) {
    gallerySlides.forEach(([src, alt, caption], index) => {
      const slide = document.createElement("div");
      slide.className = `carousel-item${index === 0 ? " active" : ""}`;
      slide.setAttribute("role", "group");
      slide.setAttribute("aria-roledescription", "slide");
      slide.setAttribute("aria-label", `${index + 1} of ${gallerySlides.length}`);

      const button = document.createElement("button");
      button.className = "gallery-item";
      button.type = "button";

      const image = document.createElement("img");
      image.className = "d-block w-100";
      image.src = src;
      image.alt = alt;

      const label = document.createElement("span");
      label.className = "gallery-caption";
      label.textContent = caption;
      button.append(image, label);
      slide.append(button);
      carouselInner.append(slide);

      const indicator = document.createElement("button");
      indicator.type = "button";
      indicator.setAttribute("data-bs-target", "#galleryCarousel");
      indicator.setAttribute("data-bs-slide-to", String(index));
      indicator.setAttribute("aria-label", `Show slide ${index + 1}`);
      if (index === 0) {
        indicator.className = "active";
        indicator.setAttribute("aria-current", "true");
      }
      indicators.append(indicator);
    });
  }

  const dialog = document.querySelector("#lightbox");
  const items = Array.from(document.querySelectorAll(".gallery-item"));
  if (!dialog || !items.length) return;

  const image = dialog.querySelector("img");
  const caption = dialog.querySelector("figcaption");
  const closeButton = dialog.querySelector(".lightbox-close");
  const previousButton = dialog.querySelector(".lightbox-prev");
  const nextButton = dialog.querySelector(".lightbox-next");
  if (!image || !caption || !closeButton || !previousButton || !nextButton) return;

  let activeIndex = 0;
  let previousFocus = null;

  const showItem = (index) => {
    activeIndex = (index + items.length) % items.length;
    const item = items[activeIndex];
    const itemImage = item.querySelector("img");
    const itemCaption = item.querySelector(".gallery-caption");
    if (!itemImage || !itemCaption) return;
    image.src = itemImage.src;
    image.alt = itemImage.alt;
    caption.textContent = itemCaption.textContent;
  };

  const close = () => {
    dialog.hidden = true;
    document.body.style.overflow = "";
    if (previousFocus instanceof HTMLElement) previousFocus.focus();
  };

  items.forEach((item, index) => {
    item.addEventListener("click", () => {
      previousFocus = item;
      showItem(index);
      dialog.hidden = false;
      document.body.style.overflow = "hidden";
      closeButton.focus();
    });
  });

  closeButton.addEventListener("click", close);
  previousButton.addEventListener("click", () => showItem(activeIndex - 1));
  nextButton.addEventListener("click", () => showItem(activeIndex + 1));

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) close();
  });

  dialog.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      close();
      return;
    }

    if (event.key === "ArrowLeft") showItem(activeIndex - 1);
    if (event.key === "ArrowRight") showItem(activeIndex + 1);

    if (event.key === "Tab") {
      const focusable = Array.from(dialog.querySelectorAll("button:not([disabled])"));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
});
