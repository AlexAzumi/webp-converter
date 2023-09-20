import { FC, PropsWithChildren } from 'react';

interface TableRowProps extends PropsWithChildren {
  className?: string;
}

const TableRow: FC<TableRowProps> = ({ children, className = '' }) => {
  return (
    <td
      className={`px-3 py-2 border-2 border-neutral-600 select-none ${className}`}
    >
      {children}
    </td>
  );
};

export default TableRow;
