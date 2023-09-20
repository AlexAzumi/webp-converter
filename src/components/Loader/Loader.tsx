import { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

interface LoaderProps {
  /**
   * If `true`, the loader will appear on screen
   */
  show: boolean;
}

const Loader: FC<LoaderProps> = ({ show }) => {
  if (!show) {
    return null;
  }

  return (
    <div className='fixed top-0 left-0 right-0 bottom-0 bg-neutral-800 z-10 bg-opacity-70'>
      <div className='flex flex-col fixed right-0 bottom-0 left-0 top-0 justify-center items-center'>
        <FontAwesomeIcon
          className='text-neutral-50 mb-2'
          icon={faSpinner}
          size='4x'
          spinPulse
        />
        <p className='text-neutral-50 text-xl select-none'>
          Processing images...
        </p>
      </div>
    </div>
  );
};

export default Loader;
