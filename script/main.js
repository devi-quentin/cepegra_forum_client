const urlAPI = "http://localhost:8888/cepegra_forum/";

const ticketsListHTML = document.querySelector("#tickets-list");
const textLogin = document.querySelector("#textLogin");
const formLogin = document.querySelector("#formLogin");
const login = document.querySelector("#login");
const password = document.querySelector("#password");
const loginPseudo = document.querySelector(".loginPseudo");

const init = () => {
  // Affichage des tickets
  displayTickets();

  // Vérification si connecté
  if (localStorage.token != undefined) {
    connected(localStorage.token);
  }
};

const displayTickets = () => {
  let tmp = "";
  fetch(urlAPI + "tickets")
    .then((response) => response.json())
    .then((response) => {
      response.data.forEach((data) => {
        if (data.title != null) {
          tmp += `
            <div onclick="openTicket(${data.id})" class="border border-2 mb-5 p-2 rounded cursor-pointer" data-id="${data.id}">
              <div>
                <span class="mr-2 text-slate-400">#${data.id}</span><span class="font-bold">${data.title}</span> par ${data.author}
              </div>
              <div class="mt-5">
                ${data.content.substring(0, 50) + "..."}
              </div>
            </div>
          `;

          ticketsListHTML.innerHTML = tmp;
        }
      });
    })
    .catch((error) => console.error(error));
};

const openTicket = (id) => {
  // Affichage du ticket
  fetch(urlAPI + "tickets/" + id)
    .then((response) => response.json())
    .then((response) => {
      response.data.forEach((data) => {
        let tmp = `
          <div class="border border-2 mb-5 p-2 rounded cursor-pointer">
            <div>
              <span class="mr-2 text-slate-400">#${data.id}</span>${data.title} par ${data.id_user}
            </div>
            <div class="mt-5">
              ${data.content}
            </div>
          </div>
        `;

        ticketsListHTML.innerHTML = tmp;
      });
    });

  // Affichage des réponses
  fetch(urlAPI + "tickets")
    .then((response) => response.json())
    .then((response) => {
      response.data.forEach((data) => {
        if (data.id_ticket == id) {
          let tmp = `
            <div class="border border-2 mb-5 p-2 rounded cursor-pointer">
              ${data.content}
            </div>
          `;

          ticketsListHTML.innerHTML += tmp;
        }
      });
    });
};

formLogin.addEventListener("submit", (e) => {
  e.preventDefault();

  let data = {
    login: login.value,
    password: password.value,
  };

  fetch(urlAPI + "auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      if (response.ok) connected(response.token);
    });
});

const connected = (token) => {
  formLogin.classList.toggle("hidden");
  textLogin.classList.toggle("hidden");

  localStorage.setItem("token", token);
};

init();
