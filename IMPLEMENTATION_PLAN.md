# Portfolio Site 구현 계획

> 3D 인터랙티브 포트폴리오 - 3D 오브젝트 클릭으로 콘텐츠 탐색

---

## 프로젝트 개요

- **컨셉**: 3D 씬에서 오브젝트를 클릭하면 해당 섹션의 콘텐츠가 표시됨
- **기술 스택**: React 19 + React Router 7 + R3F + Tailwind + shadcn/ui

---

## 구현 순서 (Phase별)

### Phase 0: 기반 인프라 설정
> 모든 기능의 토대가 되는 설정들

| # | Task | 설명 | 의존성 |
|---|------|------|--------|
| 0-1 | shadcn/ui 초기화 | `npx shadcn@latest init`, 기본 컴포넌트 설치 | - |
| 0-2 | 추가 패키지 설치 | zod, react-hook-form, zustand, overlay-kit, vaul | - |
| 0-3 | 유틸리티 설정 | `cn()`, 타입 정의, 상수 | 0-1 |
| 0-4 | Provider 구조 | QueryProvider, OverlayProvider, DrawerProvider | 0-2 |
| 0-5 | 글로벌 스타일 | 폰트, CSS 변수, 다크모드 기반 | 0-1 |

---

### Phase 1: 3D 씬 기본 구조
> R3F 캔버스와 기본 환경 설정

| # | Task | 설명 | 의존성 |
|---|------|------|--------|
| 1-1 | Canvas 래퍼 컴포넌트 | `SceneCanvas` - R3F Canvas + 기본 설정 | Phase 0 |
| 1-2 | 카메라 컨트롤러 | OrbitControls 또는 커스텀 카메라 | 1-1 |
| 1-3 | 조명 시스템 | 기본 조명 설정 (ambient, directional, etc.) | 1-1 |
| 1-4 | 환경 설정 | Environment, Background, Fog 등 | 1-1 |
| 1-5 | 로딩 상태 | Suspense + 로딩 UI (Html 컴포넌트) | 1-1 |
| 1-6 | 배경 스타일링 | 파티클 별/먼지 배경 (움직이는 파티클) | 1-4 |

---

### Phase 2: 인터랙션 시스템
> 3D 오브젝트 클릭 → 콘텐츠 표시 로직

| # | Task | 설명 | 의존성 |
|---|------|------|--------|
| 2-1 | 씬 상태 관리 | `useSceneStore` - 현재 선택된 섹션, 카메라 상태 | Phase 0 |
| 2-2 | 클릭 가능 오브젝트 | `InteractiveObject` - hover/click 이벤트 처리 | 1-1, 2-1 |
| 2-3 | 카메라 전환 애니메이션 | 섹션 선택 시 카메라 이동 | 1-2, 2-1 |
| 2-4 | 콘텐츠 패널 시스템 | 오버레이 UI 패널 (Framer Motion) | 2-1 |
| 2-5 | URL 동기화 | nuqs로 선택된 섹션 URL 파라미터 동기화 | 2-1 |

---

### Phase 3: 방 구조 및 카메라 시스템
> 7개 방 모델 분리 및 카메라 줌인 시스템

| # | Task | 설명 | 의존성 |
|---|------|------|--------|
| 3-1 | GLB 모델 구조 파악 | Gemini로 방별 메시 이름 확인 | Phase 2 |
| 3-2 | RoomsModel 컴포넌트 | 방별 그룹 분리, InteractiveObject 적용 | 3-1 |
| 3-3 | 카메라 줌인 시스템 | 방 클릭 → 해당 방으로 카메라 이동 | 3-2 |
| 3-4 | 방 하이라이트 | 선택된 방 강조, 나머지 dim 처리 | 3-3 |
| 3-5 | 섹션 타입 확장 | hobby 추가 (About/Projects/Skills/Contact/Hobby) | 3-2 |

**방-섹션 매칭:**
| 방 | 섹션 |
|---|---|
| 침실 (kid's) | About |
| 사무실 | Projects |
| 주방 | Skills |
| 침실 | Contact |
| 헬스장 | Hobby |
| 거실 | 이스터에그 (Phase 7) |
| 욕실 | 갤러리 (나중에) |

---

### Phase 4: About 방 (침실)
> 자기소개 섹션 인터랙티브 오브젝트

| # | Task | 설명 | 의존성 |
|---|------|------|--------|
| 4-1 | 방 내부 오브젝트 파악 | 액자, 책상, 책장 등 메시 확인 | Phase 3 |
| 4-2 | 액자 클릭 | 프로필 사진/소개 팝업 (Html 컴포넌트) | 4-1 |
| 4-3 | 책상 클릭 | 이력/경력 타임라인 | 4-1 |
| 4-4 | 책장 클릭 | 영향받은 것들/관심사 | 4-1 |
| 4-5 | 오브젝트 호버 효과 | 아웃라인/글로우 | 4-2~4-4 |

---

### Phase 5: Projects 방 (사무실)
> 프로젝트 섹션 인터랙티브 오브젝트

| # | Task | 설명 | 의존성 |
|---|------|------|--------|
| 5-1 | 방 내부 오브젝트 파악 | 모니터, 보드, 서랍 등 | Phase 3 |
| 5-2 | 모니터 클릭 | 프로젝트 목록 (화면처럼 표시) | 5-1 |
| 5-3 | 보드/포스트잇 클릭 | 프로젝트 카드들 | 5-1 |
| 5-4 | 서랍 클릭 | 프로젝트 필터/카테고리 | 5-1 |

---

### Phase 6: Skills/Contact/Hobby 방
> 나머지 섹션들

| # | Task | 설명 | 의존성 |
|---|------|------|--------|
| 6-1 | Skills (주방) | 냉장고→스킬목록, 선반→숙련도, 레시피북→기술조합 | Phase 3 |
| 6-2 | Contact (침실) | 전화기→연락처, 노트북→이메일폼, 포스터→SNS | Phase 3 |
| 6-3 | Hobby (헬스장) | 운동기구→취미카드, 거울→최근활동, TV→링크 | Phase 3 |

---

### Phase 7: 이스터에그 & 폴리싱
> 숨겨진 요소 및 애니메이션

| # | Task | 설명 | 의존성 |
|---|------|------|--------|
| 7-1 | 거실 이스터에그 | TV 클릭 → EmulatorJS (GBA 홈브루 ROM) | Phase 6 |
| 7-2 | 페이지 진입 애니메이션 | 초기 로딩 → 씬 전환 | Phase 6 |
| 7-3 | 마이크로 인터랙션 | 버튼, 호버 효과 등 | Phase 6 |
| 7-4 | 욕실 갤러리 | 사진/디자인 작업물 (선택) | Phase 6 |

---

### Phase 8: 최적화 & 마무리
> 성능 최적화 및 배포 준비

| # | Task | 설명 | 의존성 |
|---|------|------|--------|
| 8-1 | 3D 성능 최적화 | 인스턴싱, LOD, 지오메트리 최적화 | Phase 7 |
| 8-2 | 코드 스플리팅 | 동적 임포트, lazy 로딩 | All |
| 8-3 | 반응형 대응 | 모바일/태블릿 레이아웃 | Phase 7 |
| 8-4 | SEO & 메타데이터 | Open Graph, 구조화 데이터 | All |
| 8-5 | 접근성 | 키보드 네비게이션, 스크린리더 | All |
| 8-6 | 배포 설정 | Docker, CI/CD | All |

---

## /feature-dev 사용 가이드

각 Task를 `/feature-dev`에 입력할 때 아래 형식으로 사용하세요:

```
/feature-dev Task 0-1: shadcn/ui 초기화
- npx shadcn@latest init 실행
- 기본 설정 (New York 스타일, CSS variables 사용)
- Button, Card 등 기본 컴포넌트 설치
```

### 권장 진행 순서

1. **Phase 0 전체** → 기반이 없으면 아무것도 안 됨
2. **Phase 1-1 ~ 1-5** → 3D 캔버스 먼저 띄우기
3. **Phase 2-1, 2-2** → 클릭 인터랙션 기본
4. **Phase 3-1** → 오브젝트 배치 설계 (여기서 방향 확정)
5. **Phase 3-2 + 4-2** → About 섹션 완성 (수직 슬라이스)
6. **나머지 섹션들** → 패턴 확립 후 반복
7. **Phase 5, 6** → 폴리싱

---

## 디렉토리 구조 (예상)

```
app/
├── routes/
│   └── home.tsx              # 메인 (유일한) 페이지
├── components/
│   ├── three/                # 3D 관련
│   │   ├── SceneCanvas.tsx
│   │   ├── CameraController.tsx
│   │   ├── InteractiveObject.tsx
│   │   └── objects/          # 각 섹션 오브젝트
│   │       ├── AboutObject.tsx
│   │       ├── ProjectsObject.tsx
│   │       └── ...
│   ├── panels/               # 콘텐츠 패널
│   │   ├── ContentPanel.tsx
│   │   ├── AboutPanel.tsx
│   │   ├── ProjectsPanel.tsx
│   │   └── ...
│   └── ui/                   # shadcn 컴포넌트
├── stores/
│   └── useSceneStore.ts
├── hooks/
│   └── useSection.ts
├── lib/
│   └── utils.ts
└── types/
    └── index.ts
```

---

## 주요 결정 사항 (구현 시 확정 필요)

| 항목 | 옵션 | 결정 |
|------|------|------|
| 3D 오브젝트 스타일 | 로우폴리 / 리얼리스틱 / 추상적 | TBD |
| 카메라 컨트롤 | 자유 회전 / 고정 시점 / 클릭 시만 이동 | TBD |
| 콘텐츠 패널 위치 | 오버레이 / 사이드 패널 / 3D 내 Html | TBD |
| 다크/라이트 모드 | 다크 only / 토글 가능 | TBD |
| 모바일 대응 | 3D 유지 / 2D 폴백 | TBD |

---

## 체크리스트

### Phase 0 완료 조건 ✅
- [x] `pnpm dev` 정상 실행
- [x] shadcn Button 렌더링 확인
- [x] Provider 구조 적용 (Overlay, Drawer)
- [x] `cn()` 유틸리티 동작 확인

### Phase 1 완료 조건 ✅
- [x] 3D Canvas 화면에 표시
- [x] office.glb 모델 렌더링
- [x] 카메라 컨트롤 동작 (OrbitControls)
- [x] 로딩 상태 표시
- [x] 배경 스타일링 (파티클 별/먼지 배경)

### Phase 2 완료 조건 ✅
- [x] 오브젝트 클릭 이벤트 동작
- [x] Zustand 상태 변경 확인
- [x] URL 파라미터 동기화 (`?section=about`)
- [x] 콘텐츠 패널 열기/닫기

### MVP 완료 조건 (Phase 4까지)
- [ ] 모든 섹션 오브젝트 클릭 가능
- [ ] 각 섹션 콘텐츠 표시
- [ ] 기본 애니메이션 적용
- [ ] 데스크톱에서 정상 동작
