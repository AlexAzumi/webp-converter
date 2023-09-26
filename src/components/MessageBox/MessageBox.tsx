import { FC, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleCheck,
  faCircleExclamation,
  faCircleXmark,
} from '@fortawesome/free-solid-svg-icons';

interface MessageBoxProps {
  /**
   * Message that will be displayed to the user
   */
  message: string;

  /**
   * Message duration (in seconds)
   */
  duration?: number;

  /**
   * Whether to show the message box
   */
  show: boolean;

  type: string;

  onDismiss(): void;
}

const MessageBox: FC<MessageBoxProps> = ({
  duration = 5,
  message,
  onDismiss,
  show,
  type,
}) => {
  const [backgroundColor, setBackgroundColor] = useState('bg-sky-600');

  useEffect(() => {
    if (show) {
      switch (type) {
        case 'Success':
          setBackgroundColor('bg-sky-600');
          break;
        case 'Error':
          setBackgroundColor('bg-red-600');
          break;
        case 'Warning':
          setBackgroundColor('bg-yellow-600');
          break;
        default:
          setBackgroundColor('bg-sky-600');
          break;
      }

      setTimeout(() => onDismiss(), duration * 1000);
    }
  }, [show]);

  if (!show) {
    return null;
  }

  return (
    <div
      className={`flex fixed bottom-5 right-5 px-6 py-4 items-center text-neutral-50 shadow-lg border z-10 select-none max-w-max ${backgroundColor}`}
    >
      {type === 'Error' ? (
        <FontAwesomeIcon className='mr-3' icon={faCircleXmark} />
      ) : null}
      {type === 'Success' ? (
        <FontAwesomeIcon className='mr-3' icon={faCircleCheck} />
      ) : null}
      {type === 'Warning' ? (
        <FontAwesomeIcon className='mr-3' icon={faCircleExclamation} />
      ) : null}
      <p>{message}</p>
    </div>
  );
};

export default MessageBox;
