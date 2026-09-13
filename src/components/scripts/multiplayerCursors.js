import { insertCoin, onPlayerJoin, myPlayer } from "playroomkit";

const COLORS = [
  "#FF5470",
  "#FF9F40",
  "#FFD93D",
  "#6BCB77",
  "#4D96FF",
  "#9B5DE5",
  "#00BBF9",
  "#F15BB5",
];

function colorForId(id) {
  const sum = id.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return COLORS[sum % COLORS.length];
}

function createCursorEl(color) {
  const el = document.createElement("div");
  el.className = "multiplayer-cursor";
  el.style.setProperty("--cursor-color", color);
  el.innerHTML = `
    <svg width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.5018 1.8333V1.83334L0.5 20.1626C0.5 20.1626 0.5 20.1626 0.5 20.1626C0.500039 21.4568 2.0837 21.9672 2.82778 20.9784L2.82788 20.9783L7.26654 15.0842L7.26706 15.0835C7.48126 14.8001 7.75715 14.5698 8.07394 14.4112C8.39077 14.2525 8.73967 14.1698 9.09361 14.17M0.5018 1.8333L0 20.1626C0 21.9152 2.18153 22.6687 3.22729 21.2791L7.66595 15.385C7.83418 15.1624 8.05039 14.9822 8.29788 14.8582C8.54536 14.7342 8.81751 14.6699 9.0933 14.67H16.1977C17.9256 14.67 18.66 12.4261 17.2776 11.3701L2.88171 0.36666M0.5018 1.8333C0.5018 1.58381 0.570044 1.33986 0.69808 1.12885C0.826071 0.917924 1.00841 0.748728 1.22369 0.639097C1.43887 0.52951 1.67909 0.483403 1.91766 0.505313C2.1562 0.527221 2.38492 0.616392 2.57807 0.763908M0.5018 1.8333L2.57807 0.763908M9.09361 14.17L9.0933 14.6692V14.17H9.09361ZM9.09361 14.17H16.1977C17.4268 14.17 17.9928 12.5456 16.9741 11.7674L16.974 11.7673L2.57818 0.763994L2.88171 0.36666M2.88171 0.36666L2.57807 0.763908M2.88171 0.36666L2.57807 0.763908" fill="var(--cursor-color)" stroke="white"/>
    </svg>
  `;
  return el;
}

export async function initMultiplayerCursors() {
  const gameId = import.meta.env.PUBLIC_PLAYROOM_GAME_ID;
  if (!gameId) return;
  if (window.matchMedia("(pointer: coarse)").matches) return;

  const overlay = document.createElement("div");
  overlay.className = "multiplayer-cursors-overlay";
  document.body.appendChild(overlay);

  const remotePlayers = new Map();
  const lastRenderedKey = new Map();

  try {
    await insertCoin({
      gameId,
      roomCode: "portfolio",
      skipLobby: true,
      maxPlayersPerRoom: 30,
    });
  } catch {
    return;
  }

  if (window.location.hash.startsWith("#r=")) {
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }

  const me = myPlayer();

  const countEl = document.querySelector(".visitor-pill-count");
  const pillEl = document.querySelector(".visitor-pill");
  let visitorCount = 0;

  const updateVisitorCount = () => {
    if (countEl) {
      countEl.textContent = `${visitorCount} visiteur${visitorCount > 1 ? "s" : ""}`;
    }
    if (pillEl) pillEl.classList.add("is-ready");
  };

  onPlayerJoin((player) => {
    visitorCount += 1;
    updateVisitorCount();

    let el = null;
    if (player.id !== me.id) {
      el = createCursorEl(colorForId(player.id));
      overlay.appendChild(el);
      remotePlayers.set(player.id, { player, el });
    }

    player.onQuit(() => {
      visitorCount = Math.max(0, visitorCount - 1);
      updateVisitorCount();
      if (el) {
        el.remove();
        remotePlayers.delete(player.id);
        lastRenderedKey.delete(player.id);
      }
    });
  });

  let pending = null;
  window.addEventListener("pointermove", (event) => {
    // Coordonnées document (et non viewport) : les curseurs restent ancrés au
    // contenu de la page, comme dans Figma, au lieu de suivre le scroll.
    pending = { x: Math.round(event.pageX), y: Math.round(event.pageY) };
  });

  // 20 mises à jour/s suffisent pour un rendu fluide et divisent par 3 le
  // travail (réseau + lecture d'état + écriture DOM) par rapport à un tick
  // par frame (60/s), qui faisait chauffer le CPU sans réel gain visuel.
  const SYNC_INTERVAL = 50;
  let lastSync = 0;

  const tick = (time) => {
    if (time - lastSync >= SYNC_INTERVAL) {
      lastSync = time;

      if (pending) {
        me.setState("cursor", pending, false);
        pending = null;
      }

      remotePlayers.forEach(({ player, el }, id) => {
        const cursor = player.getState("cursor");
        const key = cursor ? `${cursor.x},${cursor.y}` : null;
        if (lastRenderedKey.get(id) === key) return;
        lastRenderedKey.set(id, key);

        if (!cursor) {
          el.style.opacity = "0";
          return;
        }
        el.style.opacity = "1";
        el.style.transform = `translate3d(${cursor.x}px, ${cursor.y}px, 0)`;
      });
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
