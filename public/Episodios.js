//Elementos del DOM
const container = document.getElementById("episodios-container");
const titulo = document.getElementById("titulo-personaje");

const params = new URLSearchParams(window.location.search);
const characterName = params.get("name");

if (!characterName) {
  container.innerHTML = "<p>No se paso por parametro ningun nombre</p>";
} else {
  fetchCharacterEpisodes(characterName);
}
//Funcion para obtener la informacion de la API, junto a una lista de episodios donde aparecen los personajes
async function fetchCharacterEpisodes(name) {
  //Obtiene los datos del personaje
  try {
    const response = await fetch(
      `https://rickandmortyapi.com/api/character/?name=${encodeURIComponent(
        name
      )}`
    );
    const data = await response.json();
    //Muestra la informacion del personaje
    if (!data.results || data.results.length === 0) {
      container.innerHTML = "<p>Personaje no encontrado.</p>";
      return;
    }

    const character = data.results[0]; // toma el primero que coincida
    titulo.innerHTML = `Episodios de ${character.name}`;

    // Mostrar imagen y detalles del personaje
    const personajeInfo = document.createElement("div");
    personajeInfo.classList.add("personaje-info");
    personajeInfo.innerHTML = `
      <img src="${character.image}" alt="${character.name}" class="personaje-img" />
      <h2>${character.name}</h2>
      
      <p>Género: ${character.gender}</p>
    `;
    container.innerHTML = "";
    container.appendChild(personajeInfo);

    // Cargar episodios
    const episodeURLs = character.episode;
    const episodePromises = episodeURLs.map((url) =>
      fetch(url).then((res) => res.json())
    );
    const episodes = await Promise.all(episodePromises);

    // se crea una lista con los episodios
    const listaEpisodios = document.createElement("div");
    listaEpisodios.classList.add("lista-episodios");

    episodes.forEach((ep) => {
      const div = document.createElement("div");
      div.classList.add("episodio");
      div.innerHTML = `
        <h3>${ep.episode} - ${ep.name}</h3>
        <p>Fecha de emisión: ${ep.air_date}</p>
      `;
      listaEpisodios.appendChild(div);
    });
    //Manejo de errores
    container.appendChild(listaEpisodios);
  } catch (error) {
    container.innerHTML = `<p>Error al cargar los episodios: ${error.message}</p>`;
  }
}
