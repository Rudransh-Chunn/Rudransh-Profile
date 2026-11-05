const isFinePointer = window.matchMedia("(pointer: fine) and (hover: hover)").matches;
const cursor = document.querySelector(".custom-cursor");

if (isFinePointer && cursor) {
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });

  document.addEventListener("mousedown", () => {
    cursor.classList.add("click");
  });

  document.addEventListener("mouseup", () => {
    cursor.classList.remove("click");
  });

  const interactiveTargets = "a, button, input[type='range'], .discord-profile, .spotify-widget, .start-screen, .avatar-wrapper";
  document.querySelectorAll(interactiveTargets).forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("hovering"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("hovering"));
  });
}

const startScreen = document.querySelector(".start-screen");
const music = document.getElementById("bg-music");
const playBtn = document.getElementById("play-btn");
const muteBtn = document.getElementById("mute-btn");
const volume = document.getElementById("volume");
const card = document.querySelector(".card");
const replayBtn = document.getElementById("replay-btn");

let isStarted = false;
let playing = false;
let muted = false;

if (music) {
  music.volume = 0.5;
}

async function triggerStart() {
  if (isStarted) return;
  isStarted = true;

  if (startScreen) {
    startScreen.classList.add("hide");
  }

  if (card) {
    card.style.animation = "none";

    void card.offsetWidth;
    card.style.animation = "cardOpening 1.1s cubic-bezier(0.16, 1, 0.3, 1) both";
  }

  if (music) {
    try {
      await music.play();
      playing = true;
      if (playBtn) playBtn.innerHTML = "❚❚";
    } catch {

      console.log("Audio autoplay prevented or source unavailable. User can toggle via controls.");
      playing = false;
      if (playBtn) playBtn.innerHTML = "▶";
    }
  }
}

if (startScreen) {
  startScreen.addEventListener("click", triggerStart);
}

if (replayBtn) {
  replayBtn.addEventListener("click", () => {
    if (startScreen) {
      isStarted = false;
      startScreen.classList.remove("hide");
    }
  });
}

if (playBtn && music) {
  playBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    if (playing) {
      music.pause();
      playBtn.innerHTML = "▶";
    } else {
      try {
        await music.play();
        playBtn.innerHTML = "❚❚";
      } catch (err) {
        console.warn("Could not play audio:", err);
      }
    }
    playing = !playing;
  });
}

if (muteBtn && music && volume) {
  muteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    muted = !muted;
    if (muted) {
      music.volume = 0;
      muteBtn.innerHTML = "🔇";
    } else {
      music.volume = parseFloat(volume.value) || 0.5;
      muteBtn.innerHTML = "🔊";
    }
  });
}

if (volume && music && muteBtn) {
  volume.addEventListener("input", (e) => {
    e.stopPropagation();
    const val = parseFloat(volume.value);
    music.volume = val;
    if (val === 0) {
      muteBtn.innerHTML = "🔇";
      muted = true;
    } else {
      muteBtn.innerHTML = "🔊";
      muted = false;
    }
  });
}

if (isFinePointer && card) {
  let isHovered = false;

  card.addEventListener("mouseenter", () => {
    isHovered = true;
  });

  card.addEventListener("mouseleave", () => {
    isHovered = false;
    card.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)";
  });

  window.addEventListener("mousemove", (e) => {
    if (!isHovered || !isStarted) return;
    const rect = card.getBoundingClientRect();
    const cardCenterX = rect.left + rect.width / 2;
    const cardCenterY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - cardCenterX) / (rect.width / 2);
    const deltaY = (e.clientY - cardCenterY) / (rect.height / 2);

    const maxTilt = 4.5;
    const rotateY = (deltaX * maxTilt).toFixed(2);
    const rotateX = (-deltaY * maxTilt).toFixed(2);

    card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.008)`;
  });
}

const canvas = document.getElementById("bg-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 18000), 70);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.radius = Math.random() * 1.8 + 0.8;
      this.alpha = Math.random() * 0.5 + 0.2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(160, 195, 255, ${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function renderParticles() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(130, 170, 255, ${0.15 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(renderParticles);
  }

  renderParticles();

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
}

const discordID = "1441307250831396877";

const statusColors = {
  online: "#23a55a",
  idle: "#f0b232",
  dnd: "#f23f42",
  offline: "#747f8d",
};

function updateDiscordUI(data) {
  if (!data) return;
  const user = data.discord_user;

  const discordAvatar = document.getElementById("discord-avatar");
  if (discordAvatar && user) {
    if (user.avatar) {
      discordAvatar.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`;
    } else {

      const defaultIndex = parseInt(user.discriminator || "0") % 5;
      discordAvatar.src = `https://cdn.discordapp.com/embed/avatars/${defaultIndex}.png`;
    }
  }

  const displayEl = document.getElementById("discord-display");
  if (displayEl && user) {
    displayEl.textContent = user.global_name || user.username || "Rudransh";
  }

  const usernameEl = document.getElementById("discord-username");
  if (usernameEl && user) {
    usernameEl.textContent = "@" + user.username;
  }

  const serverTag = document.getElementById("server-tag");
  if (serverTag) {
    serverTag.textContent = "💎TPH";
  }

  const dot = document.getElementById("status-dot");
  const text = document.getElementById("status-text");
  const status = data.discord_status || "offline";

  if (dot) {
    dot.style.backgroundColor = statusColors[status] || statusColors.offline;
    dot.style.boxShadow = `0 0 12px ${statusColors[status] || statusColors.offline}88`;
  }

  if (text) {
    const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1);
    let customStatus = "";
    if (data.activities && data.activities.length > 0) {
      const customActivity = data.activities.find((a) => a.type === 4);
      if (customActivity && customActivity.state) {
        customStatus = ` · ${customActivity.state}`;
      }
    }
    text.textContent = `${formattedStatus}${customStatus}`;
  }

  const spotify = document.getElementById("spotify");
  if (spotify) {
    if (data.spotify) {
      const albumArt = data.spotify.album_art_url || "https://open.spotify.com/favicon.ico";
      spotify.innerHTML = `
        <div class="spotify-artwork-box">
          <img src="${albumArt}" alt="${escapeHTML(data.spotify.song)}" onerror="this.src='https://open.spotify.com/favicon.ico'" />
          <div class="spotify-icon-badge">
            <svg viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
          </div>
        </div>
        <div class="spotify-info">
          <div class="spotify-header-row">
            <span class="spotify-label">LISTENING ON SPOTIFY</span>
            <div class="equalizer-bars">
              <span></span><span></span><span></span><span></span>
            </div>
          </div>
          <div class="spotify-title" title="${escapeHTML(data.spotify.song)}">${escapeHTML(data.spotify.song)}</div>
          <div class="spotify-artist" title="${escapeHTML(data.spotify.artist)}">${escapeHTML(data.spotify.artist)}</div>
        </div>
      `;
    } else {
      spotify.innerHTML = `
        <div class="spotify-artwork-box" style="display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.06);">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.6;"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
        </div>
        <div class="spotify-info">
          <div class="spotify-label" style="color:rgba(255,255,255,0.5);">SPOTIFY STATUS</div>
          <div class="spotify-title" style="opacity:0.75;font-weight:600;">Not Listening</div>
          <div class="spotify-artist" style="opacity:0.45;">Currently idle</div>
        </div>
      `;
    }
  }
}

function escapeHTML(str) {
  if (!str) return "";
  return str.replace(/[&<>'"]/g, (tag) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  }[tag] || tag));
}

async function fetchDiscordStatus() {
  try {
    const res = await fetch(`https://api.lanyard.rest/v1/users/${discordID}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    if (json && json.data) {
      updateDiscordUI(json.data);
    }
  } catch (err) {
    console.log("Discord API fallback:", err);
  }
}

fetchDiscordStatus();
setInterval(fetchDiscordStatus, 15000);
