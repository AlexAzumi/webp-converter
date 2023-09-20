export interface Image {
  /**
   * Whether if convert or not the image
   */
  selected: boolean;

  /**
   * Name of the file (with extension)
   */
  name: string;

  /**
   * Path of the image
   */
  src: string;

  /**
   * Convertion quality of the image (0 to 100)
   */
  quality: number;
}
