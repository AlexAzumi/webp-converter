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
    <div className='flex fixed top-0 left-0 right-0 bottom-0 z-10 items-end justify-end'>
      <div className='flex bg-sky-600 px-6 py-4 shadow-lg text-white items-center mr-4 mb-4 rounded'>
        <FontAwesomeIcon
          className='mr-4'
          icon={faSpinner}
          size='2x'
          spinPulse
        />
        <p className='text-xl select-none'>Processing images...</p>
      </div>
    </div>
  );
};

export default Loader;
