export function cn(...inputs: string[]) {
  return inputs.filter(Boolean).join(' ')
}

export function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export function formatPercentage(score: number, maxScore: number): number {
  if (maxScore === 0) return 0
  return Math.round((score / maxScore) * 100)
}

export function isAssessmentAvailable(classDate: string | null, availableAfterDays: number): boolean {
  if (!classDate) return false
  const available = new Date(classDate)
  available.setDate(available.getDate() + availableAfterDays)
  return new Date() >= available
}

export function daysUntilAssessment(classDate: string | null, availableAfterDays: number): number {
  if (!classDate) return -1
  const available = new Date(classDate)
  available.setDate(available.getDate() + availableAfterDays)
  const diff = available.getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}
