import { FC } from 'react';

import appConfig from '../../config.app.json';

interface SelectProps {
  /**
   * Current selected value
   */
  value: number;

  handleChangeValue(newValue: number): void;
}

const Select: FC<SelectProps> = ({ value, handleChangeValue }) => {
  return (
    <select
      className='rounded-full px-4 py-2'
      onChange={(event) => handleChangeValue(parseInt(event.target.value))}
      value={value}
    >
      <option value={0}>Per image</option>
      {appConfig.qualityOptions.map((quality) => (
        <option key={`quality-${quality}`} value={quality}>
          {quality}
        </option>
      ))}
    </select>
  );
};

export default Select;
