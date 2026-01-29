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
import { ContentPanel, ObjectDrawerContent, getObjectTitle } from "~/components/panels";
import { SectionContent, getSectionTitle } from "~/components/sections";
import { SectionIndicator } from "~/components/ui/SectionIndicator";
import { BackToHomeButton } from "~/components/ui/BackToHomeButton";
import { TutorialModal } from "~/components/ui/TutorialModal";
import { TouchGuide } from "~/components/ui/TouchGuide";
import { EasterEggModal, GalleryModal } from "~/components/modals";
import { useSectionUrl } from "~/hooks/useSectionUrl";
import { useSceneStore } from "~/stores/useSceneStore";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Jinseok Seo | Frontend Developer" },
    { name: "description", content: "프론트엔드 개발자 서진석의 인터랙티브 3D 포트폴리오" },
    { property: "og:title", content: "Jinseok Seo | Frontend Developer" },
    { property: "og:description", content: "프론트엔드 개발자 서진석의 인터랙티브 3D 포트폴리오" },
    { property: "og:type", content: "website" },
  ];
}

// 오브젝트 인터랙션이 있는 섹션 (섹션 drawer 사용 안 함, 오브젝트 drawer 사용)
const OBJECT_INTERACTION_SECTIONS = ['about', 'projects'];

export default function Home() {
  useSectionUrl();
  const activeSection = useSceneStore((state) => state.activeSection);
  const activeObject = useSceneStore((state) => state.activeObject);
  const activeModal = useSceneStore((state) => state.activeModal);

  // 섹션 drawer로 fallback할 섹션인지 확인 (오브젝트 인터랙션 없는 방)
  const shouldShowSectionDrawer = activeSection && !OBJECT_INTERACTION_SECTIONS.includes(activeSection);

  // 오브젝트 drawer를 표시할지 확인 (Room1, Room2에서 오브젝트 클릭 시)
  const shouldShowObjectDrawer = activeObject !== null;

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

      {/* 터치 가이드 (모바일용) */}
      <TouchGuide />

      {/* 섹션 콘텐츠 패널 (인터랙티브 오브젝트가 없는 방) */}
      {shouldShowSectionDrawer && (
        <ContentPanel title={getSectionTitle(activeSection)}>
          <SectionContent />
        </ContentPanel>
      )}

      {/* 오브젝트 콘텐츠 패널 (Room1, Room2 오브젝트 클릭 시) */}
      {shouldShowObjectDrawer && (
        <ContentPanel title={getObjectTitle(activeObject)} objectMode>
          <ObjectDrawerContent />
        </ContentPanel>
      )}

      {/* 이스터에그/갤러리 모달 (R3F 외부에서 렌더링) */}
      {activeModal === 'easter-egg' && <EasterEggModal />}
      {activeModal === 'gallery' && <GalleryModal />}
    </div>
  );
}
