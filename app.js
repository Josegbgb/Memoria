//variables globales
let cartas = document.querySelector("#cartas-container");
let contador = 0;
let tiempo;
let par = [];
let btnComenzar = document.getElementById("btn-comenzar");
let btnReiniciar = document.getElementById("btn-reiniciar");
let btnDetener = document.getElementById("btn-detener");
let btnLimpiar = document.getElementById("limpiarMarcador");
let intervalo;

//array con la direccion de las imagenes para el juego
let imagenes = [
  { img: "img/Tulips.jpg" },
  { img: "img/Penguins.jpg" },
  { img: "img/Desert.jpg" },
  { img: "img/Koala.jpg" },
  { img: "img/Apartment.jpg" },
  { img: "img/Lighthouse.jpg" },
  { img: "img/Jellyfish.jpg" },
  { img: "img/Volcano.jpg" },
  { img: "img/Lagoon.jpg" },
  { img: "img/Temple.jpg" },
];
// Pre-cargar imágenes
imagenes.forEach((imagen) => {
  const img = new Image();
  img.src = imagen.img;
});

//funcion para mezclar
function mezclar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

//Se duplican las imagenes en un nuevo array para luego mezclar
function crearCarta() {
  let cartasFragmento = document.createDocumentFragment();
  let paresImagenes = [...imagenes, ...imagenes];
  mezclar(paresImagenes);
  //por cada carta se creara un div donde se le asignara el dataset.img con el valor de img del array anterior
  paresImagenes.forEach((carta) => {
    let cartaElemento = document.createElement("div");
    cartaElemento.className = "cartas";
    cartaElemento.dataset.img = carta.img;
    //un evento para que cada tenga onclick y llame a la funcion abrir y posteriormete se insetan en el contenedor de artaElemento
    cartaElemento.addEventListener("click", () => abrir(cartaElemento));
    cartasFragmento.appendChild(cartaElemento);
  });

  cartas.appendChild(cartasFragmento);
}
//funciones comenzar, detener y reiniciar para ocultar, mostrar botones y el contenedor
function comenzar() {
  cartas.style.display = "grid";
  crearCarta();
  btnComenzar.style.display = "none";
  temporizador();
  btnReiniciar.style.display = "block";
  btnDetener.style.display = "block";
  btnLimpiar.style.display = "none";
}
function detener() {
  cartas.style.display = "none";
  clearInterval(intervalo);
  document.querySelector(".temporizador").remove();
  cartas.innerHTML = ``;
  btnReiniciar.style.display = "none";
  btnDetener.style.display = "none";
  btnComenzar.style.display = "block";
  btnLimpiar.style.display = "block";
  par = [];
  contador = 0;
}
function reiniciar() {
  clearInterval(intervalo);
  document.querySelector(".temporizador").remove();
  par = [];
  contador = 0;
  cartas.innerHTML = ``;
  crearCarta();
  temporizador();
}
//valida que no haya mas de dos cartas abiertas haciendo que al abrir una se sume uno a la variable global contador
function abrir(carta) {
  if (contador < 2) {
    if (!carta.classList.contains("abierta")) {
      //se le agrega una nueva clase donde por medio de una variable se le pasa la url del dataset.img
      carta.style.setProperty("--imagen-carta", `url(${carta.dataset.img})`);
      carta.classList.add("abierta");
      par.push(carta);
      contador++;

      if (contador === 2) {
        esPar();
      }
    }
  }
}
//cuando contador es dos verifica si es par por medio del dataset si son iguales, se ocultan
function esPar() {
  if (par[0].dataset.img === par[1].dataset.img) {
    setTimeout(() => {
      par.forEach((carta) => carta.classList.add("par"));
      verificar();
      contador = 0;
      par = [];
    }, 1000);
  } else {
    //si no son iguales se quita la clase abierta para ocultar de nuevo
    setTimeout(() => {
      par.forEach((carta) => carta.classList.remove("abierta"));
      contador = 0;
      par = [];
    }, 2000);
  }
}

function verificar() {
  let cartasRestantes = document.querySelectorAll(".cartas:not(.par)");

  if (cartasRestantes.length === 0) {
    guardarTiempo();
    btnReiniciar.style.display = "none";
    btnDetener.style.display = "none";
    setTimeout(() => {
      cartas.style.display = "none";
      clearInterval(intervalo);
      document.querySelector(".temporizador").remove();
      cartas.innerHTML = ``;
      btnComenzar.style.display = "block";
      mostrarTiempo();
      //window.location.reload();[]
    }, 1000);
  }
}
//
//
//
//
//
//
//
function guardarTiempo() {
  //Se toma el temporizador
  let tiempoDisplay = document
    .querySelector(".temporizador")
    .textContent.trim();
  let tiempoEnSegundos = convertirTiempo(tiempoDisplay);
  //se toma el tiempo guardado en el localstorage
  let tiemposGuardados = JSON.parse(localStorage.getItem("tiempo")) || [];
  //El maximo de tiempos es 5, en caso de haya menos de 5, pasara
  if (tiemposGuardados.length < 5) {
    //hacemos push de tiempo guardado como objeto al array del localstorage
    tiemposGuardados.push({
      tiempo: tiempoDisplay,
      segundos: tiempoEnSegundos,
    });
    //ordenamos con sort de menor a mayor
    tiemposGuardados.sort((a, b) => a.segundos - b.segundos);
    //guardamos los nuevos datos
    localStorage.setItem("tiempo", JSON.stringify(tiemposGuardados));
    //si es igual a 5 buscara si el actual tiempo es mejor que uno de los que estan
  } else if (tiemposGuardados.length === 5) {
    //en caso de que al actual sea mayor que el ultimo
    if (tiemposGuardados[4].segundos > tiempoEnSegundos) {
      //se elimina el ultimo y se hace push con el actual
      tiemposGuardados.pop();
      tiemposGuardados.push({
        tiempo: tiempoDisplay,
        segundos: tiempoEnSegundos,
      });
      //se ordena y guarda
      tiemposGuardados.sort((a, b) => a.segundos - b.segundos);
      localStorage.setItem("tiempo", JSON.stringify(tiemposGuardados));
    }
  }
}

//Se convierte temporizador de string a int para luego dividirlos y poder sacar los minutos y segundos
function convertirTiempo(tiempo) {
  let [minutos, segundos] = tiempo.split(":").map(Number);
  return minutos * 60 + segundos;
}

//crea el temporizador
function temporizador() {
  let tiempoDiv = document.createElement("div");
  tiempoDiv.classList.add("temporizador");
  //formato inicial
  tiempoDiv.textContent = "00:00";
  document.body.prepend(tiempoDiv);
  //con el setinterval ejecutamos una funcion cada segundo el cual se le sumara un valor a la variable segundo
  let segundos = 0;
  intervalo = setInterval(() => {
    segundos++;
    //se da el formato al temporizador en string
    let minutos = Math.floor(segundos / 60)
      .toString()
      .padStart(2, "0");
    let segundosRestantes = (segundos % 60).toString().padStart(2, "0");
    //se inserta el nuevo valor de tiempoDiv con textContent cada segundo
    tiempoDiv.textContent = `${minutos}:${segundosRestantes}`;
  }, 1000);
}

//Si en localstorage hay tiempo guardado, se toman para crear un div y con un foreach ponerlos en pantalla
function mostrarTiempo() {
  if (localStorage.getItem("tiempo")) {
    btnLimpiar.style.display = "block";
    let mejoresTiempos = JSON.parse(localStorage.getItem("tiempo"));
    //
    let divConTiempo = document.querySelector(".tiempos");
    if (divConTiempo) {
      divConTiempo.innerHTML = ``;
      divConTiempo.innerHTML = `<h2>Mejores Tiempos</h2>`;
      mejoresTiempos.forEach((elemento) => {
        let tiempo = `<h2>${elemento.tiempo}<h2/>`;
        divConTiempo.innerHTML += tiempo;
      });
    } else {
      let tiemposDiv = document.createElement("div");
      tiemposDiv.classList.add("tiempos");
      tiemposDiv.innerHTML = `<h2>Mejores Tiempos</h2>`;
      mejoresTiempos.forEach((elemento) => {
        let tiempo = `<h2>${elemento.tiempo}<h2/>`;
        tiemposDiv.innerHTML += tiempo;
      });
      document.body.appendChild(tiemposDiv);
    }
  }
}

mostrarTiempo();
function limpiarMarcador() {
  if (document.getElementById("modal_confirmar")) {
    document.getElementById("modal_confirmar").style.display = "block";
  } else {
    const modalConfirmacion = document.createElement("div");
    modalConfirmacion.id = "modal_confirmar";
    modalConfirmacion.innerHTML = `<div id="mensaje">
    <h1>Advertencia</h1>
    <p>Los registros con los mejores tiempos seran eliminados</p>
    </div>
    <div id="btnGroup">
    <button class="Btnconfirmar" onclick=confirmarDelete()>Si</button>
    <button class="Btnconfirmar" onclick=cancelarDelete()>No</button>
    </div>`;

    document.body.appendChild(modalConfirmacion);
    document.getElementById("modal_confirmar").style.display = "block";
  }
}
function confirmarDelete() {
  localStorage.clear();
  location.reload();
}
function cancelarDelete() {
  document.getElementById("modal_confirmar").style.display = "none";
}
