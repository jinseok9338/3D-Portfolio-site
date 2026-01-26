import { OverlayProvider } from 'overlay-kit';
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7';
import { DrawerProvider } from './DrawerProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NuqsAdapter>
      <OverlayProvider>
        <DrawerProvider>
          {children}
        </DrawerProvider>
      </OverlayProvider>
    </NuqsAdapter>
  );
}
