const urlAPI = "https://pokeapi.co/api/v2/pokemon/";

const caja = document.getElementById("caja");

const loader = document.querySelector(".pokeballs-container");

//Almacenamos la siguiente llamada y un booleano que se activa cuando no queden pokemones
let isFetching = false;

const nextUrl = {
  next: null,
};


const loadAndPrint = pokemonList =>{
  loader.classList.add('show');
  setTimeout(()=>{
    loader.classList.remove('show');
    renderPokemonList(pokemonList);
    isFetching=false;

  },500)
}
//Obtener la data

const fetchPokemons = async () => {
  try {
    const res = await fetch(`${urlAPI}?offset=0&limit=8`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

//Funcion para renderizar pokemon

const renderPokemon = pokemon => {
    const { id, name, sprites, height, weight, types } = pokemon;
    return `
    <div class="poke">
      <img src="${sprites.other.home.front_default}" alt="${name}" />
      <h2>${name.toUpperCase()}</h2>
      <span class="exp">EXP: ${pokemon.base_experience}}</span>
      <div class="tipo-poke">
          ${types.map(tipo => {
            return `<span class="${tipo.type.name} poke__type">${tipo.type.name}</span>`;
          })}
      </div>
      <p class="id-poke">#${id}</p>
      <p class="height">Height: ${height / 10}m</p>
      <p class="weight">Weight: ${weight / 10}Kg</p>
    </div>
    `;
  };

//Funcion para renderizar las cards

const renderPokemonList = pokeList =>{
    const cards = pokeList.map(pokemon =>{
        return renderPokemon(pokemon)
    
    }).join("")
    caja.innerHTML += cards;
}


const init = () => {
    window.addEventListener('DOMContentLoaded',async () =>{
        let {next,results} = await fetchPokemons()
        nextUrl.next = next;
        const URLS = results.map(pokemon => pokemon.url);

        const infoPokemons = await Promise.all(
            URLS.map(async url =>{
                const nextPokemons = await fetch(url);
                return await nextPokemons.json();
            })
        );

        renderPokemonList(infoPokemons);
    });


    //Logica del scroll
    window.addEventListener("scroll",async ()=>{
      const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

      const bottom = scrollTop+ clientHeight >= scrollHeight -10;

      if(bottom && !isFetching){
        isFetching=true;

        const nextPokemons = await fetch(nextUrl.next);
        const {next,results} = await nextPokemons.json();
        nextUrl.next = next;
        const URLS = results.map(pokemon =>pokemon.url)
        

        const infoPokemons = await Promise.all(
          URLS.map(async url =>{
            const nextPokemons = await fetch(url);
            return await nextPokemons.json();
          })
        );
          loadAndPrint(infoPokemons);
      };
    
    })
};

init();
