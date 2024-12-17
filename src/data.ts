export interface EssentialLinkProps {
  title: string
  caption?: string
  link?: string
  icon?: string
}

export interface TableColumn {
  name: string
  label: string
  align: 'left' | 'center' | 'right'
  field: string
  required: boolean
}

export interface HistoryEvent {
  begin: string
  end?: string
  duration?: number
}

export function calculateDuration(begin: string, end: string): number {
  const beginTime = new Date(begin).getTime()
  const endTime = new Date(end).getTime()
  return (endTime - beginTime) / 1000
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  return `${hours}h ${minutes}m ${remainingSeconds}s`
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()

  return `${hours}:${minutes} ${day}/${month}/${year}`
}
