/**
 * Standard date formatting for the application
 * Requested format: dd/mm/yyyy
 */
export function formatDate(date: Date | string | number | null | undefined): string {
  if (!date || (typeof date === 'number' && date === 0)) return 'Not scheduled'
  
  const d = new Date(date)
  if (isNaN(d.getTime())) return 'N/A'
  
  // en-GB locale uses dd/mm/yyyy
  return new Intl.DateTimeFormat('en-GB').format(d)
}
