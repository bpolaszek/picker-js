import './style.css'
import {Picker} from './lib/picker/picker'

// Define interface for our items
interface Item {
  id: number
  name: string
}

// Example usage
const items: Item[] = [
  {id: 1, name: 'Renowned'},
  {id: 2, name: 'Respectable'},
  {id: 3, name: 'Not very popular'},
  {id: 4, name: 'Despicable'},
]

const pickCounts = new Map<string, number>()
items.forEach((item) => pickCounts.set(item.name, 0))

const picker = new Picker<Item>(items, {
  shift: false,
  errorIfEmpty: true,
  defaultWeight: 1,
  weights: [
    [items[0], 100], // Common: high weight
    [items[1], 50], // Rare: medium weight
    [items[2], 20], // Epic: low weight
    [items[3], 5], // Legendary: very low weight
  ],
})

let lastPickedName: string | null = null

function updateUI() {
  const itemsList = items
    .map((item) => {
      const weight = picker.getWeight(item)
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
        if (picked) {
          const currentPicks = pickCounts.get(picked.name) ?? 0
          pickCounts.set(picked.name, currentPicks + 1)
          lastPickedName = picked.name
          updateUI()
        }
        await new Promise((resolve) => setTimeout(resolve, 40))
      }
    }

    performPicks()
  })
}

// Initial UI render
updateUI()
