import { Html, useProgress } from '@react-three/drei';

export function SceneLoader() {
  const { progress } = useProgress();

  return (
    <Html center>
      <div className="flex flex-col items-center gap-2">
        <div className="h-1 w-48 overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full bg-white transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-sm text-white/60">
          {progress.toFixed(0)}%
        </span>
      </div>
    </Html>
  );
}
