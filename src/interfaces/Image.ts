export interface Image {
  /**
   * If set to `true`, the image will be processed in the next batch, otherwise will be ignored
   */
  selected: boolean;

  /**
   * Name of the file (with extension)
   */
  name: string;

  /**
   * Full path of the image
   */
  src: string;

  /**
   * Convertion quality of the image (0 to 100) | `Note: Only applies to .webp convertion`
   */
  quality: number;

  /**
   * Format that the image will be converted to
   */
  format: ImageFormat;
}

export enum ImageFormat {
  WEBP,
  JPG,
  PNG,
  TIFF,
  BMP,
}
