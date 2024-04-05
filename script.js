document.addEventListener("DOMContentLoaded", function() {
    restoreFromLocalStorage();
    autocompletePokemon();
});

function searchPokemon() {
    const pokemonName = document.getElementById("pokemonInput").value.toLowerCase();
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
    .then(response => response.json())
    .then(data => {
        const pokemonList = document.getElementById("pokemonList");
        const pokemonImage = `<img src="${data.sprites.other["official-artwork"].front_default}" alt="${pokemonName}">`;
        pokemonList.innerHTML = pokemonImage;
        const addButton = document.createElement("button");
        addButton.textContent = " Tenho interesse";
        addButton.addEventListener("click", function() {
            addToCaptureList(data.name, data.sprites.other["official-artwork"].front_default);
        });
        pokemonList.appendChild(addButton);
    })
    .catch(error => {
        console.error('Erro ao buscar Pokémon:', error);
    });
}

function addToCaptureList(pokemonName, imageUrl) {
    const captureList = document.getElementById("capturarList");
    const listItem = document.createElement("li");
    const pokemonImage = `<img src="${imageUrl}" alt="${pokemonName}">`;
    listItem.innerHTML = pokemonImage + pokemonName;
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remover";
    removeButton.addEventListener("click", function() {
        captureList.removeChild(listItem);
        saveToLocalStorage();
    });
    listItem.appendChild(removeButton);
    captureList.appendChild(listItem);
    saveToLocalStorage();
}

function autocompletePokemon() {
    const input = document.getElementById("pokemonInput");
    input.addEventListener("input", function() {
        const searchQuery = input.value.toLowerCase();
        if (searchQuery.length > 0) {
            fetch(`https://pokeapi.co/api/v2/pokemon?limit=1000`)
            .then(response => response.json())
            .then(data => {
                const suggestions = data.results.map(pokemon => pokemon.name).filter(name => name.startsWith(searchQuery));
                displaySuggestions(suggestions);
            })
            .catch(error => {
                console.error('Erro ao buscar sugestões de Pokémon:', error);
            });
        } else {
            clearSuggestions();
        }
    });
}

function displaySuggestions(suggestions) {
    const suggestionsList = document.getElementById("suggestionsList");
    suggestionsList.innerHTML = "";
    suggestions.forEach(pokemon => {
        const listItem = document.createElement("div");
        listItem.textContent = pokemon;
        listItem.classList.add("suggestion");
        listItem.addEventListener("click", function() {
            document.getElementById("pokemonInput").value = pokemon;
            searchPokemon();
            clearSuggestions();
        });
        suggestionsList.appendChild(listItem);
    });
}

function clearSuggestions() {
    document.getElementById("suggestionsList").innerHTML = "";
}

function saveToLocalStorage() {
    const captureList = document.getElementById("capturarList").innerHTML;
    localStorage.setItem("captureList", captureList);
}

function restoreFromLocalStorage() {
    const captureList = localStorage.getItem("captureList");
    if (captureList) {
        document.getElementById("capturarList").innerHTML = captureList;
        const removeButtons = document.querySelectorAll("#capturarList li button");
        removeButtons.forEach(button => {
            button.addEventListener("click", function() {
                const listItem = button.parentElement;
                listItem.parentElement.removeChild(listItem);
                saveToLocalStorage();
            });
        });
    }
}
