function ControlGroup({ label, id, children }) {
  return (
    <div className="control-group">
      <label htmlFor={id}>{label}</label>
      {children}
    </div>
  )
}

export default ControlGroup

