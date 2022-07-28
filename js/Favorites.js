import { Pokemon } from "./Pokemon.js";

// classe que vai conter a lógica dos dados
// como os dados serão estruturados
export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();
  }

  load() {
    this.entries =
      JSON.parse(localStorage.getItem("@pokemon-favorites:")) || [];
  }

  save() {
    localStorage.setItem("@pokemon-favorites:", JSON.stringify(this.entries));
  }

  async add(pokemon) {
    try {
      const pokeExists = this.entries.find((entry) => entry.name === pokemon);

      if (pokeExists) {
        throw new Error("Pokémon já cadastrado");
      }

      const poke = await Pokemon.search(pokemon);

      if (poke.name === undefined) {
        throw new Error("Pokémon não encontrado!");
      }

      this.entries = [poke, ...this.entries];
      this.update();
      this.save();
    } catch (error) {
      alert(error.message);
    }
  }

  delete(pokemon) {
    const filteredEntries = this.entries.filter(
      (entry) => entry.name !== pokemon.name
    );

    this.entries = filteredEntries;
    this.update();
    this.save();
  }
}

// classe que vai criar a visualização e eventos do HTML
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);

    this.tbody = this.root.querySelector("table tbody");

    this.update();
    this.onadd();
  }

  onadd() {
    const addButton = this.root.querySelector(".search button");
    addButton.onclick = () => {
      const { value } = this.root.querySelector(".search input");

      this.add(value.toLowerCase());
    };
  }

  update() {
    this.removeAllTr();

    this.entries.forEach((pokemon) => {
      this.tbody.querySelectorAll("div").forEach((div) => {
        div.remove();
      });
      const row = this.createRow();

      row.querySelector(".pokemon img").src = pokemon.sprite;
      row.querySelector(".pokemon p").textContent =
        pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
      row.querySelector(".type").textContent = pokemon.type;
      row.querySelector(".ability").textContent = pokemon.abilities;

      row.querySelector(".remove").onclick = () => {
        const isOk = confirm("Tem certeza que deseja deletar esse Pokémon?");
        if (isOk) {
          this.delete(pokemon);
        }
      };

      this.tbody.append(row);
    });
  }

  createRowOak() {
    const div = document.createElement("div");

    div.innerHTML = `
    <div class="carvalho">
      <p>Que tal cadastrar um Pokémon Favorito?</p>
      <img src="imgs/profoak.png" alt="Professor Carvalho">
    </div>
    `;

    return div;
  }

  createRow() {
    const tr = document.createElement("tr");

    tr.innerHTML = `
    <td class="pokemon">
      <img
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
        alt="Imagem"
      />
      <p>Pikachu</p>
    </td>
    <td class="type">Electric</td>
    <td class="ability">static</td>
    <td>
      <button class="remove">
        <img src="imgs/pokeball.png" alt="Pokebola" />
      </button>
    </td>
    `;

    return tr;
  }

  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove();
    });
    const oak = this.createRowOak();
    this.tbody.append(oak);
  }
}
