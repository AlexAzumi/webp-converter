import { FC, PropsWithChildren } from 'react';

interface TableHeaderProps extends PropsWithChildren {
  /**
   * If `true`, the element will have a `flex: 1` style property
   */
  extend?: boolean;

  className?: string;
}

const TableHeader: FC<TableHeaderProps> = ({
  children,
  extend = false,
  className = '',
}) => {
  return (
    <th
      className={`px-4 py-2 border-2 border-neutral-800 rounded ${
        extend ? 'flex-1' : ''
      } ${className}`}
    >
      {children}
    </th>
  );
};

export default TableHeader;
