import { FC, PropsWithChildren } from 'react';

interface TableHeaderProps extends PropsWithChildren {
  className?: string;
}

const TableHeader: FC<TableHeaderProps> = ({ children, className = '' }) => {
  return (
    <th
      className={`px-3 py-2 border-2 border-neutral-600 bg-neutral-600 text-neutral-50 select-none ${className}`}
    >
      {children}
    </th>
  );
};

export default TableHeader;
