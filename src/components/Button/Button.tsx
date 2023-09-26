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
      className='flex items-center rounded border-sky-600 bg-sky-600 text-neutral-50 border-2 px-4 py-2 hover:bg-sky-500 hover:border-sky-500 disabled:bg-neutral-500 disabled:text-neutral-50 disabled:border-neutral-500 disabled:hover:cursor-not-allowed select-none'
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
