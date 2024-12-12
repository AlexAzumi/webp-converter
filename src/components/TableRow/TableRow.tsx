import {
  FC,
  MouseEvent,
  PropsWithChildren,
  useCallback,
  useRef,
  useState,
} from 'react';

interface TableRowProps extends PropsWithChildren {
  className?: string;

  showDataTooltip?: boolean;
}

interface RowTooltipProps extends PropsWithChildren {
  show: boolean;

  positionX: number;

  positionY: number;

  offset: {
    x: number;
    y: number;
  };
}

const TableRow: FC<TableRowProps> = ({
  children,
  className = '',
  showDataTooltip = false,
}) => {
  const timerRef = useRef(0);
  const positionRef = useRef({
    positionX: 0,
    positionY: 0,
  });
  const [tooltipData, setTooltipData] = useState({
    show: false,
  });

  const handleEnterMouse = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();

      if (!showDataTooltip) {
        return;
      }

      timerRef.current = setTimeout(() => {
        setTooltipData({
          show: true,
        });
      }, 500); // TODO: Set the time as a prop?
    },
    [children],
  );

  const handleExitMouse = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();

      if (!showDataTooltip) {
        return;
      }

      clearTimeout(timerRef.current);

      setTooltipData({
        show: false,
      });
    },
    [children],
  );

  const handleMouseMove = (event: MouseEvent) => {
    event.preventDefault();

    if (!showDataTooltip) {
      return;
    }

    positionRef.current.positionX = event.pageX;
    positionRef.current.positionY = event.pageY;
  };

  return (
    <td
      className={`px-3 py-2 bg-neutral-50 select-none ${className}`}
      onMouseEnter={handleEnterMouse}
      onMouseLeave={handleExitMouse}
      onMouseMove={handleMouseMove}
    >
      {children}
      {showDataTooltip && (
        <RowTooltip
          show={tooltipData.show}
          positionX={positionRef.current.positionX}
          positionY={positionRef.current.positionY}
          offset={{ x: 5, y: 10 }}
        >
          {children}
        </RowTooltip>
      )}
    </td>
  );
};

const RowTooltip: FC<RowTooltipProps> = ({
  children,
  show,
  positionX,
  positionY,
  offset,
}) => {
  if (!show) {
    return null;
  }

  return (
    <div
      className='flex absolute top-0 bg-neutral-50 px-4 py-2 shadow pointer-events-none text-neutral-700 rounded'
      style={{
        left: positionX + offset.x,
        top: positionY + offset.y,
      }}
    >
      {children}
    </div>
  );
};

export default TableRow;
