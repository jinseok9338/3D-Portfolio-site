import { motion } from 'framer-motion';

type SkillCategory = {
  name: string;
  skills: {
    name: string;
    level: number; // 1-5
    color: string;
  }[];
};

const skillCategories: SkillCategory[] = [
  {
    name: 'Frontend',
    skills: [
      { name: 'React', level: 5, color: 'bg-cyan-500' },
      { name: 'TypeScript', level: 5, color: 'bg-blue-500' },
      { name: 'Next.js', level: 4, color: 'bg-gray-500' },
      { name: 'React Native', level: 4, color: 'bg-cyan-600' },
      { name: 'TanStack Query', level: 4, color: 'bg-red-500' },
    ],
  },
  {
    name: 'Build & Bundler',
    skills: [
      { name: 'Vite', level: 4, color: 'bg-purple-500' },
      { name: 'Webpack', level: 4, color: 'bg-blue-400' },
      { name: 'Module Federation', level: 4, color: 'bg-indigo-500' },
      { name: 'TurboRepo', level: 3, color: 'bg-pink-500' },
    ],
  },
  {
    name: 'Infrastructure',
    skills: [
      { name: 'Docker', level: 4, color: 'bg-blue-500' },
      { name: 'GKE', level: 3, color: 'bg-blue-400' },
      { name: 'AWS', level: 3, color: 'bg-orange-500' },
      { name: 'Helm', level: 3, color: 'bg-blue-600' },
    ],
  },
  {
    name: 'Backend (협업)',
    skills: [
      { name: 'Node.js', level: 3, color: 'bg-green-500' },
      { name: 'Express', level: 3, color: 'bg-gray-500' },
      { name: 'Firebase', level: 3, color: 'bg-amber-500' },
      { name: 'PostgreSQL', level: 2, color: 'bg-blue-700' },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

function SkillBar({ name, level, color }: { name: string; level: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{name}</span>
        <span className="text-muted-foreground text-xs">
          {level === 5 && 'Expert'}
          {level === 4 && 'Advanced'}
          {level === 3 && 'Intermediate'}
          {level === 2 && 'Basic'}
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${level * 20}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export function SkillsSection() {
  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-bold">Skills</h2>
        <p className="text-sm text-muted-foreground">기술 스택 및 숙련도</p>
      </motion.div>

      {/* 핵심 역량 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20"
      >
        <h3 className="text-sm font-semibold mb-2">Core Competencies</h3>
        <div className="flex flex-wrap gap-2">
          {[
            '렌더링 최적화',
            '번들 최적화',
            '아키텍처 설계',
            '성능 튜닝',
            'Core Web Vitals',
          ].map((comp) => (
            <span
              key={comp}
              className="px-2 py-1 text-xs rounded-md bg-background/50 border"
            >
              {comp}
            </span>
          ))}
        </div>
      </motion.div>

      {/* 기술 카테고리 */}
      <motion.div
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {skillCategories.map((category) => (
          <motion.div key={category.name} variants={itemVariants}>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
              {category.name}
            </h3>
            <div className="space-y-3">
              {category.skills.map((skill) => (
                <SkillBar
                  key={skill.name}
                  name={skill.name}
                  level={skill.level}
                  color={skill.color}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* 추가 도구 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
          Tools & Others
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            'Git',
            'GitHub Actions',
            'Figma',
            'Jira',
            'Slack',
            'Notion',
            'VS Code',
            'Postman',
          ].map((tool) => (
            <span
              key={tool}
              className="px-2 py-1 text-xs rounded-md bg-muted text-muted-foreground"
            >
              {tool}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
