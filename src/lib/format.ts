/**
 * Stable date formatter to avoid hydration mismatches in Next.js.
 * Always renders in a consistent format regardless of server/client locale.
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Invalid Date";
  
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const day = d.getDate().toString().padStart(2, '0');
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  
  return `${month} ${day}, ${year}`;
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Invalid Date";
  
  const time = d.toLocaleTimeString('en-US', { 
    hour12: true, 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  }).toUpperCase();
  
  return `${formatDate(d)} @ ${time}`;
}
