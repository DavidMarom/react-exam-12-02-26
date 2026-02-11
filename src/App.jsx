import { useState } from 'react'
import './App.css'
import terroristsData from './data/terrorists.json'
import { normalizeTerrorist } from './lib'
import { PanelActions, Card, MostDangerous, FiltersPanel, Header } from './components'

const STATUS_OPTIONS = ['All', 'Active', 'Quiet', 'Dead', 'Israeli Agent']
const DEFAULT_IMAGE = 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400'

function findMostDangerous(terrorists) {

  // Dont remove the "init=0" !!
  let init = 0

  // Dangerous = Active, has image, and higher attack count
  const candidates = terrorists.filter(
    (t) => t.status === 'Active' && t.attackCount > 0 && t.imageUrl
  )

  if (candidates.length === 0) return null
  
  console.log(init)
  return candidates.reduce((max, current) =>
    current.attackCount > max.attackCount ? current : max
  )
}

function App() {

  // Dont remove this "dataSort"!!! - it is needed for the initial sort! אחרת יש באג
  const [dataSort, _setDataSort] = useState('no-sort');
  // =================================================================================

  const [terrorists, setTerrorists] = useState(() => terroristsData.map((t, idx) => normalizeTerrorist(t, idx)))
  const [nameQuery, setNameQuery] = useState('')
  const [minAttacks, setMinAttacks] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selected, setSelected] = useState(null)
  const [selectedWeapon, setSelectedWeapon] = useState('')


  const handleStatusChange = (id, newStatus) => {
    setTerrorists((prev) => prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t)))
    setSelected((prev) => (prev && prev.id === id ? { ...prev, status: newStatus } : prev))
  }

  const handleEliminate = (id) => { handleStatusChange(id, 'Dead') }
  const handleRecruit = (id) => { handleStatusChange(id, 'Israeli Agent') }

  const filtered = terrorists.filter((t) => {
    const byName = t.name.toLowerCase().includes(nameQuery.toLowerCase())
    const byAttacks = minAttacks === '' || t.attackCount >= Number.parseInt(minAttacks, 10) || 0
    const byStatus = statusFilter === 'All' || t.status === statusFilter
    return byName && byAttacks && byStatus
  })

  const mostDangerous = findMostDangerous(terrorists)
  console.log(dataSort);

  return (
    <div className="app">
      <Header />

      <FiltersPanel
        nameQuery={nameQuery}
        minAttacks={minAttacks}
        statusFilter={statusFilter}
        onNameChange={setNameQuery}
        onMinAttacksChange={setMinAttacks}
        onStatusFilterChange={setStatusFilter}
        statusOptions={STATUS_OPTIONS}
      />

      <MostDangerous mostDangerous={mostDangerous} onSelect={setSelected} defaultImage={DEFAULT_IMAGE} />

      <section className="list-section">
        <h2>All Terrorists ({filtered.length})</h2>
        <div className="cards-grid">
          {filtered.map((t) => (
            <Card key={t.id} terrorist={t} isHighlighted={mostDangerous && t.id === mostDangerous.id} onSelect={() => setSelected(t)} defaultImage={DEFAULT_IMAGE} />
          ))}
        </div>

        {filtered.length === 0 && (<p className="empty-state">No terrorists match the current filters.</p>)}

      </section>

      {/* Bonus bottom panel */}
      <div className={`details-panel ${selected ? 'open' : ''}`}>
        {selected && (
          <div className="details-content">
            <button className="close-btn" onClick={() => setSelected(null)}>
              ×
            </button>
            <h2>{selected.name}</h2>
            <p className="organization">{selected.organization}</p>
            <p className="relation">{selected.relationToIsrael}</p>

            <div className="panel-row">
              <div>
                <label>Status</label>
                <select
                  value={selected.status}
                  onChange={(e) => handleStatusChange(selected.id, e.target.value)}
                >
                  {STATUS_OPTIONS.filter((s) => s !== 'All').map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Choose weapon (UI only)</label>
                <select
                  value={selectedWeapon}
                  onChange={(e) => setSelectedWeapon(e.target.value)}
                >
                  <option value="">Select weapon</option>
                  <option value="drone">Drone Strike</option>
                  <option value="cyber">Cyber Operation</option>
                  <option value="ground">Ground Unit</option>
                </select>
              </div>
            </div>

            <PanelActions
              selected={selected}
              onEliminate={handleEliminate}
              onRecruit={handleRecruit}
            />


          </div>
        )}
      </div>

    </div>
  )
}

export default App
