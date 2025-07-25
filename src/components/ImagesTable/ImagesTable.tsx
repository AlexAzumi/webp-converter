import { FC, useCallback, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { Image, ImageFormat } from '../../interfaces/Image';

import { TableHeader } from '../TableHeader';
import { TableColumn } from '../TableColumn';

import appConfig from '../../config.app.json';

interface ImagesTableProps {
  /**
   * Array of selected images ready to process
   */
  selectedImages: Image[];

  /**
   * If set to `true`, the table inputs will be disabled while processing images
   */
  processing: boolean;

  /**
   * Current value of the quality override of the batch
   */
  batchQuality: number;

  /**
   * Current value of the format override of the batch
   */
  batchFormat: number;

  handleClickColCheckbox(checked: boolean): void;

  handleClickRowCheckbox(index: number): void;

  handleClickRowDelete(index: number): void;

  handleChangeImageQuality(index: number, newQuality: number): void;

  handleChangeImageFormat(index: number, newFormat: ImageFormat): void;
}

const ImagesTable: FC<ImagesTableProps> = ({
  batchQuality,
  batchFormat,
  handleChangeImageFormat,
  handleChangeImageQuality,
  handleClickColCheckbox,
  handleClickRowCheckbox,
  handleClickRowDelete,
  processing,
  selectedImages,
}) => {
  const checkIfSelectedAll = useCallback(() => {
    if (!selectedImages?.length) {
      return false;
    }

    return selectedImages.every((item) => item.selected);
  }, [selectedImages]);

  return useMemo(
    () => (
      <>
        <table className='table-fixed text-left'>
          <thead>
            <tr className='mb-2'>
              <TableHeader className='text-center w-1/12'>
                <div className='flex justify-center items-center'>
                  <input
                    disabled={processing}
                    type='checkbox'
                    checked={checkIfSelectedAll()}
                    onChange={(event) =>
                      handleClickColCheckbox(event.currentTarget.checked)
                    }
                  />
                </div>
              </TableHeader>
              <TableHeader className='w-2/12'>Name</TableHeader>
              <TableHeader className='w-5/12'>Path</TableHeader>
              <TableHeader className='w-1/12'>Quality</TableHeader>
              <TableHeader className='w-1/12'>Format</TableHeader>
              <TableHeader className='w-1/12'>Remove</TableHeader>
            </tr>
          </thead>
        </table>
        <div className='flex overflow-auto mb-4 max-h-full rounded-b'>
          <table className='table-fixed w-full'>
            <tbody>
              {selectedImages.map((item, index) => (
                <tr
                  key={item.name}
                  className='bg-white even:bg-neutral-200 dark:bg-gray-700 dark:even:bg-gray-600 text-gray-700 dark:text-white mb-2 select-none'
                >
                  <TableColumn className='text-center w-1/12'>
                    <div className='flex justify-center items-center'>
                      <input
                        checked={item.selected}
                        disabled={processing}
                        onChange={() => handleClickRowCheckbox(index)}
                        type='checkbox'
                      />
                    </div>
                  </TableColumn>
                  <TableColumn
                    className='whitespace-nowrap overflow-hidden text-ellipsis w-2/12'
                    showDataTooltip
                  >
                    {item.name}
                  </TableColumn>
                  <TableColumn
                    className='whitespace-nowrap overflow-hidden text-ellipsis w-5/12'
                    showDataTooltip
                  >
                    {item.src}
                  </TableColumn>
                  <TableColumn className='text-center w-1/12'>
                    <select
                      className='border px-3 py-2 rounded-full bg-white dark:bg-gray-700 hover:cursor-pointer disabled:hover:cursor-not-allowed'
                      value={item.quality}
                      disabled={processing || batchQuality > 0}
                      onChange={(event) =>
                        handleChangeImageQuality(
                          index,
                          parseInt(event.currentTarget.value),
                        )
                      }
                    >
                      {appConfig.qualityOptions.map((quality) => (
                        <option key={`quality-${quality}`} value={quality}>
                          {quality}
                        </option>
                      ))}
                    </select>
                  </TableColumn>
                  <TableColumn className='text-center w-1/12'>
                    <select
                      className='border px-3 py-2 rounded-full bg-white dark:bg-gray-700 hover:cursor-pointer disabled:hover:cursor-not-allowed'
                      disabled={processing || batchFormat > 0}
                      value={item.format}
                      onChange={(event) =>
                        handleChangeImageFormat(
                          index,
                          parseInt(event.currentTarget.value),
                        )
                      }
                    >
                      {Object.keys(ImageFormat)
                        .filter((item) => isNaN(Number(item)))
                        .map((format, index) => (
                          <option key={`format-${format}`} value={index}>
                            {format}
                          </option>
                        ))}
                    </select>
                  </TableColumn>
                  <TableColumn className='text-center w-1/12'>
                    <FontAwesomeIcon
                      className='text-red-700 dark:text-red-500 hover:cursor-pointer'
                      icon={faTrash}
                      onClick={() => handleClickRowDelete(index)}
                    />
                  </TableColumn>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    ),
    [selectedImages, processing, batchQuality, batchFormat],
  );
};

export default ImagesTable;
