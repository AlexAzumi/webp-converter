import { FC, PropsWithChildren } from 'react';

interface TableRowProps extends PropsWithChildren {
  /**
   * If `true`, the element will have a `flex: 1` style property
   */
  extend?: boolean;

  className?: string;
}

const TableRow: FC<TableRowProps> = ({
  children,
  extend = false,
  className = '',
}) => {
  return (
    <td
      className={`px-4 py-2 border-2 border-neutral-800 ${
        extend ? 'flex-1' : ''
      } ${className}`}
    >
      {children}
    </td>
  );
};

export default TableRow;
