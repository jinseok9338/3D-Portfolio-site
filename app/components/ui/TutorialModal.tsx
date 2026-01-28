import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TUTORIAL_STEPS = [
  {
    title: '환영합니다! 👋',
    description: '이 포트폴리오는 인터랙티브 3D 공간으로 구성되어 있습니다.',
    icon: '🏠',
  },
  {
    title: '방 탐색하기',
    description: '각 방을 클릭하면 해당 섹션으로 이동합니다. 마우스를 올리면 하이라이트됩니다.',
    icon: '🖱️',
  },
  {
    title: '오브젝트 인터랙션',
    description: '방 안의 물건들을 클릭하면 상세 정보를 볼 수 있습니다.',
    icon: '✨',
  },
  {
    title: '숨겨진 요소',
    description: '거실의 TV, 욕실의 거울/액자에는 특별한 콘텐츠가 숨겨져 있습니다!',
    icon: '🎮',
  },
  {
    title: '네비게이션',
    description: 'ESC 키 또는 우하단 버튼으로 언제든 처음으로 돌아올 수 있습니다.',
    icon: '🔙',
  },
];

export function TutorialModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // 페이지 로드 시 약간의 딜레이 후 표시 (3D 씬 로딩 후)
    const timer = setTimeout(() => setIsOpen(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSkip = () => {
    handleClose();
  };

  const step = TUTORIAL_STEPS[currentStep];
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={handleSkip}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-background border border-border rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 스킵 버튼 */}
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-sm"
            >
              건너뛰기
            </button>

            {/* 아이콘 */}
            <motion.div
              key={currentStep}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 15, stiffness: 300 }}
              className="text-6xl text-center mb-6"
            >
              {step.icon}
            </motion.div>

            {/* 컨텐츠 */}
            <motion.div
              key={`content-${currentStep}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center mb-8"
            >
              <h2 className="text-xl font-bold text-foreground mb-3">
                {step.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </motion.div>

            {/* 프로그레스 인디케이터 */}
            <div className="flex justify-center gap-2 mb-6">
              {TUTORIAL_STEPS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentStep(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    idx === currentStep
                      ? 'bg-primary w-6'
                      : idx < currentStep
                      ? 'bg-primary/50'
                      : 'bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>

            {/* 네비게이션 버튼 */}
            <div className="flex justify-between gap-4">
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="px-6 py-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                이전
              </button>
              <button
                onClick={handleNext}
                className="px-6 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                {isLastStep ? '시작하기' : '다음'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

