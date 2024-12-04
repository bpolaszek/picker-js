export class EmptyPickerError extends Error {
  constructor() {
    super('Cannot pick from an empty list')
    this.name = 'EmptyPickerError'
  }
}
