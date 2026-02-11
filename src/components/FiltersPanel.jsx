import ControlGroup from './ControlGroup'

function FiltersPanel({
  nameQuery,
  minAttacks,
  statusFilter,
  onNameChange,
  onMinAttacksChange,
  onStatusFilterChange,
  statusOptions,
}) {
  return (
    <section className="controls">
      <ControlGroup label="Search by name" id="nameSearch">
        <input
          id="nameSearch"
          type="text"
          placeholder="Type a name..."
          value={nameQuery}
          onChange={(e) => onNameChange(e.target.value)}
        />
      </ControlGroup>

      <ControlGroup label="Min. number of attacks" id="minAttacks">
        <input
          id="minAttacks"
          type="number"
          min="0"
          value={minAttacks}
          onChange={(e) => onMinAttacksChange(e.target.value)}
        />
      </ControlGroup>

      <ControlGroup label="Filter by status" id="statusFilter">
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </ControlGroup>
    </section>
  )
}

export default FiltersPanel

