import { useCallback, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { open } from '@tauri-apps/api/dialog';

import { Image, ImageFormat } from './interfaces/Image';

import { MessageBox } from './components/MessageBox';
import { Loader } from './components/Loader';
import { Header } from './components/Header';

import { ImagesTable } from './components/ImagesTable';

const App = () => {
  const [selectedImages, setSelectedImages] = useState<Image[]>([]);
  const [processing, setProcessing] = useState(false);
  const [messageBoxData, setMessageBoxData] = useState({
    message: '',
    show: false,
    duration: 6,
    type: 'Success',
  });

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

  const handleChangeImageQuality = useCallback(
    (index: number, newQuality: number) => {
      const imageToChange = selectedImages[index];
      imageToChange.quality = newQuality;

      const temp = [...selectedImages];
      temp[index] = imageToChange;

      setSelectedImages([...temp]);
    },
    [selectedImages],
  );

  const handleChangeImageFormat = useCallback(
    (index: number, newFormat: ImageFormat) => {
      const imageToChange = selectedImages[index];
      imageToChange.format = newFormat;

      const temp = [...selectedImages];
      temp[index] = imageToChange;

      setSelectedImages([...temp]);
    },
    [selectedImages],
  );

  const handleClickRowDelete = useCallback(
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

      invoke<number>('convert_images', {
        files: selectedImages
          .filter((item) => item.selected)
          .map((item) => ({ ...item, format: ImageFormat[item.format] })),
        folderToSave,
      })
        .then((count) => {
          const totalToProcess = selectedImages.filter(
            (item) => item.selected,
          ).length;

          setMessageBoxData({
            ...messageBoxData,
            message: `Processed ${count} of ${totalToProcess} images`,
            show: true,
            type:
              count === totalToProcess
                ? 'Sucesss'
                : count > 0
                ? 'Warning'
                : 'Error',
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
        type={messageBoxData.type}
      />
      {/* Loader screen */}
      <Loader show={processing} />
      {/* Content */}
      <div className='px-6 bg-neutral-50'>
        {/* Header */}
        <Header
          handleClickClearQuery={handleClickClearQuery}
          handleClickConvert={handleClickConvert}
          handleClickOpen={handleClickOpen}
          processing={processing}
          selectedImages={selectedImages}
          title='WebP Converter'
        />
        {/* Table */}
        <ImagesTable
          handleChangeImageFormat={handleChangeImageFormat}
          handleChangeImageQuality={handleChangeImageQuality}
          handleClickColCheckbox={handleClickColCheckbox}
          handleClickRowCheckbox={handleClickRowCheckbox}
          handleClickRowDelete={handleClickRowDelete}
          processing={processing}
          selectedImages={selectedImages}
        />
      </div>
    </>
  );
};

export default App;
