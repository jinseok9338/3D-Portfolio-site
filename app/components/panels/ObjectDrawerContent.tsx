import { useSceneStore } from '~/stores/useSceneStore';
import { ROOM1_CONTENTS } from '~/components/three/room1/config';
import { ROOM2_CONTENTS } from '~/components/three/room2/config';
import type { ObjectContent } from '~/types';
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Briefcase,
  Folder,
  GitPullRequest,
  Zap,
  TrendingUp,
  CheckCircle,
  Globe,
  Award,
  Cloud,
  Languages,
  GraduationCap,
  Calendar,
  MapPin,
} from 'lucide-react';

// Room1과 Room2의 모든 콘텐츠
const ALL_CONTENTS: Record<string, ObjectContent> = {
  ...ROOM1_CONTENTS,
  ...ROOM2_CONTENTS,
};

// 오브젝트별 타이틀 (drawer 헤더용)
export function getObjectTitle(objectId: string | null): string {
  if (!objectId) return '';
  const content = ALL_CONTENTS[objectId];
  return content?.title || objectId;
}

// 아이콘 컴포넌트
function LinkIcon({ icon, className = "h-4 w-4" }: { icon?: string; className?: string }) {
  switch (icon) {
    case 'github':
      return <Github className={className} />;
    case 'linkedin':
      return <Linkedin className={className} />;
    case 'mail':
      return <Mail className={className} />;
    case 'briefcase':
      return <Briefcase className={className} />;
    case 'folder':
      return <Folder className={className} />;
    case 'git-pull-request':
      return <GitPullRequest className={className} />;
    case 'zap':
      return <Zap className={className} />;
    case 'trending-up':
      return <TrendingUp className={className} />;
    case 'check-circle':
      return <CheckCircle className={className} />;
    case 'globe':
      return <Globe className={className} />;
    case 'award':
      return <Award className={className} />;
    case 'cloud':
      return <Cloud className={className} />;
    case 'languages':
      return <Languages className={className} />;
    default:
      return <ExternalLink className={className} />;
  }
}

export function ObjectDrawerContent() {
  const activeObject = useSceneStore((state) => state.activeObject);

  if (!activeObject) return null;

  const content = ALL_CONTENTS[activeObject];
  if (!content) return null;

  return (
    <div className="space-y-8">
      {/* 서브타이틀 */}
      {content.subtitle && (
        <p className="text-sm text-primary font-medium tracking-wide uppercase -mt-4">
          {content.subtitle}
        </p>
      )}

      {/* 설명 */}
      {content.description && (
        <p className="text-muted-foreground leading-relaxed text-base">
          {content.description}
        </p>
      )}

      {/* 메트릭스 (성과 지표) */}
      {content.metrics && content.metrics.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {content.metrics.map((metric, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 p-4 border border-primary/10"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <LinkIcon icon={metric.icon} className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                  <p className="text-xs text-muted-foreground">{metric.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 경력 타임라인 */}
      {content.items && content.items.length > 0 && (
        <div className="relative space-y-6">
          {/* 타임라인 라인 */}
          <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-primary/50 via-primary/20 to-transparent" />

          {content.items.map((item, idx) => (
            <div key={idx} className="relative pl-8">
              {/* 타임라인 도트 */}
              <div className="absolute left-0 top-1.5 h-6 w-6 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-primary" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </div>
                <h4 className="text-lg font-semibold text-foreground">{item.value}</h4>
                {item.description && (
                  <p className="text-sm text-primary/80 font-medium">{item.description}</p>
                )}
                {item.highlights && item.highlights.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {item.highlights.map((highlight, hIdx) => (
                      <li key={hIdx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-primary/60 mt-0.5 flex-shrink-0" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 자격증 */}
      {content.credentials && content.credentials.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            자격증
          </h4>
          <div className="space-y-3">
            {content.credentials.map((cred, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5">
                  <LinkIcon icon={cred.icon} className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{cred.name}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {cred.issuer && <span>{cred.issuer}</span>}
                    {cred.date && (
                      <>
                        <span className="text-border">|</span>
                        <span>{cred.date}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 프로젝트 리스트 */}
      {content.projects && content.projects.length > 0 && (
        <div className="space-y-6">
          {content.projects.map((project, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50 hover:border-primary/30 transition-all duration-300"
            >
              {/* 프로젝트 헤더 */}
              <div className="p-5 pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {project.name}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-sm text-muted-foreground">
                      {project.role && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {project.role}
                        </span>
                      )}
                      {project.period && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {project.period}
                        </span>
                      )}
                    </div>
                  </div>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>

                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* 하이라이트 */}
              {project.highlights && project.highlights.length > 0 && (
                <div className="px-5 pb-4">
                  <div className="grid gap-2">
                    {project.highlights.map((highlight, hIdx) => (
                      <div
                        key={hIdx}
                        className="flex items-start gap-2 text-sm"
                      >
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span className="text-foreground/80">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 기술 스택 */}
              {project.tech && project.tech.length > 0 && (
                <div className="px-5 pb-5">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 text-xs font-medium bg-background/80 text-foreground/70 rounded-md border border-border/50"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 태그 그룹 (카테고리별) */}
      {content.tagGroups && content.tagGroups.length > 0 && (
        <div className="space-y-6">
          {content.tagGroups.map((group, idx) => (
            <div key={idx}>
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                {group.category}
              </h4>
              <div className="flex flex-wrap gap-2">
                {group.items.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 text-sm bg-gradient-to-r from-primary/5 to-primary/10 text-foreground rounded-lg border border-primary/10 hover:border-primary/30 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 일반 태그 */}
      {content.tags && content.tags.length > 0 && !content.tagGroups && (
        <div className="flex flex-wrap gap-2">
          {content.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 text-sm bg-primary/10 text-primary rounded-full font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* 링크 버튼들 */}
      {content.links && content.links.length > 0 && (
        <div className="flex flex-wrap gap-3 pt-4 border-t border-border/50">
          {content.links.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              <LinkIcon icon={link.icon} className="h-4 w-4" />
              {link.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
