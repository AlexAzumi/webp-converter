import {
  faCircleMinus,
  faCirclePlus,
  faGears,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getVersion } from '@tauri-apps/api/app';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { Image, ImageFormat } from '../../interfaces/Image';

import { Button } from '../Button';
import { Select } from '../Select';

import config from '../../config.app.json';

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

  /**
   * Current value of the format override of the batch
   */
  batchFormat: number;

  handleClickOpen(): void;

  handleClickClearQuery(): void;

  handleClickConvert(): void;

  handleChangeBatchQuality(newValue: number): void;

  handleChangeBatchFormat(newValue: number): void;
}

const Header: FC<HeaderProps> = ({
  batchFormat,
  batchQuality,
  handleChangeBatchFormat,
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
      <div className='py-4 z-10'>
        <div className='flex p-6 justify-between items-center mb-4 rounded-lg bg-white shadow-lg dark:bg-gray-700'>
          <div className='flex flex-col items-end select-none'>
            <h1 className='flex items-center text-4xl font-bold mb-0 text-gray-700 dark:text-white'>
              <img className='mr-3' src='/logo.svg' width={50} />
              {title}
            </h1>
            <p className='text-neutral-700 dark:text-neutral-100'>
              {getProperAppVersion()}
            </p>
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
            <p className='pr-4 text-gray-700 dark:text-white'>Batch quality</p>
            <Select
              options={config.qualityOptions.map((item) => ({
                title: item.toString(),
                value: item,
              }))}
              value={batchQuality}
              handleChangeValue={handleChangeBatchQuality}
            />
          </div>
          <div className='flex items-center ml-4'>
            <p className='pr-4 text-gray-700 dark:text-white'>Batch format</p>
            <Select
              options={Object.keys(ImageFormat)
                .filter((item) => isNaN(Number(item)))
                .map((item, idx) => ({ title: item, value: idx + 1 }))}
              value={batchFormat}
              handleChangeValue={handleChangeBatchFormat}
            />
          </div>
        </div>
      </div>
    ),
    [processing, selectedImages, appVersion, batchQuality, batchFormat],
  );
};

export default Header;
