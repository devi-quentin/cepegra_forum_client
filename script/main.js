const urlAPI = "http://localhost/cepegra_forum_api/";

const chemin = document.querySelector("#chemin");
const ticketsListHTML = document.querySelector("#tickets-list");
const textLogin = document.querySelector("#textLogin");
const formLogin = document.querySelector("#formLogin");
const login = document.querySelector("#login");
const password = document.querySelector("#password");
const logout = document.querySelector("#logout");
const loginPseudo = document.querySelector(".loginPseudo");
const addTicketBox = document.querySelector("#addTicketBox");
const addTicketForm = document.querySelector("#addTicketForm");
const addTicketBoxTitle = document.querySelector("#addTicketBoxTitle");
const newTicketTitle = document.querySelector("#newTicketTitle");
const newTicketContent = document.querySelector("#newTicketContent");
const idTicket = document.querySelector("#idTicket");


const init = () => {
  // Affichage des tickets
  displayTickets();

  // Vérification si connecté
  checkConnected(localStorage.token)
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
          <div class="border border-2 mb-5 p-2 rounded">
            <div>
              <span class="mr-2 text-slate-400">#${data.id}</span><span class="font-bold">${data.title}</span> par ${data.author}
            </div>
            <div class="mt-5">
              ${data.content}
            </div>
          </div>
        `;

        ticketsListHTML.innerHTML = tmp;
        chemin.innerHTML = "Accueil - " + data.title
        idTicket.value = data.id
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

    // MODIFICATION DU FORMULAIRE
    addTicketBoxTitle.innerHTML = "Répondre à ce ticket";
    newTicketTitle.classList.add("hidden");
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
      if (response.ok) checkConnected(response.token);
    });
});

addTicketForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let data = {
    title: newTicketTitle.value,
    content: newTicketContent.value,
    id_ticket: idTicket.value,
  };

  console.log(data)

  fetch(urlAPI + "tickets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
    });
});

// DECONNEXION
logout.addEventListener("click", (e) => {
  localStorage.removeItem("token");
  location.reload();
})


const checkConnected = (token) => {
  if (token != undefined) {
    // formulaire de connecxion
    formLogin.classList.toggle("hidden");
    textLogin.classList.toggle("hidden");

    // Box ajout ticket
    addTicketBox.classList.toggle("hidden");

    localStorage.setItem("token", token);
  }
}

init();
