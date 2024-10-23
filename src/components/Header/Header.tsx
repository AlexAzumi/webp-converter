import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getVersion } from '@tauri-apps/api/app';
import {
  faGears,
  faCirclePlus,
  faCircleMinus,
} from '@fortawesome/free-solid-svg-icons';

import { Image } from '../../interfaces/Image';

import { Button } from '../Button';
import { Select } from '../Select';

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

  /**
   * Current value of the quality override of the batch
   */
  batchQuality: number;

  handleClickOpen(): void;

  handleClickClearQuery(): void;

  handleClickConvert(): void;

  handleChangeBatchQuality(newValue: number): void;
}

const Header: FC<HeaderProps> = ({
  batchQuality,
  handleChangeBatchQuality,
  handleClickClearQuery,
  handleClickConvert,
  handleClickOpen,
  processing,
  selectedImages,
  title,
}) => {
  const [appVersion, setAppVersion] = useState('0.0.0');

  const getProperAppVersion = useCallback((): string => {
    if (appVersion[0] === '0') {
      return `v${appVersion} BETA`;
    } else {
      return `v${appVersion}`;
    }
  }, [appVersion]);

  useEffect(() => {
    const getCurrentVersion = async () => {
      setAppVersion(await getVersion());
    };

    getCurrentVersion();
  }, []);

  return useMemo(
    () => (
      <div className='sticky top-0 py-4 bg-neutral-200 z-10'>
        <div className='flex border p-6 justify-between items-center shadow-lg mb-4 rounded bg-neutral-50'>
          <div className='flex flex-col items-end select-none'>
            <h1 className='flex items-center text-4xl font-bold mb-0 text-neutral-700'>
              <img className='mr-3' src='/logo.svg' width={50} />
              {title}
            </h1>
            <p>{getProperAppVersion()}</p>
          </div>
          <Button
            disabled={!selectedImages?.length || processing}
            onClick={handleClickConvert}
          >
            <FontAwesomeIcon className='mr-2' icon={faGears} />
            Convert selected images
          </Button>
        </div>
        <div className='flex'>
          <Button
            className='mr-4'
            onClick={handleClickOpen}
            disabled={processing}
          >
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
          <div className='flex items-center ml-auto'>
            <p className='pr-4'>Batch quality</p>
            <Select
              value={batchQuality}
              handleChangeValue={handleChangeBatchQuality}
            />
          </div>
        </div>
      </div>
    ),
    [processing, selectedImages, appVersion, batchQuality],
  );
};

export default Header;
