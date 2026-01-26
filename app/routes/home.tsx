import type { Route } from "./+types/home";
import {
  SceneCanvas,
  Lighting,
  Environment,
  CameraController,
  OfficeModel,
} from "~/components/three";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Portfolio" },
    { name: "description", content: "Interactive 3D Portfolio" },
  ];
}

export default function Home() {
  return (
    <div className="h-screen w-screen">
      <SceneCanvas>
        <Environment />
        <Lighting />
        <CameraController autoRotate autoRotateSpeed={0.3} />
        <OfficeModel position={[0, -1, 0]} scale={1} />
      </SceneCanvas>
    </div>
  );
}
