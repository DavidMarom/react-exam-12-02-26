const RAW_STATUS_TO_LABEL = { active: 'Active', quiet: 'Quiet', dead: 'Dead', agent: 'Israeli Agent' }

// This function must be in the lib.js file! not in the App.jsx file!
export function normalizeTerrorist(raw, index) {
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