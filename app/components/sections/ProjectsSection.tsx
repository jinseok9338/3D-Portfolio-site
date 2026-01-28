import { motion } from 'framer-motion';
import { ExternalLink, Smartphone, ShoppingBag, Building2, School } from 'lucide-react';

type Project = {
  title: string;
  period: string;
  role: string;
  company: string;
  description: string;
  highlights: string[];
  techStack: string[];
  icon: React.ReactNode;
  color: string;
};

const projects: Project[] = [
  {
    title: '미소 원앱 프로젝트',
    period: '2025.08',
    role: '테크 리드 / 아키텍트',
    company: '주식회사 앵커스',
    description:
      'React Native + Module Federation 기반으로 2개의 앱을 1개의 원앱 + 미니앱 구조로 전환',
    highlights: [
      '앱 로딩 시간 7초 → 2초 (60% 단축)',
      'Hermes Bytecode 적용으로 JS 파싱 시간 제거',
      '모노레포 구축으로 코드 관리 체계화',
    ],
    techStack: ['React Native', 'Re.Pack', 'Module Federation', 'Hermes'],
    icon: <Smartphone className="w-5 h-5" />,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: '럭셔리 브랜드 내부몰',
    period: '2024.07 ~ 현재',
    role: 'PM + 프론트엔드 총괄',
    company: '주식회사 앵커스',
    description:
      'DIOR, Burberry, Celine 등 LVMH 계열 글로벌 럭셔리 브랜드를 위한 내부몰 플랫폼',
    highlights: [
      '이벤트당 20억원+ 매출 달성',
      'GKE 멀티테넌트 아키텍처 구축',
      '대규모 동시 접속 및 결제 안정적 처리',
    ],
    techStack: ['React', 'TanStack Query', 'GKE', 'Helm', 'PostgreSQL'],
    icon: <ShoppingBag className="w-5 h-5" />,
    color: 'from-purple-500 to-pink-500',
  },
  {
    title: '현대건설 하이빌더 TFT',
    period: '2025.06 ~ 2025.08',
    role: '프론트엔드 총괄',
    company: '주식회사 앵커스',
    description: '약 20억 규모의 대형 디지털 플랫폼 안정화 프로젝트',
    highlights: [
      '200건+ 이슈 체계적 해결',
      '3개월 만에 플랫폼 안정화 및 재오픈',
      '30억 규모 신규 계약 성사 기여',
    ],
    techStack: ['jQuery', 'Spring Boot', 'MyBatis', 'MSSQL'],
    icon: <Building2 className="w-5 h-5" />,
    color: 'from-green-500 to-emerald-500',
  },
  {
    title: '학원 재원생 관리 시스템',
    period: '2018.01 ~ 2020.04',
    role: '풀스택 개발',
    company: '(주)서샘영어',
    description: '출석/납부 관리 시스템 직접 설계 및 구현 (영어 강사 → 개발자 전환 계기)',
    highlights: [
      'Firebase 기반 실시간 데이터 동기화',
      'Google Spreadsheet 연동으로 업무 효율화',
      '실제 운영 시스템 구축 경험',
    ],
    techStack: ['React', 'Express', 'Firebase', 'Cloud Functions'],
    icon: <School className="w-5 h-5" />,
    color: 'from-orange-500 to-amber-500',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function ProjectsSection() {
  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-xl font-bold">Projects</h2>
          <p className="text-sm text-muted-foreground">주요 프로젝트 경험</p>
        </div>
        <a
          href="https://github.com/jinseok9338"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-primary hover:underline"
        >
          GitHub <ExternalLink className="w-3 h-3" />
        </a>
      </motion.div>

      {/* 프로젝트 목록 */}
      <motion.div
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {projects.map((project) => (
          <motion.div
            key={project.title}
            variants={itemVariants}
            className="group relative overflow-hidden rounded-lg border bg-card p-4 hover:shadow-lg transition-shadow"
          >
            {/* 그라데이션 악센트 */}
            <div
              className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${project.color}`}
            />

            <div className="pl-3">
              {/* 헤더 */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`p-1.5 rounded-md bg-gradient-to-br ${project.color} text-white`}
                  >
                    {project.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{project.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {project.role} | {project.company}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {project.period}
                </span>
              </div>

              {/* 설명 */}
              <p className="text-sm text-muted-foreground mb-3">
                {project.description}
              </p>

              {/* 하이라이트 */}
              <ul className="space-y-1 mb-3">
                {project.highlights.map((highlight, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>

              {/* 기술 스택 */}
              <div className="flex flex-wrap gap-1.5">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 text-xs rounded-md bg-muted text-muted-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
