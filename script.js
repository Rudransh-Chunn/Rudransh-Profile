const cursor = document.querySelector(".custom-cursor");
document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});
document.addEventListener("mousedown", () => {
  cursor.classList.add("click");
});
document.addEventListener("mouseup", () => {
  cursor.classList.remove("click");
});

const startScreen = document.querySelector(".start-screen");
startScreen.addEventListener("click", () => {
  startScreen.classList.add("hide");
});

const music = document.getElementById("bg-music");
const playBtn = document.getElementById("play-btn");
const muteBtn = document.getElementById("mute-btn");
const volume = document.getElementById("volume");

let playing = false;
let muted = false;

music.volume = 0.5;

startScreen.addEventListener("click", async () => {
  await music.play();
  playing = true;
  playBtn.innerHTML = "❚❚";
});

playBtn.addEventListener("click", () => {
  if (playing) {
    music.pause();
    playBtn.innerHTML = "▶";
  } else {
    music.play();
    playBtn.innerHTML = "❚❚";
  }

  playing = !playing;
});

muteBtn.addEventListener("click", () => {
  muted = !muted;

  if (muted) {
    music.volume = 0;
    muteBtn.innerHTML = "🔇";
  } else {
    music.volume = volume.value;
    muteBtn.innerHTML = "🔊";
  }
});

volume.addEventListener("input", () => {
  music.volume = volume.value;

  if (volume.value == 0) {
    muteBtn.innerHTML = "🔇";
  } else {
    muteBtn.innerHTML = "🔊";
  }
});

const discordID = "1441307250831396877";

fetch(`https://api.lanyard.rest/v1/users/${discordID}`)
  .then((res) => res.json())
  .then(({ data }) => {
    const user = data.discord_user;

    document.getElementById("discord-avatar").src =
      `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;

    document.getElementById("discord-display").innerHTML =
      user.global_name || user.username;

    document.getElementById("discord-username").innerHTML = "@" + user.username;

    document.getElementById("server-tag").innerHTML = "💎TPH";

    const dot = document.getElementById("status-dot");
    const text = document.getElementById("status-text");

    const statusColors = {
      online: "#23a55a",
      idle: "#f0b232",
      dnd: "#f23f42",
      offline: "#747f8d",
    };

    const status = data.discord_status || "offline";

    dot.style.background = statusColors[status];

    text.innerHTML = status.charAt(0).toUpperCase() + status.slice(1);

    const spotify = document.getElementById("spotify");

    if (spotify) {
      if (data.spotify) {
        spotify.innerHTML = `
<img src="${data.spotify.album_art_url}">
<div class="spotify-info">
<div class="spotify-label">LISTENING TO SPOTIFY</div>
<div class="spotify-title">${data.spotify.song}</div>
<div class="spotify-artist">${data.spotify.artist}</div>
</div>
`;
      } else {
        spotify.innerHTML = `
<div class="spotify-info">
<div class="spotify-label">SPOTIFY</div>
<div class="spotify-title">Not listening</div>
<div class="spotify-artist">Nothing playing right now</div>
</div>
`;
      }
    }
  })
  .catch((error) => {
    console.log("Discord API Error:", error);
  });
