import { FC, useCallback, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { Image, ImageFormat } from '../../interfaces/Image';

import { TableHeader } from '../TableHeader';
import { TableRow } from '../TableRow';

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

  handleClickColCheckbox(checked: boolean): void;

  handleClickRowCheckbox(index: number): void;

  handleClickRowDelete(index: number): void;

  handleChangeImageQuality(index: number, newQuality: number): void;

  handleChangeImageFormat(index: number, newFormat: ImageFormat): void;
}

const ImagesTable: FC<ImagesTableProps> = ({
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
      <table className='table-fixed w-full text-left mb-4'>
        <thead>
          <tr className='mb-2'>
            <TableHeader className='text-center w-1/12'>
              <input
                type='checkbox'
                checked={checkIfSelectedAll()}
                onChange={(event) =>
                  handleClickColCheckbox(event.currentTarget.checked)
                }
              />
            </TableHeader>
            <TableHeader className='w-2/12'>Name</TableHeader>
            <TableHeader className='w-5/12'>Path</TableHeader>
            <TableHeader className='w-1/12'>Quality</TableHeader>
            <TableHeader className='w-1/12'>Convert to</TableHeader>
            <TableHeader className='w-1/12'>Remove</TableHeader>
          </tr>
        </thead>
        <tbody>
          {selectedImages.map((item, index) => (
            <tr key={item.name} className='mb-2 last-of-type:mb-0'>
              <TableRow className='text-center'>
                <input
                  type='checkbox'
                  checked={item.selected}
                  onChange={() => handleClickRowCheckbox(index)}
                />
              </TableRow>
              <TableRow
                className='whitespace-nowrap overflow-hidden text-ellipsis'
                showDataTooltip
              >
                {item.name}
              </TableRow>
              <TableRow
                className='whitespace-nowrap overflow-hidden text-ellipsis'
                showDataTooltip
              >
                {item.src}
              </TableRow>
              <TableRow className='text-center'>
                <select
                  className='border rounded px-2 py-1'
                  value={item.quality}
                  disabled={processing || item.format != ImageFormat.WEBP}
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
              </TableRow>
              <TableRow className='text-center'>
                <select
                  className='border rounded px-2 py-1'
                  disabled={processing}
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
              </TableRow>
              <TableRow className='text-center'>
                <FontAwesomeIcon
                  className='text-neutral-800 hover:cursor-pointer'
                  icon={faTrash}
                  onClick={() => handleClickRowDelete(index)}
                />
              </TableRow>
            </tr>
          ))}
        </tbody>
      </table>
    ),
    [selectedImages, processing],
  );
};

export default ImagesTable;
