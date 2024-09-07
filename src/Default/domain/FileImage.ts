export default class FileImage {
  constructor(
    readonly buffer: Buffer,
    readonly originalName: string,
    readonly format: string,
    readonly size: number,
  ) {}
}
