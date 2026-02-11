function MostDangerous({ mostDangerous, onSelect, defaultImage }) {
  if (!mostDangerous) return null

  return (
    <section className="most-dangerous">
      <h2>Most Dangerous Terrorist</h2>
      <div
        className="terrorist-card most-dangerous-card"
        onClick={() => onSelect(mostDangerous)}
      >
        <div className="image-wrapper">
          <img
            src={mostDangerous.imageUrl || defaultImage}
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
  )
}

export default MostDangerous

