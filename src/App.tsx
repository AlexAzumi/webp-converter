import { useCallback, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { open } from '@tauri-apps/api/dialog';

import { Image } from './interfaces/Image';

import { Button } from './components/Button';
import { TableHeader } from './components/TableHeader';
import { TableRow } from './components/TableRow';
import { MessageBox } from './components/MessageBox';

import appConfig from './config.app.json';

function App() {
  const [selectedImages, setSelectedImages] = useState<Image[]>([]);
  const [processing, setProcessing] = useState(false);
  const [messageBoxData, setMessageBoxData] = useState({
    message: '',
    show: false,
    duration: 10,
  });

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

  const handleClickDelete = useCallback(
    (index: number) => {
      const temp = [...selectedImages];
      temp.splice(index, 1);

      setSelectedImages([...temp]);
    },
    [selectedImages],
  );

  const handleClickOpen = useCallback(async () => {
    const selectedFiles = await open({
      multiple: true,
      filters: [
        {
          name: 'Image',
          extensions: ['png', 'jpeg', 'jpg'],
        },
      ],
      title: 'Select files to add to the query',
    });

    if (selectedFiles && typeof selectedFiles === 'object') {
      const mappedImages = selectedFiles.map((item) => {
        const splitName = item.split('\\');

        return {
          name: splitName[splitName.length - 1],
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
        files: selectedImages,
        folderToSave,
      })
        .then((count) => {
          setMessageBoxData({
            ...messageBoxData,
            message: `Processed ${count} of ${selectedImages.length} images`,
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
      {/* Content */}
      <div className='px-6 py-4'>
        <div className='border-neutral-800 border-b-2 pb-4 mb-4'>
          <h1 className='text-3xl font-semibold'>
            WebP converter by AlexAzumi
          </h1>
        </div>
        <div className='flex justify-between mb-4'>
          <Button onClick={handleClickOpen} disabled={processing}>
            Add images
          </Button>
          <Button
            disabled={!selectedImages?.length || processing}
            onClick={handleClickConvert}
          >
            Convert selected images
          </Button>
        </div>
        <div>
          <h2 className='text-2xl font-semibold mb-2'>Selected images</h2>
          <table className='table-auto w-full text-left'>
            <thead>
              <tr className='mb-2'>
                <TableHeader className='text-center'>
                  <input
                    type='checkbox'
                    checked={checkIfSelectedAll()}
                    onChange={(event) =>
                      handleClickColCheckbox(event.currentTarget.checked)
                    }
                  />
                </TableHeader>
                <TableHeader>Name</TableHeader>
                <TableHeader extend>Path</TableHeader>
                <TableHeader>Quality</TableHeader>
                <TableHeader>Delete</TableHeader>
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
                  <TableRow>{item.name}</TableRow>
                  <TableRow extend>{item.src}</TableRow>
                  <TableRow>
                    <select
                      value={item.quality}
                      onChange={(event) =>
                        handleChangeQuality(
                          index,
                          parseInt(event.currentTarget.value),
                        )
                      }
                    >
                      {appConfig.qualityOptions.map((item) => (
                        <option key={`option-${item}`} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </TableRow>
                  <TableRow>
                    <p onClick={() => handleClickDelete(index)}>Delete</p>
                  </TableRow>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default App;
