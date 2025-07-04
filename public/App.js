//URL de la API
const apiURL = "https://rickandmortyapi.com/api/character";

// Elementos del DOM
const containerEl = document.getElementById("character-container");
const firstBtn = document.getElementById("first");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const lastBtn = document.getElementById("last");

// Elementos de busqueda y filtro
const searchInput = document.querySelector(".search-input");
const statusFilter = document.getElementById("status-filter");
const speciesFilter = document.getElementById("species-filter");
const genderFilter = document.getElementById("gender-filter");
const filtersContainer = document.getElementById("filters-container");
const filterBtn = document.getElementById("btnFilter");

let sigPag = null;
let prevPag = null;
let lastPag = null;
statusFilter.value = "";
speciesFilter.value = "";
genderFilter.value = "";
searchInput.value = "";

// Funcion para buscar y filtrar personajes
async function buscarPersonajes(url) {
  containerEl.innerHTML = "<p>Cargando personajes...</p>";

  try {
    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 404) {
        containerEl.innerHTML =
          "<p>No se encontraron personajes con esos criterios.</p>";
      } else {
        containerEl.innerHTML = `<p>Error al cargar los personajes: ${res.status} ${res.statusText}</p>`;
      }
      firstBtn.disabled = true;
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      lastBtn.disabled = true;
      return;
    }

    const datos = await res.json();
    console.log(datos);

    mostrarPersonajes(datos.results);

    // Actualizar URLS de paginacion
    sigPag = datos.info.next;
    prevPag = datos.info.prev;

    // Construimos la URL para la ultima pagina incluyendo los filtros actuales
    const currentQueryParams = buildQueryParams();
    lastPag = `${apiURL}?page=${datos.info.pages}${
      currentQueryParams ? "&" + currentQueryParams : ""
    }`;

    // Habilitar o deshabilitar botones de paginacion
    firstBtn.disabled = !prevPag;
    prevBtn.disabled = !prevPag;
    nextBtn.disabled = !sigPag;
    lastBtn.disabled = !sigPag;
  } catch (error) {
    containerEl.innerHTML = `<p>Error al cargar los personajes: ${error.message}</p>`;
    firstBtn.disabled = true;
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    lastBtn.disabled = true;
  }
}
//Funcion para mostrar los personajes
function mostrarPersonajes(personajes) {
  containerEl.innerHTML = "";

  personajes.forEach((personaje) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${personaje.image}" alt="${personaje.name}"/>
      <h2>${personaje.name}</h2>
      <p>Status: ${personaje.status}</p>
      <p>Especie: ${personaje.species}</p>
    <a href="/episodios.html?name=${encodeURIComponent(
      personaje.name
    )}" class="ver-episodios-btn">Ver Episodios</a>

    `;
    containerEl.appendChild(card);
  });
}

//Funcion para construir los parametros de la URL basados en busqueda y filtros
function buildQueryParams() {
  const params = new URLSearchParams();
  const selectedStatus = statusFilter.value;
  const selectedSpecies = speciesFilter.value;
  const selectedGender = genderFilter.value;

  if (selectedGender) {
    params.append("gender", selectedGender);
  }
  if (selectedStatus) {
    params.append("status", selectedStatus);
  }
  if (selectedSpecies) {
    params.append("species", selectedSpecies);
  }

  return params.toString();
}

//Funcion principal para busqueda y filtros
function applySearchAndFilters() {
  const queryParams = buildQueryParams();
  const url = `${apiURL}?${queryParams}`;
  buscarPersonajes(url);
}

//Funcion para mostrar u ocultar los filtros
function toggleFilters() {
  // Alterna la clase "hidden" en el contenedor de filtros
  filtersContainer.classList.toggle("hidden");

  // Cambia el texto del boton segun si los filtros estan ocultos o no
  if (filtersContainer.classList.contains("hidden")) {
    filterBtn.textContent = "Mostrar Filtros";
  } else {
    filterBtn.textContent = "Ocultar Filtros";
  }
}
//Event Listeners para paginacion
firstBtn.addEventListener("click", () => {
  const queryParams = buildQueryParams();
  const url = `${apiURL}?${queryParams}`;
  buscarPersonajes(url);
});

prevBtn.addEventListener("click", () => {
  if (prevPag) buscarPersonajes(prevPag);
});

nextBtn.addEventListener("click", () => {
  if (sigPag) buscarPersonajes(sigPag);
});

lastBtn.addEventListener("click", () => {
  if (lastPag) {
    buscarPersonajes(lastPag);
  } else {
    //Mensaje de advertencia
    console.warn("No se puede ir a la última página con filtros");
  }
});

//Event Listeners para busqueda y filtros
searchInput.addEventListener("input", applySearchAndFilters);
statusFilter.addEventListener("change", applySearchAndFilters);
speciesFilter.addEventListener("change", applySearchAndFilters);
genderFilter.addEventListener("change", applySearchAndFilters);

//Event Listener para el boton de mostrar u ocultar filtros
filterBtn.addEventListener("click", toggleFilters); // Corrected: pass the function itself

// Cargar personajes al iniciar la página
applySearchAndFilters();
