document.addEventListener("DOMContentLoaded", () => {
  const questions = document.querySelectorAll(".faq-question");
  if (!questions.length) return;

  const closeQuestion = (button) => {
    const panel = document.getElementById(button.getAttribute("aria-controls"));
    button.setAttribute("aria-expanded", "false");
    if (panel) panel.hidden = true;
  };

  questions.forEach((button) => {
    const panel = document.getElementById(button.getAttribute("aria-controls"));
    if (!panel) return;

    button.addEventListener("click", () => {
      const willOpen = button.getAttribute("aria-expanded") !== "true";
      questions.forEach((other) => {
        if (other !== button) closeQuestion(other);
      });
      button.setAttribute("aria-expanded", String(willOpen));
      panel.hidden = !willOpen;
    });

  });

  const list = document.querySelector(".faq-list");
  if (list) {
    list.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      const openQuestion = Array.from(questions).find((button) => button.getAttribute("aria-expanded") === "true");
      if (openQuestion) {
        closeQuestion(openQuestion);
        openQuestion.focus();
      }
    });
  }
});
