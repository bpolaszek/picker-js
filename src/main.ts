import './style.css'
import {Picker} from './lib/picker'

// Define interface for our items
interface Item {
  name: string
}

// Example usage
const items: Item[] = [{name: 'Renowned'}, {name: 'Respectable'}, {name: 'Not very popular'}, {name: 'Despicable'}]

const weights = new WeakMap<Item, number>()
weights.set(items[0], 100) // Common: high weight
weights.set(items[1], 50) // Rare: medium weight
weights.set(items[2], 20) // Epic: low weight
weights.set(items[3], 5) // Legendary: very low weight

const pickCounts = new Map<string, number>()
items.forEach((item) => pickCounts.set(item.name, 0))

const picker = new Picker<Item>(items, {
  shift: false,
  errorIfEmpty: true,
  defaultWeight: 1,
  weights,
})

let lastPickedName: string | null = null

function updateUI() {
  const itemsList = items
    .map((item) => {
      const weight = weights.get(item) ?? 1
      const picks = pickCounts.get(item.name) ?? 0
      const isJustPicked = lastPickedName === item.name
      return `
      <div class="item-card${isJustPicked ? ' just-picked' : ''}">
        <span class="item-name">${item.name}</span>
        <span class="item-weight">Weight: ${weight}</span>
        <span class="item-picks">Picks: ${picks}</span>
      </div>
    `
    })
    .join('')

  document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <div>
      <h1>Weighted Item Picker</h1>
      <div class="card">
        <button id="pickButton" type="button">Pick Random Item (x 100)</button>
      </div>
      <div class="items-list">
        ${itemsList}
      </div>
    </div>
  `

  document.querySelector<HTMLButtonElement>('#pickButton')?.addEventListener('click', () => {
    async function performPicks() {
      for (let i = 0; i < 100; i++) {
        const picked = picker.pick()
        const currentPicks = pickCounts.get(picked.name) ?? 0
        pickCounts.set(picked.name, currentPicks + 1)
        lastPickedName = picked.name
        updateUI()

        await new Promise((resolve) => setTimeout(resolve, 40))
      }
    }

    performPicks()
  })
}

// Initial UI render
updateUI()
