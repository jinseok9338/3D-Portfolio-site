import type { Route } from "./+types/home";
import {
  SceneCanvas,
  Lighting,
  Environment,
  CameraController,
  OfficeModel,
  StarParticles,
  CameraDebugger,
  Room1InteractiveObjects,
  Room2InteractiveObjects,
  Room3InteractiveObjects,
  Room6InteractiveObjects,
} from "~/components/three";
import { DebugRoomPositions } from "~/components/three/DebugRoomPositions";
import { ContentPanel } from "~/components/panels";
import { SectionIndicator } from "~/components/ui/SectionIndicator";
import { BackToHomeButton } from "~/components/ui/BackToHomeButton";
import { TutorialModal } from "~/components/ui/TutorialModal";
import { EasterEggModal, GalleryModal } from "~/components/modals";
import { useSectionUrl } from "~/hooks/useSectionUrl";
import { useSceneStore } from "~/stores/useSceneStore";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Portfolio" },
    { name: "description", content: "Interactive 3D Portfolio" },
  ];
}

export default function Home() {
  useSectionUrl();
  const activeModal = useSceneStore((state) => state.activeModal);

  return (
    <div className="h-screen w-screen">
      <SceneCanvas>
        <Environment />
        <Lighting />
        <StarParticles count={2000} speed={0.3} />
        <CameraController />
        <OfficeModel position={[0, 0, 0]} scale={0.003} />
        <Room1InteractiveObjects />
        <Room2InteractiveObjects />
        <Room3InteractiveObjects />
        <Room6InteractiveObjects />
        <CameraDebugger />
        {/* <DebugRoomPositions /> */}
      </SceneCanvas>

      {/* 섹션 인디케이터 */}
      <SectionIndicator />

      {/* 홈으로 돌아가기 버튼 */}
      <BackToHomeButton />

      {/* 튜토리얼 모달 (첫 방문 시) */}
      <TutorialModal />

      {/* 이스터에그/갤러리 모달 (R3F 외부에서 렌더링) */}
      {activeModal === 'easter-egg' && <EasterEggModal />}
      {activeModal === 'gallery' && <GalleryModal />}

      {/* TODO: Phase 4에서 콘텐츠 추가 후 활성화
      <ContentPanel>
        <p className="text-muted-foreground">섹션 콘텐츠가 여기에 표시됩니다.</p>
      </ContentPanel>
      */}
    </div>
  );
}
