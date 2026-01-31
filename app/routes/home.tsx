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
import { useAndroidBackButton } from "~/hooks/useAndroidBackButton";
import { useSceneStore } from "~/stores/useSceneStore";

const SITE_URL = "https://portfolio.jinseok9338.info";
const SITE_TITLE = "Jinseok Seo | Frontend Developer";
const SITE_DESCRIPTION = "프론트엔드 개발자 서진석의 인터랙티브 3D 포트폴리오. React, Three.js를 활용한 몰입형 웹 경험을 제공합니다.";
const OG_IMAGE = `${SITE_URL}/og-image.png`;

export function meta({}: Route.MetaArgs) {
  return [
    // 기본 메타
    { title: SITE_TITLE },
    { name: "description", content: SITE_DESCRIPTION },
    { name: "keywords", content: "프론트엔드 개발자, Frontend Developer, React, Three.js, 포트폴리오, 서진석, Jinseok Seo, 웹 개발자, 3D 웹" },
    { name: "author", content: "Jinseok Seo (서진석)" },
    { name: "theme-color", content: "#0f172a" },

    // Canonical
    { tagName: "link", rel: "canonical", href: SITE_URL },

    // Open Graph
    { property: "og:type", content: "website" },
    { property: "og:url", content: SITE_URL },
    { property: "og:title", content: SITE_TITLE },
    { property: "og:description", content: SITE_DESCRIPTION },
    { property: "og:image", content: OG_IMAGE },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:locale", content: "ko_KR" },
    { property: "og:site_name", content: "Jinseok Seo Portfolio" },

    // Twitter Card
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:url", content: SITE_URL },
    { name: "twitter:title", content: SITE_TITLE },
    { name: "twitter:description", content: SITE_DESCRIPTION },
    { name: "twitter:image", content: OG_IMAGE },
  ];
}

// 오브젝트 인터랙션이 있는 섹션 (섹션 drawer 사용 안 함, 오브젝트 drawer 사용)
const OBJECT_INTERACTION_SECTIONS = ['about', 'projects'];

export default function Home() {
  useSectionUrl();
  useAndroidBackButton();
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
