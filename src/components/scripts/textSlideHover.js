export function initTextSlideHover() {
  const selector = [
    ".black-button",
    ".white-button",
    ".nav-links a",
    ".showcase-item-link",
    ".exp-link",
    ".toc-back",
    ".project-toc nav a",
    "footer .link",
  ].join(", ");

  document.querySelectorAll(selector).forEach((el) => {
    if (el.dataset.slideInit) return;
    el.dataset.slideInit = "true";

    const textNodes = Array.from(el.childNodes).filter(
      (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim()
    );
    if (!textNodes.length) return;

    textNodes.forEach((node) => {
      const text = node.textContent;
      const wrapper = document.createElement("span");
      wrapper.className = "slide-word";
      wrapper.innerHTML = `<span class="slide-line">${text}</span><span class="slide-line slide-line-clone" aria-hidden="true">${text}</span>`;
      node.replaceWith(wrapper);
    });

    el.classList.add("has-slide-hover");
  });
}
