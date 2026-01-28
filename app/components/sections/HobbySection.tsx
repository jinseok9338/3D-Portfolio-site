import { motion } from 'framer-motion';
import { Music, Film, Dumbbell, Heart } from 'lucide-react';

const hobbies = [
  {
    icon: <Music className="w-6 h-6" />,
    title: '음악',
    description: '다양한 장르의 음악 감상을 즐깁니다',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    icon: <Film className="w-6 h-6" />,
    title: '영화',
    description: 'SF, 스릴러 등 다양한 영화 감상',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: <Dumbbell className="w-6 h-6" />,
    title: '헬스',
    description: '규칙적인 운동으로 건강 관리',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/10',
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
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

export function HobbySection() {
  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-xl font-bold">Hobby</h2>
        <p className="text-sm text-muted-foreground mt-1">
          일 외에 즐기는 것들
        </p>
      </motion.div>

      {/* 취미 카드 */}
      <motion.div
        className="grid gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {hobbies.map((hobby) => (
          <motion.div
            key={hobby.title}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className={`relative overflow-hidden rounded-xl p-5 ${hobby.bgColor} border`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-lg bg-gradient-to-br ${hobby.color} text-white shrink-0`}
              >
                {hobby.icon}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{hobby.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {hobby.description}
                </p>
              </div>
            </div>

            {/* 장식 요소 */}
            <div
              className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-gradient-to-br ${hobby.color} opacity-10 blur-xl`}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* 추가 관심사 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="p-4 rounded-lg bg-muted/30"
      >
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
          <Heart className="w-4 h-4" />
          Also Interested In
        </h3>
        <div className="flex flex-wrap gap-2">
          {['새로운 기술 탐구', '오픈소스 기여', '사이드 프로젝트', '기술 블로깅'].map(
            (interest) => (
              <span
                key={interest}
                className="px-3 py-1.5 text-sm rounded-full bg-background border"
              >
                {interest}
              </span>
            )
          )}
        </div>
      </motion.div>

      {/* Work-Life Balance */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center p-4"
      >
        <p className="text-sm text-muted-foreground italic">
          "좋은 코드는 건강한 삶에서 나온다고 믿습니다"
        </p>
      </motion.div>
    </div>
  );
}
