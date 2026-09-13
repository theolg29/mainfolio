# Toolbar multijoueur (stickers/texte/formes) — archivé

Retiré du site le 2026-07-30 pour ne garder que les curseurs multijoueurs (trop
de complexité/perf pour la valeur apportée sur un portfolio). Le code
ci-dessous fonctionnait et peut être réintégré tel quel si besoin plus tard.

## Principe

Réutilise la même connexion Playroom Kit que les curseurs (un seul
`insertCoin`). Chaque outil (texte, carré, étoile, cœur, flèche, emoji) se
place en cliquant-maintenant sur la page : le déplacement de la souris pendant
le clic ajuste la taille et la rotation en direct (aperçu local), et au
relâchement l'objet final est diffusé à tout le monde via
`RPC.call('placeObject', ..., RPC.Mode.ALL)`. Chaque client gère lui-même un
timer local pour faire disparaître l'objet après 5s (fade + shrink), sans
aucun état persistant côté serveur.

## Markup (dans `MainLayout.astro`, à l'intérieur de `<body>`)

```html
<div class="multiplayer-toolbar">
  <button class="mp-tool" data-tool="text" aria-label="Ajouter du texte"
    >Aa</button
  >
  <button class="mp-tool" data-tool="square" aria-label="Ajouter un carré">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="14" height="14" rx="3" fill="currentColor" />
    </svg>
  </button>
  <button class="mp-tool" data-tool="star" aria-label="Ajouter une étoile">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2l2.9 6.9L22 9.6l-5.5 5 1.6 7.4L12 18.3 5.9 22l1.6-7.4L2 9.6l7.1-.7L12 2z"
        fill="currentColor"
      />
    </svg>
  </button>
  <button class="mp-tool" data-tool="heart" aria-label="Ajouter un cœur">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21s-7.5-4.6-10-9.3C.4 8.4 2 4.8 5.4 4c2-.5 4 .3 5.1 2 .1.1.2.1.3 0 1.1-1.7 3.1-2.5 5.1-2 3.4.8 5 4.4 3.4 7.7C19.5 16.4 12 21 12 21z"
        fill="currentColor"
      />
    </svg>
  </button>
  <button class="mp-tool" data-tool="arrow" aria-label="Ajouter une flèche">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 19L19 5M19 5H9M19 5v10"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </button>
  <div class="mp-emoji-wrap">
    <button class="mp-tool" data-tool="emoji" aria-label="Ajouter un emoji">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2.5" />
        <path
          d="M8 14c1 1.5 2.5 2.3 4 2.3s3-.8 4-2.3"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
        />
        <circle cx="9" cy="9.5" r="1.2" fill="currentColor" />
        <circle cx="15" cy="9.5" r="1.2" fill="currentColor" />
      </svg>
    </button>
    <div class="mp-emoji-popover">
      <button class="mp-emoji-option" data-emoji="👍">👍</button>
      <button class="mp-emoji-option" data-emoji="❤️">❤️</button>
      <button class="mp-emoji-option" data-emoji="😂">😂</button>
      <button class="mp-emoji-option" data-emoji="🎉">🎉</button>
      <button class="mp-emoji-option" data-emoji="🔥">🔥</button>
      <button class="mp-emoji-option" data-emoji="😮">😮</button>
    </div>
  </div>
</div>
```

## CSS (`src/styles/_globals.scss`)

```scss
.multiplayer-toolbar {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px;
  border-radius: 999px;
  background-color: vars.$white;
  box-shadow: vars.$shadow-soft;
}

.mp-tool {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background-color: #efefef;
  color: vars.$black;
  cursor: pointer;
  font-family: vars.$dmsans;
  font-weight: 600;
  font-size: 14px;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    background-color: #e2e2e2;
  }

  &.active {
    background-color: vars.$black;
    color: vars.$white;
  }
}

.mp-text-input {
  position: absolute;
  z-index: 10000;
  transform: translate(-50%, -50%);
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid vars.$border-stroke;
  background-color: vars.$white;
  font-family: vars.$dmsans;
  font-size: 13px;
  outline: none;
  box-shadow: vars.$shadow-soft;
  max-width: 200px;
}

.mp-object {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 9998;
  opacity: 0;
  --mp-rotate: 0deg;
  --mp-scale: 0.4;
  transform: translate(-50%, -50%) rotate(var(--mp-rotate)) scale(var(--mp-scale));
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;

  &.is-in {
    opacity: 1;
    --mp-scale: 1;
  }

  &.is-out {
    opacity: 0;
    --mp-scale: 0.6;
  }
}

.mp-object--text {
  background-color: var(--mp-color);
  color: vars.$white;
  padding: 6px 12px;
  border-radius: 999px;
  font-family: vars.$dmsans;
  font-size: var(--mp-size, 13px);
  font-weight: 500;
  white-space: nowrap;
}

.mp-object--square {
  width: var(--mp-size, 28px);
  height: var(--mp-size, 28px);
  background-color: var(--mp-color);
  border-radius: 6px;
}

.mp-object--star,
.mp-object--heart,
.mp-object--arrow {
  width: var(--mp-size, 28px);
  height: var(--mp-size, 28px);
  color: var(--mp-color);

  svg {
    width: 100%;
    height: 100%;
  }
}

.mp-object--emoji {
  font-size: var(--mp-size, 28px);
  line-height: 1;
  color: vars.$black;
}

.mp-emoji-wrap {
  position: relative;
}

.mp-emoji-popover {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%) translateY(6px);
  display: flex;
  gap: 4px;
  padding: 6px;
  border-radius: 999px;
  background-color: vars.$white;
  box-shadow: vars.$shadow-soft;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease;

  &.is-open {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transform: translateX(-50%) translateY(0);
  }
}

.mp-emoji-option {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background-color: #efefef;
  color: vars.$black;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.15s ease;

  &:hover {
    background-color: #e2e2e2;
    transform: scale(1.1);
  }
}
```

## JS (fonctions à réintégrer dans `src/components/scripts/multiplayerCursors.js`)

Imports nécessaires : `RPC` en plus de `insertCoin, onPlayerJoin, myPlayer`.

```js
const OBJECT_LIFETIME = 5000;
const OBJECT_FADE = 300;

const STICKER_ICONS = {
  star: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 2l2.9 6.9L22 9.6l-5.5 5 1.6 7.4L12 18.3 5.9 22l1.6-7.4L2 9.6l7.1-.7L12 2z" fill="currentColor"/></svg>`,
  heart: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 21s-7.5-4.6-10-9.3C.4 8.4 2 4.8 5.4 4c2-.5 4 .3 5.1 2 .1.1.2.1.3 0 1.1-1.7 3.1-2.5 5.1-2 3.4.8 5 4.4 3.4 7.7C19.5 16.4 12 21 12 21z" fill="currentColor"/></svg>`,
  arrow: `<svg viewBox="0 0 24 24" fill="none"><path d="M5 19L19 5M19 5H9M19 5v10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

function createObjectEl(type, color, content, size, rotation) {
  const el = document.createElement("div");
  el.className = `mp-object mp-object--${type}`;
  el.style.setProperty("--mp-color", color);
  if (rotation) el.style.setProperty("--mp-rotate", `${rotation}deg`);
  if (size) el.style.setProperty("--mp-size", `${size}px`);

  if (type === "text" || type === "emoji") {
    el.textContent = content;
  } else if (STICKER_ICONS[type]) {
    el.innerHTML = STICKER_ICONS[type];
  }
  return el;
}

function placeObject(overlay, { type, x, y, content, color, size, rotation }) {
  const el = createObjectEl(type, color, content, size, rotation);
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  overlay.appendChild(el);

  requestAnimationFrame(() => el.classList.add("is-in"));

  setTimeout(() => {
    el.classList.remove("is-in");
    el.classList.add("is-out");
    setTimeout(() => el.remove(), OBJECT_FADE);
  }, OBJECT_LIFETIME);
}

function openTextInput(x, y, color, onSubmit) {
  const input = document.createElement("input");
  input.type = "text";
  input.maxLength = 30;
  input.className = "mp-text-input";
  input.style.left = `${x}px`;
  input.style.top = `${y}px`;
  document.body.appendChild(input);
  input.focus();

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") input.blur();
    if (event.key === "Escape") {
      input.value = "";
      input.blur();
    }
  });

  input.addEventListener(
    "blur",
    () => {
      const value = input.value.trim().slice(0, 30);
      input.remove();
      if (value) onSubmit(value);
    },
    { once: true }
  );
}

function computeDragSizeRotation(startX, startY, event) {
  const dx = event.pageX - startX;
  const dy = event.pageY - startY;
  const distance = Math.hypot(dx, dy);
  const size = Math.max(20, Math.min(160, distance * 1.6 || 28));
  const rotation = distance > 4 ? Math.atan2(dy, dx) * (180 / Math.PI) : 0;
  return { size, rotation };
}

function startObjectDrag(event, overlay, type, color, content, onDone) {
  const startX = event.pageX;
  const startY = event.pageY;

  const preview = createObjectEl(type, color, content);
  preview.style.left = `${startX}px`;
  preview.style.top = `${startY}px`;
  preview.classList.add("is-in");
  overlay.appendChild(preview);

  // Throttle via rAF : un mousemove brut peut dépasser 60 events/s.
  let latestMoveEvent = null;
  let rafId = null;

  const applyMove = () => {
    rafId = null;
    if (!latestMoveEvent) return;
    const { size, rotation } = computeDragSizeRotation(startX, startY, latestMoveEvent);
    preview.style.setProperty("--mp-size", `${size}px`);
    preview.style.setProperty("--mp-rotate", `${rotation}deg`);
  };

  const onMove = (moveEvent) => {
    latestMoveEvent = moveEvent;
    if (rafId === null) rafId = requestAnimationFrame(applyMove);
  };

  const onUp = (upEvent) => {
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseup", onUp);
    if (rafId !== null) cancelAnimationFrame(rafId);

    const { size, rotation } = computeDragSizeRotation(startX, startY, upEvent);
    preview.remove();
    onDone({ x: startX, y: startY, size, rotation });
  };

  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onUp);
}

function initToolbar(overlay, me) {
  const toolbar = document.querySelector(".multiplayer-toolbar");
  if (!toolbar) return;

  const buttons = Array.from(toolbar.querySelectorAll(".mp-tool"));
  const emojiButton = toolbar.querySelector('[data-tool="emoji"]');
  const emojiPopover = toolbar.querySelector(".mp-emoji-popover");
  let selectedTool = null;
  let selectedContent = null;

  const clearSelection = () => {
    selectedTool = null;
    selectedContent = null;
    buttons.forEach((b) => b.classList.remove("active"));
    emojiPopover?.classList.remove("is-open");
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      const tool = btn.dataset.tool;

      if (tool === "emoji") {
        const wasOpen = emojiPopover?.classList.contains("is-open");
        clearSelection();
        if (!wasOpen) emojiPopover?.classList.add("is-open");
        return;
      }

      const next = selectedTool === tool ? null : tool;
      clearSelection();
      selectedTool = next;
      if (next) btn.classList.add("active");
    });
  });

  emojiPopover?.querySelectorAll(".mp-emoji-option").forEach((opt) => {
    opt.addEventListener("click", (event) => {
      event.stopPropagation();
      selectedTool = "emoji";
      selectedContent = opt.dataset.emoji;
      emojiPopover.classList.remove("is-open");
      emojiButton?.classList.add("active");
    });
  });

  window.addEventListener("mousedown", (event) => {
    if (!selectedTool || event.target.closest(".multiplayer-toolbar")) return;
    event.preventDefault();

    const tool = selectedTool;
    const content = selectedContent;
    const color = colorForId(me.id);
    clearSelection();

    startObjectDrag(event, overlay, tool, color, tool === "emoji" ? content : null, ({ x, y, size, rotation }) => {
      if (tool === "text") {
        openTextInput(x, y, color, (value) => {
          RPC.call(
            "placeObject",
            { type: "text", x, y, color, content: value, size, rotation },
            RPC.Mode.ALL
          );
        });
      } else if (tool === "emoji") {
        RPC.call("placeObject", { type: "emoji", x, y, color, content, size, rotation }, RPC.Mode.ALL);
      } else {
        RPC.call("placeObject", { type: tool, x, y, color, size, rotation }, RPC.Mode.ALL);
      }
    });
  });

  RPC.register("placeObject", async (data) => {
    placeObject(overlay, data);
    return "ok";
  });
}
```

Et dans `initMultiplayerCursors()`, juste après `const me = myPlayer();` :

```js
initToolbar(overlay, me);
```

## Pourquoi retiré

- Palette d'outils (carré/texte/stickers/emoji) jugée gadget à faible valeur
  pour un portfolio pro, comparée aux curseurs (qui reprennent l'inspiration
  initiale de recent.design).
- Complexité de code supplémentaire (drag, RPC, popover) pour un bénéfice
  visiteur limité.
- Note perf : ce n'était pas la source principale du lag/surchauffe rapportée
  (ça, c'était la boucle de sync des curseurs à 60fps, corrigée séparément à
  20fps + diff des positions). La toolbar ne coûte quasi rien au repos,
  seulement pendant une interaction active.
