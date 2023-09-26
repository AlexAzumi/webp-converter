import { FC, PropsWithChildren } from 'react';

interface TableHeaderProps extends PropsWithChildren {
  className?: string;
}

const TableHeader: FC<TableHeaderProps> = ({ children, className = '' }) => {
  return (
    <th
      className={`p-3 bg-sky-600 text-neutral-50 select-none first-of-type:rounded-tl last-of-type:rounded-tr ${className}`}
    >
      {children}
    </th>
  );
};

export default TableHeader;
