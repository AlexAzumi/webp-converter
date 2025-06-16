import { FC, useState, useEffect, useCallback } from 'react';
import { getName, getVersion } from '@tauri-apps/api/app';
import { open } from '@tauri-apps/plugin-shell';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

import { Button } from '../Button';

interface AboutModalProps {
  visible: boolean;

  onDismiss(): void;
}

const AboutModal: FC<AboutModalProps> = ({ visible, onDismiss }) => {
  const [appName, setAppName] = useState('-');
  const [appVersion, setAppVersion] = useState('0.0.0');

  const getProperAppVersion = useCallback((): string => {
    if (appVersion[0] === '0') {
      return `v${appVersion} BETA`;
    } else {
      return `v${appVersion}`;
    }
  }, [appVersion]);

  const openExternalURL = useCallback(async (link: string) => {
    await open(link);
  }, []);

  useEffect(() => {
    const getAppData = async () => {
      setAppName(await getName());
      setAppVersion(await getVersion());
    };

    getAppData();
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div className='flex absolute top-0 bottom-0 right-0 left-0 z-20 justify-center items-center bg-neutral-800/40 select-none backdrop-blur'>
      <div className='px-8 py-6 bg-white rounded text-neutral-700 dark:bg-gray-700 dark:text-white'>
        <div className='border-b-2 pb-3 mb-3'>
          <div className='flex items-center'>
            <img className='mr-3' src='/logo.svg' width={80} />
            <h1 className='text-4xl font-bold'>{appName}</h1>
          </div>
          <p className='text-right'>{getProperAppVersion()}</p>
        </div>
        <div className='flex flex-col mb-6'>
          <h1 className='text-xl mb-3 font-bold'>Developed by</h1>
          <div className='flex'>
            <img className='mr-3' src='/github-logo.png' width={50} />
            <div className='flex flex-col justify-between flex-1 text-right'>
              <p>Alejandro Suárez (AlexAzumi)</p>
              <p
                className='text-sky-600 dark:text-sky-400 hover:cursor-pointer hover:underline'
                onClick={() => openExternalURL('https://github.com/AlexAzumi')}
              >
                https://github.com/AlexAzumi
                <FontAwesomeIcon
                  className='ml-2'
                  icon={faArrowUpRightFromSquare}
                />
              </p>
            </div>
          </div>
        </div>
        <div className='flex flex-col border-b-2 pb-4 mb-4'>
          <h1 className='text-xl mb-3 font-bold'>Open source code</h1>
          <p
            className='text-sky-600 dark:text-sky-400 hover:cursor-pointer hover:underline'
            onClick={() =>
              openExternalURL('https://github.com/AlexAzumi/webp-converter')
            }
          >
            https://github.com/AlexAzumi/webp-converter
            <FontAwesomeIcon className='ml-2' icon={faArrowUpRightFromSquare} />
          </p>
        </div>
        <div className='flex justify-end'>
          <Button onClick={onDismiss}>Close</Button>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
