export class Pokemon {
    static search(pokemon) {
      const endpoint = `https://pokeapi.co/api/v2/pokemon/${pokemon}`
  
      return fetch(endpoint)
      .then(data => data.json())
      .then(data => ({
        abilities: data.abilities[0].ability.name,
        name: data.name,
        sprite: data.sprites.front_default,
        type: data.types[0].type.name
      }))
    }
  }