import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, MapPin, Send, FileText } from 'lucide-react';

const contacts = [
  {
    icon: <FileText className="w-5 h-5" />,
    label: 'Resume',
    value: '이력서 보기',
    href: 'https://jinseok9338.notion.site/2f3480efc1bc8064810fe02f1125868f',
    color: 'from-emerald-500 to-teal-600',
  },
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
          편하게 연락주세요
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

    </div>
  );
}
