function Card({ terrorist, isHighlighted, onSelect, defaultImage }) {
  return (
    <article
      className={`terrorist-card ${isHighlighted ? 'highlight' : ''}`}
      onClick={onSelect}
    >
      <div className="image-wrapper">
        <img src={terrorist.imageUrl || defaultImage} alt={terrorist.name} />
      </div>
      <div className="card-content">
        <h3>{terrorist.name}</h3>
        <p className="organization">{terrorist.organization}</p>
        <p className="status">Status: {terrorist.status}</p>
        <p className="attacks">Attacks: {terrorist.attackCount}</p>
        <p className="relation">{terrorist.relationToIsrael}</p>
      </div>
    </article>
  )
}

export default Card

