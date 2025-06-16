import { UnlistenFn } from '@tauri-apps/api/event';
import { getCurrentWebview } from '@tauri-apps/api/webview';
import { FC, PropsWithChildren, useEffect, useRef } from 'react';

interface DropZoneWrapperProps extends PropsWithChildren {
  visibleOverlay: boolean;
  onEnter(): void;
  onExit(): void;
  onDrop(files: string[]): void;
}

const DropZoneWrapper: FC<DropZoneWrapperProps> = ({
  visibleOverlay,
  onEnter,
  onExit,
  onDrop,
  children,
}) => {
  const unlistenRef = useRef<UnlistenFn | null>(null);

  useEffect(() => {
    const setDragDropEvents = async () => {
      unlistenRef.current = await getCurrentWebview().onDragDropEvent(
        (event) => {
          if (event.payload.type === 'over') {
            if (!visibleOverlay) {
              onEnter();
            }
          } else if (event.payload.type === 'drop') {
            onDrop(event.payload.paths);

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
  }, []);

  return <>{children}</>;
};

export default DropZoneWrapper;
