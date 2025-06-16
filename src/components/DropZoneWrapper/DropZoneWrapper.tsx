import { UnlistenFn } from '@tauri-apps/api/event';
import { getCurrentWebview } from '@tauri-apps/api/webview';
import { FC, PropsWithChildren, useCallback, useEffect, useRef } from 'react';

import { ImageFormat } from '../../interfaces/Image';

interface DropZoneWrapperProps extends PropsWithChildren {
  /**
   * Whether the overlay is visible or not
   */
  visibleOverlay: boolean;

  onEnter(): void;

  onExit(): void;

  onDrop(files: string[]): void;
}

const extensions = Object.keys(ImageFormat).filter((item) =>
  isNaN(Number(item)),
);

const DropZoneWrapper: FC<DropZoneWrapperProps> = ({
  visibleOverlay,
  onEnter,
  onExit,
  onDrop,
  children,
}) => {
  const unlistenRef = useRef<UnlistenFn | null>(null);

  const filterItems = useCallback((path: string[]) => {
    return path.filter((item) => {
      const spplitedPath = item.split('.');
      const extension = spplitedPath[spplitedPath.length - 1];

      if (extensions.includes(extension.toUpperCase())) {
        return true;
      }

      return false;
    });
  }, []);

  useEffect(() => {
    const setDragDropEvents = async () => {
      unlistenRef.current = await getCurrentWebview().onDragDropEvent(
        (event) => {
          if (event.payload.type === 'over') {
            if (!visibleOverlay) {
              onEnter();
            }
          } else if (event.payload.type === 'drop') {
            // TODO: Filter folder and files that are not compatible
            onDrop(filterItems(event.payload.paths));

            onExit();
          } else {
            onExit();
          }
        },
      );
    };

    setDragDropEvents();

    return () => {
      if (unlistenRef.current) {
        unlistenRef.current();
      }
    };
  }, [visibleOverlay]);

  return <>{children}</>;
};

export default DropZoneWrapper;
