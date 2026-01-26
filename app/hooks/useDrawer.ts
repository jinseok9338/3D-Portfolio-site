import { type ReactNode } from 'react';

type DrawerController = {
  isOpen: boolean;
  close: () => void;
};

type DrawerAsyncController<T> = {
  isOpen: boolean;
  close: (result: T) => void;
};

type DrawerRenderFn = (controller: DrawerController) => ReactNode;
type DrawerAsyncRenderFn<T> = (controller: DrawerAsyncController<T>) => ReactNode;

export type DrawerEntry = {
  id: string;
  content: ReactNode;
  resolve?: (value: unknown) => void;
};

// Global state
let drawers: DrawerEntry[] = [];
const listeners: Set<() => void> = new Set();

function generateId() {
  return `drawer-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

export function subscribeToDrawers(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getDrawers() {
  return drawers;
}

export const drawer = {
  open: (renderFn: DrawerRenderFn) => {
    const id = generateId();

    const controller: DrawerController = {
      isOpen: true,
      close: () => {
        drawers = drawers.filter((d) => d.id !== id);
        notifyListeners();
      },
    };

    const entry: DrawerEntry = {
      id,
      content: renderFn(controller),
    };

    drawers = [...drawers, entry];
    notifyListeners();

    return id;
  },

  openAsync: <T,>(renderFn: DrawerAsyncRenderFn<T>): Promise<T> => {
    return new Promise((resolve) => {
      const id = generateId();

      const controller: DrawerAsyncController<T> = {
        isOpen: true,
        close: (result: T) => {
          drawers = drawers.filter((d) => d.id !== id);
          notifyListeners();
          resolve(result);
        },
      };

      const entry: DrawerEntry = {
        id,
        content: renderFn(controller),
        resolve: resolve as (value: unknown) => void,
      };

      drawers = [...drawers, entry];
      notifyListeners();
    });
  },

  close: (id: string) => {
    const d = drawers.find((d) => d.id === id);
    if (d?.resolve) {
      d.resolve(null);
    }
    drawers = drawers.filter((d) => d.id !== id);
    notifyListeners();
  },

  closeAll: () => {
    drawers.forEach((d) => {
      if (d.resolve) {
        d.resolve(null);
      }
    });
    drawers = [];
    notifyListeners();
  },
};
