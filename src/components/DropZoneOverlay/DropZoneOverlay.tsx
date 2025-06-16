import { FC } from 'react';

interface DropZoneProps {
  /**
   * Whether to show the file drop overlay or not
   */
  show?: boolean;
}

const DropZoneOverlay: FC<DropZoneProps> = ({ show }) => {
  if (!show) {
    return null;
  }

  return (
    <div className='absolute top-0 left-0 right-0 bottom-0 backdrop-blur backdrop-brightness-50 z-30 flex'>
      <div className='flex m-10 justify-center items-center flex-1 border-4 border-white rounded-lg border-dashed'>
        <p className='text-3xl font-bold text-white'>
          Drop one or more image files here
        </p>
      </div>
    </div>
  );
};

export default DropZoneOverlay;
