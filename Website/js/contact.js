document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#contact-form");
  const status = document.querySelector("#form-status");
  if (!form || !status) return;

  const fields = ["name", "email", "subject", "message"];
  const showError = (field, message) => {
    const input = form.elements.namedItem(field);
    const error = document.querySelector(`#${field}-error`);
    if (input instanceof HTMLElement && error) {
      input.setAttribute("aria-invalid", "true");
      error.textContent = message;
    }
  };

  const clearError = (field) => {
    const input = form.elements.namedItem(field);
    const error = document.querySelector(`#${field}-error`);
    if (input instanceof HTMLElement && error) {
      input.removeAttribute("aria-invalid");
      error.textContent = "";
    }
  };

  form.addEventListener("invalid", (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement || input instanceof HTMLSelectElement || input instanceof HTMLTextAreaElement)) return;
    const field = input.name;
    const message = input.validity.valueMissing
      ? `Please ${field === "name" ? "enter your name" : field === "email" ? "enter your email address" : field === "subject" ? "choose a subject" : "enter a message"}.`
      : field === "email" && input.validity.typeMismatch
        ? "Please enter a valid email address."
        : "Please check this field.";
    showError(field, message);
    status.textContent = "Please review the highlighted fields.";
  }, true);

  fields.forEach((field) => {
    const input = form.elements.namedItem(field);
    if (input) input.addEventListener("input", () => clearError(field));
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    fields.forEach(clearError);
    status.textContent = "";

    const values = Object.fromEntries(new FormData(form).entries());
    let firstInvalid = null;

    if (!String(values.name || "").trim()) showError("name", "Please enter your name.");
    if (!String(values.email || "").trim()) {
      showError("email", "Please enter your email address.");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(values.email))) {
      showError("email", "Please enter a valid email address.");
    }
    if (!String(values.subject || "")) showError("subject", "Please choose a subject.");
    if (!String(values.message || "").trim()) showError("message", "Please enter a message.");

    fields.some((field) => {
      const input = form.elements.namedItem(field);
      if (input instanceof HTMLElement && input.getAttribute("aria-invalid") === "true") {
        firstInvalid = input;
        return true;
      }
      return false;
    });

    if (firstInvalid instanceof HTMLElement) {
      firstInvalid.focus();
      status.textContent = "Please review the highlighted fields.";
      return;
    }

    form.reset();
    status.textContent = "Thank you for reaching out. Your message has been received in this demo.";
  });
});
