import { OverlayProvider } from 'overlay-kit';
import { DrawerProvider } from './DrawerProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <OverlayProvider>
      <DrawerProvider>
        {children}
      </DrawerProvider>
    </OverlayProvider>
  );
}
