/**
 * Standard date formatting for the application
 * Requested format: dd/mm/yyyy
 */
export function formatDate(date: Date | string | number | null | undefined): string {
  if (date === null || date === undefined) return 'Not scheduled'
  if (typeof date === 'number' && date === 0) return 'Not scheduled'

  const d = new Date(date)
  if (isNaN(d.getTime())) return 'N/A'

  // Epoch 0 (01/01/1970) means "not scheduled" — stored when animal had no vaccine date set
  if (d.getTime() === 0) return 'Not scheduled'

  // en-GB locale uses dd/mm/yyyy
  return new Intl.DateTimeFormat('en-GB').format(d)
}
