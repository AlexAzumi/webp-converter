import { faCircleInfo, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
import { useCallback, useEffect, useState } from 'react';
import { LazyStore } from '@tauri-apps/plugin-store';

import { AboutModal } from './components/AboutModal';
import { DropZoneOverlay } from './components/DropZoneOverlay';
import { DropZoneWrapper } from './components/DropZoneWrapper';
import { Header } from './components/Header';
import { ImagesTable } from './components/ImagesTable';
import { Loader } from './components/Loader';
import { MessageBox } from './components/MessageBox';
import { ThemeProvider } from './components/ThemeProvider';

import { type Image, ImageFormat } from './interfaces/Image';

const App = () => {
  const store = new LazyStore('settings.json', {
    autoSave: true,
    defaults: {},
  });

  const [selectedImages, setSelectedImages] = useState<Image[]>([]);
  const [processing, setProcessing] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [messageBoxData, setMessageBoxData] = useState({
    message: '',
    show: false,
    duration: 6,
    type: 'Success',
  });
  const [batchQuality, setBatchQuality] = useState(0);
  const [batchFormat, setBatchFormat] = useState(0);
  const [showDropOverlay, setShowDropOverlay] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const getThemeConfig = async () => {
      const lastTheme = await store.get<'light' | 'dark'>('theme');
      const lastBatchQuality = await store.get<number>('batchQuality');
      const lastBatchFormat = await store.get<number>('batchFormat');

      // Update in app
      if (lastTheme) setCurrentTheme(lastTheme);
      if (lastBatchQuality) setBatchQuality(lastBatchQuality);
      if (lastBatchFormat) setBatchFormat(lastBatchFormat);
    };

    getThemeConfig();
  }, []);

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
          extensions: ['png', 'jpeg', 'jpg', 'tiff', 'bmp', 'webp'],
        },
      ],
      title: 'Select files to add to the query',
    });

    processFiles(selectedFiles);
  }, [selectedImages]);

  const handleClickConvert = useCallback(async () => {
    const folderToSave = await open({
      multiple: false,
      directory: true,
      title: 'Select the folder to save the converted files',
      defaultPath: selectedImages[0].src,
    });

    if (folderToSave && typeof folderToSave === 'string') {
      setProcessing(true);

      invoke<number>('convert_images', {
        files: selectedImages
          .filter((item) => item.selected)
          .map((item) => ({
            ...item,
            format:
              batchFormat > 0
                ? ImageFormat[batchFormat - 1]
                : ImageFormat[item.format],
            quality: batchQuality > 0 ? batchQuality : item.quality,
          })),
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
  }, [selectedImages, batchQuality, batchFormat]);

  const handleChangeBatchQuality = useCallback(
    async (newValue: number) => {
      setBatchQuality(newValue);

      // Save in store
      await store.set('batchQuality', newValue);
    },
    [batchQuality],
  );

  const handleChangeBatchFormat = useCallback(
    async (newValue: number) => {
      setBatchFormat(newValue);

      // Save in store
      await store.set('batchFormat', newValue);
    },
    [batchFormat],
  );

  const processFiles = useCallback(
    (selectedFiles: string[] | null) => {
      if (selectedFiles && typeof selectedFiles === 'object') {
        const mappedImages = selectedFiles.map((item) => {
          const splittedPath = item.split('\\');
          const name = splittedPath[splittedPath.length - 1];

          return {
            format: ImageFormat.WEBP,
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
    },
    [selectedImages],
  );

  const toggleTheme = useCallback(async () => {
    const theme = currentTheme === 'light' ? 'dark' : 'light';

    setCurrentTheme(theme);

    // Save in store
    await store.set('theme', theme);
  }, [currentTheme, store]);

  return (
    <ThemeProvider theme={currentTheme}>
      <DropZoneWrapper
        onEnter={() => setShowDropOverlay(true)}
        onExit={() => setShowDropOverlay(false)}
        onDrop={processFiles}
        visibleOverlay={showDropOverlay}
      >
        {/* Drop file zone */}
        <DropZoneOverlay show={showDropOverlay} />
        {/* About this app */}
        <AboutModal visible={showAbout} onDismiss={() => setShowAbout(false)} />
        {/* Message box */}
        <MessageBox
          duration={messageBoxData.duration}
          message={messageBoxData.message}
          onDismiss={() =>
            setMessageBoxData({ ...messageBoxData, show: false })
          }
          show={messageBoxData.show}
          type={messageBoxData.type}
        />
        {/* Loader screen */}
        <Loader show={processing} />
        {/* Menu bar */}
        <div className='flex select-none bg-sky-600 px-2 py-2'>
          <div
            className='px-4 py-2 text-sm text-neutral-50 rounded-full hover:cursor-pointer hover:bg-sky-700'
            onClick={toggleTheme}
          >
            <FontAwesomeIcon
              className='mr-2'
              icon={currentTheme === 'light' ? faMoon : faSun}
            />
            Switch to {currentTheme === 'light' ? 'dark' : 'light'} mode
          </div>
          <div
            className='px-4 py-2 text-sm ml-auto text-neutral-50 rounded-full hover:cursor-pointer hover:bg-sky-700'
            onClick={() => setShowAbout(true)}
          >
            <FontAwesomeIcon className='mr-2' icon={faCircleInfo} />
            About
          </div>
        </div>
        {/* Content */}
        <div className='flex flex-col w-screen h-full overflow-y-hidden px-6 bg-neutral-200 dark:bg-gray-800'>
          {/* Header */}
          <Header
            batchFormat={batchFormat}
            batchQuality={batchQuality}
            handleChangeBatchFormat={handleChangeBatchFormat}
            handleChangeBatchQuality={handleChangeBatchQuality}
            handleClickClearQuery={handleClickClearQuery}
            handleClickConvert={handleClickConvert}
            handleClickOpen={handleClickOpen}
            processing={processing}
            selectedImages={selectedImages}
            title='WebP Converter'
          />
          {/* Table */}
          <ImagesTable
            batchFormat={batchFormat}
            batchQuality={batchQuality}
            handleChangeImageFormat={handleChangeImageFormat}
            handleChangeImageQuality={handleChangeImageQuality}
            handleClickColCheckbox={handleClickColCheckbox}
            handleClickRowCheckbox={handleClickRowCheckbox}
            handleClickRowDelete={handleClickRowDelete}
            processing={processing}
            selectedImages={selectedImages}
          />
        </div>
      </DropZoneWrapper>
    </ThemeProvider>
  );
};

export default App;
