import { useState } from 'react'
import './App.css'
import terroristsData from './data/terrorists.json'

const STATUS_OPTIONS = ['All', 'Active', 'Quiet', 'Dead', 'Israeli Agent']
const RAW_STATUS_TO_LABEL = { active: 'Active', quiet: 'Quiet', dead: 'Dead', agent: 'Israeli Agent' }

const DEFAULT_IMAGE = 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400'

function normalizeTerrorist(raw, index) {
  const rawStatus = (raw.status || '').toLowerCase()
  return {
    id: index + 1,
    name: raw.name,
    organization: raw.organization,
    attackCount: raw.attacksCount ?? 0,
    status: RAW_STATUS_TO_LABEL[rawStatus] ?? raw.status ?? 'Unknown',
    relationToIsrael: raw.relationToIsraelSummary ?? '',
    imageUrl: raw.imageUrl || '',
  }
}

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
      <header className="app-header">
        <h1>8200 Terrorist Database</h1>
        <p className="subtitle">ניהול מאגר מחבלים - מערכת מבחן</p>
      </header>

      <section className="controls">
        <div className="control-group">
          <label htmlFor="nameSearch">Search by name</label>
          <input
            id="nameSearch"
            type="text"
            placeholder="Type a name..."
            value={nameQuery}
            onChange={(e) => setNameQuery(e.target.value)}
          />
        </div>

        <div className="control-group">
          <label htmlFor="minAttacks">Min. number of attacks</label>
          <input
            id="minAttacks"
            type="number"
            min="0"
            value={minAttacks}
            onChange={(e) => setMinAttacks(e.target.value)}
          />
        </div>

        <div className="control-group">
          <label htmlFor="statusFilter">Filter by status</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </section>

      {mostDangerous && (
        <section className="most-dangerous">
          <h2>Most Dangerous Terrorist</h2>
          <div
            className="terrorist-card most-dangerous-card"
            onClick={() => setSelected(mostDangerous)}
          >
            <div className="image-wrapper">
              <img
                src={mostDangerous.imageUrl || DEFAULT_IMAGE}
                alt={mostDangerous.name}
              />
              <span className="badge">Most Dangerous</span>
            </div>
            <div className="card-content">
              <h3>{mostDangerous.name}</h3>
              <p className="organization">{mostDangerous.organization}</p>
              <p className="status">Status: {mostDangerous.status}</p>
              <p className="attacks">Attacks: {mostDangerous.attackCount}</p>
            </div>
          </div>
        </section>
      )}

      <section className="list-section">
        <h2>All Terrorists ({filtered.length})</h2>
        <div className="cards-grid">
          {filtered.map((t) => (
            <article
              key={t.id}
              className={`terrorist-card ${mostDangerous && t.id === mostDangerous.id ? 'highlight' : ''
                }`}
              onClick={() => setSelected(t)}
            >
              <div className="image-wrapper">
                <img src={t.imageUrl || DEFAULT_IMAGE} alt={t.name} />
              </div>
              <div className="card-content">
                <h3>{t.name}</h3>
                <p className="organization">{t.organization}</p>
                <p className="status">Status: {t.status}</p>
                <p className="attacks">Attacks: {t.attackCount}</p>
                <p className="relation">{t.relationToIsrael}</p>
              </div>
            </article>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="empty-state">No terrorists match the current filters.</p>
        )}
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

            <div className="panel-actions">
              <button
                className="danger"
                onClick={() => handleEliminate(selected.id)}
              >
                Eliminate Terrorist
              </button>

              <button
                className="primary"
                disabled={
                  !(
                    selected.status === 'Quiet' &&
                    selected.attackCount <= 3
                  )
                }
                onClick={() => handleRecruit(selected.id)}
              >
                Recruit Terrorist
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
