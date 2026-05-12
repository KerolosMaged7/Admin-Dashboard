function escapeCsvValue(value) {
  const normalized = String(value ?? '')
  if (/[",\n]/.test(normalized)) {
    return `"${normalized.replace(/"/g, '""')}"`
  }
  return normalized
}

export function downloadCsv(filename, rows, columns) {
  const header = columns.map((column) => escapeCsvValue(column.label)).join(',')
  const body = rows
    .map((row) => columns.map((column) => escapeCsvValue(column.getValue(row))).join(','))
    .join('\n')
  const csv = [header, body].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}
