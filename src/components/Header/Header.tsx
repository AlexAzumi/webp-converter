import { FC, useMemo } from 'react';

import { Image } from '../../interfaces/Image';

import { Button } from '../Button';

interface HeaderProps {
  /**
   * Title shown on the top of the app
   */
  title: string;

  /**
   * If set to `true`, the header buttons will be disabled while processing images
   */
  processing: boolean;

  /**
   * Array of selected images ready to process
   */
  selectedImages: Image[];

  handleClickOpen(): void;

  handleClickClearQuery(): void;

  handleClickConvert(): void;
}

const Header: FC<HeaderProps> = ({
  handleClickClearQuery,
  handleClickConvert,
  handleClickOpen,
  processing,
  selectedImages,
  title,
}) => {
  return useMemo(
    () => (
      <div className='sticky top-0 bg-neutral-50 py-4'>
        <div className='border-neutral-800 border-b-2 pb-4 mb-4'>
          <h1 className='text-3xl font-semibold select-none'>{title}</h1>
        </div>
        <div className='flex justify-between'>
          <div className='space-x-4'>
            <Button onClick={handleClickOpen} disabled={processing}>
              Add images
            </Button>
            <Button
              onClick={handleClickClearQuery}
              disabled={!selectedImages?.length || processing}
            >
              Clear query
            </Button>
          </div>
          <Button
            disabled={!selectedImages?.length || processing}
            onClick={handleClickConvert}
          >
            Convert selected images
          </Button>
        </div>
      </div>
    ),
    [processing, selectedImages],
  );
};

export default Header;
