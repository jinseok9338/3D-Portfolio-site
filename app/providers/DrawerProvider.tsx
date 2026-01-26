import { useState, useEffect, type ReactNode } from 'react';
import { Drawer as VaulDrawer } from 'vaul';
import {
  subscribeToDrawers,
  getDrawers,
  type DrawerEntry,
  drawer,
} from '~/hooks/useDrawer';

function DrawerInstance({ entry }: { entry: DrawerEntry }) {
  const [isOpen, setIsOpen] = useState(true);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsOpen(false);
      setTimeout(() => drawer.close(entry.id), 200);
    }
  };

  return (
    <VaulDrawer.Root open={isOpen} onOpenChange={handleOpenChange}>
      <VaulDrawer.Portal>
        <VaulDrawer.Overlay className="fixed inset-0 bg-black/40" />
        {entry.content}
      </VaulDrawer.Portal>
    </VaulDrawer.Root>
  );
}

export function DrawerProvider({ children }: { children: ReactNode }) {
  const [drawers, setDrawers] = useState<DrawerEntry[]>([]);

  useEffect(() => {
    setDrawers(getDrawers());

    const unsubscribe = subscribeToDrawers(() => {
      setDrawers([...getDrawers()]);
    });

    return unsubscribe;
  }, []);

  return (
    <>
      {children}
      {drawers.map((entry) => (
        <DrawerInstance key={entry.id} entry={entry} />
      ))}
    </>
  );
}
