import { FC, PropsWithChildren } from 'react';

interface TableHeaderProps extends PropsWithChildren {
  /**
   * If `true`, the element will have a `flex: 1` style property
   */
  extend?: boolean;
}

const TableHeader: FC<TableHeaderProps> = ({ children, extend = false }) => {
  return (
    <th
      className={`px-4 py-2 border-2 border-neutral-800 rounded ${
        extend ? 'flex-1' : ''
      }`}
    >
      {children}
    </th>
  );
};

export default TableHeader;
