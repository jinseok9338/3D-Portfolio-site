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
import { ContentPanel } from "~/components/panels";
import { SectionContent, getSectionTitle } from "~/components/sections";
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
  const activeSection = useSceneStore((state) => state.activeSection);
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
      </SceneCanvas>

      {/* 섹션 인디케이터 */}
      <SectionIndicator />

      {/* 홈으로 돌아가기 버튼 */}
      <BackToHomeButton />

      {/* 튜토리얼 모달 (첫 방문 시) */}
      <TutorialModal />

      {/* 콘텐츠 패널 */}
      <ContentPanel title={getSectionTitle(activeSection)}>
        <SectionContent />
      </ContentPanel>

      {/* 이스터에그/갤러리 모달 (R3F 외부에서 렌더링) */}
      {activeModal === 'easter-egg' && <EasterEggModal />}
      {activeModal === 'gallery' && <GalleryModal />}
    </div>
  );
}
