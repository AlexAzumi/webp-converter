import { FC, PropsWithChildren } from 'react';

interface ButtonProps extends PropsWithChildren {
  /**
   * Button click event
   */
  onClick(): void;

  /**
   * Whether the button is disabled or not
   */
  disabled?: boolean;
}

const Button: FC<ButtonProps> = ({ children, onClick, disabled = false }) => {
  return (
    <button
      className='border-neutral-600 border-2 px-4 py-2 rounded hover:bg-green-600 hover:text-neutral-50 hover:border-green-800 transition-colors disabled:bg-neutral-500 disabled:text-neutral-50 disabled:border-neutral-500 disabled:hover:cursor-not-allowed'
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
