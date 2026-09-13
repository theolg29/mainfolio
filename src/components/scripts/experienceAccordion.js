export function initExperienceAccordion() {
  document.querySelectorAll(".exp-item").forEach((item) => {
    const trigger = item.querySelector(".exp-header");
    trigger?.addEventListener("click", () => {
      const isActive = item.classList.toggle("active");
      trigger.setAttribute("aria-expanded", isActive ? "true" : "false");
    });
  });
}
