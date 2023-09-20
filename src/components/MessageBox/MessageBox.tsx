import { FC, useEffect } from 'react';

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

  onDismiss(): void;
}

const MessageBox: FC<MessageBoxProps> = ({
  duration = 5,
  message,
  onDismiss,
  show,
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
    <div className='flex absolute top-5 right-5 px-6 py-4 bg-neutral-50 rounded shadow-lg border'>
      <p>{message}</p>
    </div>
  );
};

export default MessageBox;
