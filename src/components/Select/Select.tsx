import { FC } from 'react';

interface SelectProps {
  /**
   * Options that will be shown in the select input
   */
  options: {
    title: string;
    value: number;
  }[];

  /**
   * Current selected value
   */
  value: number;

  handleChangeValue(newValue: number): void;
}

const Select: FC<SelectProps> = ({ options, value, handleChangeValue }) => {
  return (
    <select
      className='rounded-full px-4 py-2 border-0 transition-colors hover:cursor-pointer bg-white dark:bg-gray-700 text-gray-700 dark:text-white'
      onChange={(event) => handleChangeValue(parseInt(event.target.value))}
      value={value}
    >
      <option value={0}>Per image</option>
      {options.map((item, idx) => (
        <option key={`option-${idx}`} value={item.value}>
          {item.title}
        </option>
      ))}
    </select>
  );
};

export default Select;
