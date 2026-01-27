import type { Route } from "./+types/home";
import {
  SceneCanvas,
  Lighting,
  Environment,
  CameraController,
  OfficeModel,
  StarParticles,
  CameraDebugger,
} from "~/components/three";
import { DebugRoomPositions } from "~/components/three/DebugRoomPositions";
import { ContentPanel } from "~/components/panels";
import { useSectionUrl } from "~/hooks/useSectionUrl";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Portfolio" },
    { name: "description", content: "Interactive 3D Portfolio" },
  ];
}

export default function Home() {
  useSectionUrl();

  return (
    <div className="h-screen w-screen">
      <SceneCanvas>
        <Environment />
        <Lighting />
        <StarParticles count={2000} speed={0.3} />
        <CameraController />
        <OfficeModel position={[0, 0, 0]} scale={0.003} />
        <CameraDebugger />
        {/* <DebugRoomPositions /> */}
      </SceneCanvas>

      <ContentPanel>
        <p className="text-muted-foreground">섹션 콘텐츠가 여기에 표시됩니다.</p>
      </ContentPanel>
    </div>
  );
}
