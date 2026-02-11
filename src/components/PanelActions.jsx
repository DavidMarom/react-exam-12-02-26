function PanelActions({ selected, onEliminate, onRecruit }) {
  if (!selected) return null

  return (
    <div className="panel-actions">
      <button className="danger" onClick={() => onEliminate(selected.id)}>
        Eliminate Terrorist
      </button>

      <button
        className="primary"
        disabled={!(selected.status === 'Quiet' && selected.attackCount <= 3)}
        onClick={() => onRecruit(selected.id)}
      >
        Recruit Terrorist
      </button>
    </div>
  )
}

export default PanelActions

