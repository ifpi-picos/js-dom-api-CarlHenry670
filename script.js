function searchPokemon() {
    const pokemonName = document.getElementById("pokemonInput").value.toLowerCase();
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
    .then(response => response.json())
    .then(data => {
        const pokemonList = document.getElementById("pokemonList");
        const pokemonImage = `<img src="${data.sprites.other["official-artwork"].front_default}" alt="${pokemonName}">`;
        pokemonList.innerHTML = pokemonImage;
        const addButton = document.createElement("button");
        addButton.textContent = "Adicionar à Lista";
        addButton.addEventListener("click", function() {
            addToCaptureList(data.name);
        });
        pokemonList.appendChild(addButton);
    })
    .catch(error => {
        console.error('Erro ao buscar Pokémon:', error);
    });
}

function addToCaptureList(pokemonName) {
    const captureList = document.getElementById("capturarList");
    const listItem = document.createElement("li");
    listItem.textContent = pokemonName;
    captureList.appendChild(listItem);
}
