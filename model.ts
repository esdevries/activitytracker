import { Row } from './db'

export class Activity extends Row {
  public name?: string
  public description?: string
  public isTracked?: boolean
  public history: Array<{ begin: string; end?: string }> = []
}

if (!localStorage.getItem('activity')) {
  Activity.create({
    id: 1,
    name: 'Swimming',
    description: 'Going for a swim in the middle of the pacific ocean.',
    isTracked: false,
  })
  Activity.create({
    id: 2,
    name: 'Running competition',
    description: 'A fun run competition against top athletes (Bear, panther, puma)',
    isTracked: false,
  })
  localStorage.setItem('activity', JSON.stringify(true))
}
