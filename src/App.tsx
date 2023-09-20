import { useCallback, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { open } from '@tauri-apps/api/dialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';

import { Image, ImageFormat } from './interfaces/Image';

import { Button } from './components/Button';
import { TableHeader } from './components/TableHeader';
import { TableRow } from './components/TableRow';
import { MessageBox } from './components/MessageBox';
import { Loader } from './components/Loader';

import appConfig from './config.app.json';

const App = () => {
  const [selectedImages, setSelectedImages] = useState<Image[]>([]);
  const [processing, setProcessing] = useState(false);
  const [messageBoxData, setMessageBoxData] = useState({
    message: '',
    show: false,
    duration: 10,
  });

  console.log(selectedImages);

  const checkIfSelectedAll = useCallback(() => {
    if (!selectedImages?.length) {
      return false;
    }

    return selectedImages.every((item) => item.selected);
  }, [selectedImages]);

  const handleClickRowCheckbox = useCallback(
    (index: number) => {
      const selected = selectedImages[index];
      selected.selected = !selected.selected;

      const temp = [...selectedImages];
      temp[index] = selected;

      setSelectedImages([...temp]);
    },
    [selectedImages],
  );

  const handleClickColCheckbox = useCallback(
    (checked: boolean) => {
      const temp = [...selectedImages];
      const updatedTemp = temp.map((item) => ({ ...item, selected: checked }));

      setSelectedImages([...updatedTemp]);
    },
    [selectedImages],
  );

  const handleChangeQuality = useCallback(
    (index: number, newQuality: number) => {
      const imageToChange = selectedImages[index];
      imageToChange.quality = newQuality;

      const temp = [...selectedImages];
      temp[index] = imageToChange;

      setSelectedImages([...temp]);
    },
    [selectedImages],
  );

  const handleChangeFormat = useCallback(
    (index: number, newFormat: ImageFormat) => {
      const imageToChange = selectedImages[index];
      imageToChange.format = newFormat;

      const temp = [...selectedImages];
      temp[index] = imageToChange;

      setSelectedImages([...temp]);
    },
    [selectedImages],
  );

  const handleClickDelete = useCallback(
    (index: number) => {
      const temp = [...selectedImages];
      temp.splice(index, 1);

      setSelectedImages([...temp]);
    },
    [selectedImages],
  );

  const handleClickClearQuery = useCallback(() => {
    setSelectedImages([]);
  }, []);

  const handleClickOpen = useCallback(async () => {
    const selectedFiles = await open({
      multiple: true,
      filters: [
        {
          name: 'Image',
          extensions: ['png', 'jpeg', 'jpg', 'webp'],
        },
      ],
      title: 'Select files to add to the query',
    });

    if (selectedFiles && typeof selectedFiles === 'object') {
      const mappedImages = selectedFiles.map((item) => {
        const splittedPath = item.split('\\');
        const name = splittedPath[splittedPath.length - 1];

        let format: ImageFormat;

        if (
          name.toLocaleLowerCase().endsWith('.jpg') ||
          name.toLocaleLowerCase().endsWith('.png') ||
          name.toLocaleLowerCase().endsWith('.jpeg')
        ) {
          format = ImageFormat.WEBP;
        } else {
          format = ImageFormat.PNG;
        }

        return {
          format,
          name,
          quality: 100,
          selected: true,
          src: item,
        };
      });

      const imageSrc = new Set(selectedImages.map((item) => item.src));

      setSelectedImages([
        ...selectedImages,
        ...mappedImages.filter((item) => !imageSrc.has(item.src)),
      ]);
    }
  }, [selectedImages]);

  const handleClickConvert = useCallback(async () => {
    const folderToSave = await open({
      multiple: false,
      directory: true,
      title: 'Select the folder to save the converted files',
    });

    if (folderToSave && typeof folderToSave === 'string') {
      setProcessing(true);

      invoke('convert_images', {
        files: selectedImages
          .filter((item) => item.selected)
          .map((item) => ({ ...item, format: ImageFormat[item.format] })),
        folderToSave,
      })
        .then((count) => {
          setMessageBoxData({
            ...messageBoxData,
            message: `Processed ${count} of ${
              selectedImages.filter((item) => item.selected).length
            } images`,
            show: true,
          });
        })
        .catch(console.error)
        .then(() => setProcessing(false));
    }
  }, [selectedImages]);

  return (
    <>
      {/* Message box */}
      <MessageBox
        duration={messageBoxData.duration}
        message={messageBoxData.message}
        onDismiss={() => setMessageBoxData({ ...messageBoxData, show: false })}
        show={messageBoxData.show}
      />
      {/* Loader screen */}
      <Loader show={processing} />
      {/* Content */}
      <div className='px-6 bg-neutral-50'>
        {/* Header */}
        <div className='sticky top-0 bg-neutral-50 py-4'>
          <div className='border-neutral-800 border-b-2 pb-4 mb-4'>
            <h1 className='text-3xl font-semibold'>
              WebP converter by AlexAzumi
            </h1>
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
        {/* Table */}
        <div>
          <h2 className='text-2xl font-semibold mb-2'>Selected images</h2>
          <table className='table-fixed w-full text-left'>
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
                  <TableRow className='whitespace-nowrap overflow-hidden text-ellipsis'>
                    {item.name}
                  </TableRow>
                  <TableRow className='whitespace-nowrap overflow-hidden text-ellipsis'>
                    {item.src}
                  </TableRow>
                  <TableRow className='text-center'>
                    <select
                      className='border rounded px-2 py-1'
                      value={item.quality}
                      disabled={processing || item.format != ImageFormat.WEBP}
                      onChange={(event) =>
                        handleChangeQuality(
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
                        handleChangeFormat(
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
                      onClick={() => handleClickDelete(index)}
                    />
                  </TableRow>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default App;
