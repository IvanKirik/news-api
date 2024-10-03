export class MediaFile {
  originalname: string;
  buffer: Buffer;

  constructor(file: Express.Multer.File | MediaFile) {
    this.buffer = file.buffer;
    this.originalname = file.originalname;
  }
}
