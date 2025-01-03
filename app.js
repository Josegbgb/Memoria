let cartas = document.querySelector("#cartas-container");
let contador = 0;
let tiempo;
let par = [];
let btnComenzar = document.getElementById("btn-comenzar");
let intervalo;

let imagenes = [
  { par: 1, img: "img/Tulips.jpg" },
  { par: 2, img: "img/Penguins.jpg" },
  { par: 3, img: "img/Desert.jpg" },
  { par: 4, img: "img/Koala.jpg" },
  { par: 5, img: "img/Apartment.jpg" },
  { par: 6, img: "img/Lighthouse.jpg" },
  { par: 7, img: "img/Jellyfish.jpg" },
  { par: 8, img: "img/Volcano.jpg" },
  { par: 9, img: "img/Lagoon.jpg" },
  { par: 10, img: "img/Temple.jpg" },
];

function mezclar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function crearCarta() {
  let cartasFragmento = document.createDocumentFragment();
  let paresImagenes = [...imagenes, ...imagenes];
  mezclar(paresImagenes);

  paresImagenes.forEach((carta) => {
    let cartaElemento = document.createElement("img");
    cartaElemento.className = "cartas";
    cartaElemento.src = "img/back.jpg";
    cartaElemento.dataset.img = carta.img;

    cartaElemento.addEventListener("click", () => abrir(cartaElemento));
    cartasFragmento.appendChild(cartaElemento);
  });

  cartas.appendChild(cartasFragmento);
}

function comenzar() {
  cartas.style.display = "grid";
  crearCarta();
  btnComenzar.remove();
  temporizador();
}

function abrir(carta) {
  if (contador < 2) {
    if (carta.src.includes("img/back.jpg")) {
      carta.src = carta.dataset.img;
      par.push(carta);
      contador++;

      if (contador === 2) {
        esPar();
      }
    }
  }
}

function esPar() {
  if (par[0].dataset.img === par[1].dataset.img) {
    setTimeout(() => {
      par.forEach((carta) => carta.classList.add("par"));
      verificar();
      contador = 0;
      par = [];
    }, 1000);
  } else {
    setTimeout(() => {
      par.forEach((carta) => (carta.src = "img/back.jpg"));
      contador = 0;
      par = [];
    }, 3000);
  }
}

function verificar() {
  let cartasRestantes = document.querySelectorAll(".cartas:not(.par)");
  if (cartasRestantes.length === 0) {
    guardarTiempo();
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }
}

function guardarTiempo() {
  let tiempoDisplay = document
    .querySelector(".temporizador")
    .textContent.trim();
  let tiempoEnSegundos = convertirTiempo(tiempoDisplay);
  let tiemposGuardados = JSON.parse(localStorage.getItem("tiempo")) || [];

  if (tiemposGuardados.length < 5) {
    tiemposGuardados.push({
      tiempo: tiempoDisplay,
      segundos: tiempoEnSegundos,
    });
    tiemposGuardados.sort((a, b) => a.segundos - b.segundos);
    localStorage.setItem("tiempo", JSON.stringify(tiemposGuardados));
  } else if (tiemposGuardados.length === 5) {
    if (tiemposGuardados[4].segundos > tiempoEnSegundos) {
      tiemposGuardados.pop();
      tiemposGuardados.push({
        tiempo: tiempoDisplay,
        segundos: tiempoEnSegundos,
      });
      tiemposGuardados.sort((a, b) => a.segundos - b.segundos);
      localStorage.setItem("tiempo", JSON.stringify(tiemposGuardados));
    }
  }
}

function convertirTiempo(tiempo) {
  let [minutos, segundos] = tiempo.split(":").map(Number);
  return minutos * 60 + segundos;
}

function temporizador() {
  let tiempoDiv = document.createElement("div");
  tiempoDiv.classList.add("temporizador");
  tiempoDiv.textContent = "00:00";
  document.body.prepend(tiempoDiv);

  let segundos = 0;
  intervalo = setInterval(() => {
    segundos++;
    let minutos = Math.floor(segundos / 60)
      .toString()
      .padStart(2, "0");
    let segundosRestantes = (segundos % 60).toString().padStart(2, "0");
    tiempoDiv.textContent = `${minutos}:${segundosRestantes}`;
  }, 1000);
}

if (localStorage.getItem("tiempo")) {
  let mejoresTiempos = JSON.parse(localStorage.getItem("tiempo"));
  let tiemposDiv = document.createElement("div");
  tiemposDiv.classList.add("tiempos");
  tiemposDiv.innerHTML = `<h2>Mejores Tiempos</h2>`;
  mejoresTiempos.forEach((elemento) => {
    let tiempo = `<h2>${elemento.tiempo}<h2/>`;
    tiemposDiv.innerHTML += tiempo;
  });
  document.body.appendChild(tiemposDiv);
}
