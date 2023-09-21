import { FC, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleCheck,
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
  useEffect(() => {
    if (show) {
      setTimeout(() => onDismiss(), duration * 1000);
    }
  }, [show]);

  if (!show) {
    return null;
  }

  return (
    <div className='flex fixed bottom-5 right-5 px-6 py-4 items-center bg-sky-600 text-neutral-50 shadow-lg border z-10 select-none max-w-max'>
      {type === 'Error' ? (
        <FontAwesomeIcon className='mr-3' icon={faCircleXmark} />
      ) : null}
      {type === 'Success' ? (
        <FontAwesomeIcon className='mr-3' icon={faCircleCheck} />
      ) : null}
      <p>{message}</p>
    </div>
  );
};

export default MessageBox;
