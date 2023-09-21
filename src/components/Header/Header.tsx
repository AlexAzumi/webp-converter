import { FC, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGears, faCirclePlus } from '@fortawesome/free-solid-svg-icons';

import { Image } from '../../interfaces/Image';

import { Button } from '../Button';
import { faCircleMinus } from '@fortawesome/free-solid-svg-icons/faCircleMinus';

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
      <div className='sticky top-0 py-4 bg-neutral-50'>
        <div className='flex border p-6 justify-between items-center shadow-lg mb-4'>
          <h1 className='text-4xl font-bold select-none mb-0 text-neutral-800'>
            {title}
          </h1>
          <Button
            disabled={!selectedImages?.length || processing}
            onClick={handleClickConvert}
          >
            <FontAwesomeIcon className='mr-2' icon={faGears} />
            Convert selected images
          </Button>
        </div>
        <div className='flex space-x-4'>
          <Button onClick={handleClickOpen} disabled={processing}>
            <FontAwesomeIcon className='mr-2' icon={faCirclePlus} />
            Add images
          </Button>
          <Button
            onClick={handleClickClearQuery}
            disabled={!selectedImages?.length || processing}
          >
            <FontAwesomeIcon className='mr-2' icon={faCircleMinus} />
            Clear query
          </Button>
        </div>
      </div>
    ),
    [processing, selectedImages],
  );
};

export default Header;
