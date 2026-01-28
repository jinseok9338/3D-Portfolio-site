import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, MapPin, Send } from 'lucide-react';

const contacts = [
  {
    icon: <Mail className="w-5 h-5" />,
    label: 'Email',
    value: 'jinseok9338@gmail.com',
    href: 'mailto:jinseok9338@gmail.com',
    color: 'from-red-500 to-orange-500',
  },
  {
    icon: <Github className="w-5 h-5" />,
    label: 'GitHub',
    value: 'github.com/jinseok9338',
    href: 'https://github.com/jinseok9338',
    color: 'from-gray-600 to-gray-800',
  },
  {
    icon: <Linkedin className="w-5 h-5" />,
    label: 'LinkedIn',
    value: 'linkedin.com/in/jinseok9338',
    href: 'https://www.linkedin.com/in/jinseok9338/',
    color: 'from-blue-500 to-blue-700',
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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function ContactSection() {
  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-xl font-bold">Contact</h2>
        <p className="text-sm text-muted-foreground mt-1">
          프로젝트 협업이나 채용 관련 문의를 환영합니다
        </p>
      </motion.div>

      {/* 연락처 카드 */}
      <motion.div
        className="space-y-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {contacts.map((contact) => (
          <motion.a
            key={contact.label}
            href={contact.href}
            target="_blank"
            rel="noopener noreferrer"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors group"
          >
            <div
              className={`p-2.5 rounded-lg bg-gradient-to-br ${contact.color} text-white shrink-0`}
            >
              {contact.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground">{contact.label}</p>
              <p className="font-medium truncate">{contact.value}</p>
            </div>
            <Send className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </motion.a>
        ))}
      </motion.div>

      {/* 위치 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex items-center justify-center gap-2 text-sm text-muted-foreground p-4 rounded-lg bg-muted/30"
      >
        <MapPin className="w-4 h-4" />
        <span>서울시 관악구, 대한민국</span>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <p className="text-sm text-muted-foreground mb-4">
          새로운 기회에 열려 있습니다
        </p>
        <a
          href="mailto:jinseok9338@gmail.com"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
        >
          <Mail className="w-4 h-4" />
          이메일 보내기
        </a>
      </motion.div>

      {/* 응답 시간 안내 */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-xs text-muted-foreground"
      >
        보통 24시간 이내에 답변드립니다
      </motion.p>
    </div>
  );
}
