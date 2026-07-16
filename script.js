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

const discordID = "1441307250831396877";

fetch(`https://api.lanyard.rest/v1/users/${discordID}`)
  .then((res) => res.json())

  .then(({ data }) => {

    const user = data.discord_user;

    const avatar = document.getElementById("discord-avatar");

    if (avatar) {
      avatar.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
    }

    const username = document.getElementById("discord-username");

    if (username) {
      username.innerHTML = user.username;
    }


    const status = data.discord_status;

    const dot = document.getElementById("status-dot");
    const text = document.getElementById("status-text");

    const colors = {
      online: "#23a55a",
      idle: "#f0b232",
      dnd: "#f23f42",
      offline: "#747f8d",
    };

    if (dot) {
      dot.style.background = colors[status];
    }

    if (text) {
      text.innerHTML = status.charAt(0).toUpperCase() + status.slice(1);
    }


    const activityBox = document.getElementById("activity");

    const activity = data.activities.find((a) => a.name !== "Spotify");

    if (activityBox) {
      if (activity) {
        activityBox.innerHTML = `

        <div class="activity-title">
          ${activity.name}
        </div>

        <div class="activity-detail">
          ${activity.details || ""}
        </div>

        <div class="activity-detail">
          ${activity.state || ""}
        </div>

        `;
      } else {
        activityBox.innerHTML = `
        <div class="activity-title">
          No activity
        </div>
        `;
      }
    }


    const spotify = document.getElementById("spotify");

    if (spotify) {
      if (data.spotify) {
        spotify.innerHTML = `


        <img src="${data.spotify.album_art_url}">


        <div class="spotify-info">


          <div class="spotify-label">
            LISTENING TO SPOTIFY
          </div>


          <div class="spotify-title">
            ${data.spotify.song}
          </div>


          <div class="spotify-artist">
            ${data.spotify.artist}
          </div>


        </div>


        `;
      } else {
        spotify.innerHTML = `


        <div class="spotify-info">


          <div class="spotify-label">
            SPOTIFY
          </div>


          <div class="spotify-title">
            Not listening
          </div>


          <div class="spotify-artist">
            Nothing playing right now
          </div>


        </div>


        `;
      }
    }
  })

  .catch((error) => {
    console.log("Discord API Error:", error);
  });
