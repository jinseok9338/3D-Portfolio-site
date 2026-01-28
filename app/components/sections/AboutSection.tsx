import { motion } from 'framer-motion';
import { MapPin, Briefcase, GraduationCap, Award, Globe } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export function AboutSection() {
  return (
    <div className="space-y-8">
      {/* 프로필 헤더 */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white">
          JS
        </div>
        <h1 className="text-2xl font-bold">서진석</h1>
        <p className="text-lg text-primary mt-1">Front-end Engineer</p>
        <p className="text-muted-foreground text-sm mt-1">6년차 | React/TypeScript 전문</p>
      </motion.div>

      {/* 소개 */}
      <motion.div
        className="p-4 rounded-lg bg-muted/50"
        custom={1}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <p className="text-sm leading-relaxed">
          React/TypeScript 기반의 프론트엔드 개발자로, 대규모 서비스의 설계부터 운영까지
          전 과정을 주도한 경험이 있습니다. 성능 최적화와 아키텍처 설계에 강점이 있으며,
          DIOR, Burberry, Celine 등 글로벌 럭셔리 브랜드 프로젝트를 성공적으로 수행했습니다.
        </p>
      </motion.div>

      {/* 주요 성과 */}
      <motion.div
        custom={2}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
          Key Achievements
        </h3>
        <div className="space-y-3">
          <div className="flex gap-3 items-start">
            <div className="w-2 h-2 rounded-full bg-green-500 mt-2 shrink-0" />
            <p className="text-sm">앱 로딩 시간 7초 → 2초 (60% 단축)</p>
          </div>
          <div className="flex gap-3 items-start">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
            <p className="text-sm">이벤트당 20억원+ 매출 플랫폼 구축</p>
          </div>
          <div className="flex gap-3 items-start">
            <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 shrink-0" />
            <p className="text-sm">GKE 멀티테넌트 아키텍처 설계</p>
          </div>
        </div>
      </motion.div>

      {/* 경력 */}
      <motion.div
        custom={3}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
          <Briefcase className="w-4 h-4" />
          Experience
        </h3>
        <div className="space-y-4">
          <div className="border-l-2 border-primary pl-4">
            <p className="font-medium">주식회사 앵커스</p>
            <p className="text-sm text-muted-foreground">Front-end Engineer & PM</p>
            <p className="text-xs text-muted-foreground">2024.04 ~ 현재</p>
          </div>
          <div className="border-l-2 border-muted pl-4">
            <p className="font-medium">주식회사 레이첼블루</p>
            <p className="text-sm text-muted-foreground">Front-end Engineer</p>
            <p className="text-xs text-muted-foreground">2022.12 ~ 2023.10</p>
          </div>
          <div className="border-l-2 border-muted pl-4">
            <p className="font-medium">(주)서샘영어</p>
            <p className="text-sm text-muted-foreground">개발자</p>
            <p className="text-xs text-muted-foreground">2018.01 ~ 2020.04</p>
          </div>
        </div>
      </motion.div>

      {/* 학력 */}
      <motion.div
        custom={4}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
          <GraduationCap className="w-4 h-4" />
          Education
        </h3>
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-medium">Portland Community College</p>
            <p className="text-muted-foreground">Computer Science | 2012 - 2015</p>
          </div>
        </div>
      </motion.div>

      {/* 자격증 */}
      <motion.div
        custom={5}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
          <Award className="w-4 h-4" />
          Certifications
        </h3>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 text-xs rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20">
            AWS Solution Architect
          </span>
          <span className="px-3 py-1 text-xs rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20">
            AWS Cloud Practitioner
          </span>
        </div>
      </motion.div>

      {/* 언어 */}
      <motion.div
        custom={6}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
          <Globe className="w-4 h-4" />
          Languages
        </h3>
        <div className="flex gap-4 text-sm">
          <div>
            <span className="font-medium">한국어</span>
            <span className="text-muted-foreground ml-2">Native</span>
          </div>
          <div>
            <span className="font-medium">영어</span>
            <span className="text-muted-foreground ml-2">Fluent (TOEIC 965)</span>
          </div>
        </div>
      </motion.div>

      {/* 위치 */}
      <motion.div
        custom={7}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="flex items-center gap-2 text-sm text-muted-foreground"
      >
        <MapPin className="w-4 h-4" />
        <span>서울시 관악구</span>
      </motion.div>
    </div>
  );
}
