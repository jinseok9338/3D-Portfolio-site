# API 패턴

> Effect + Zod를 활용한 타입 안전한 API 통신 및 에러 핸들링

## 목차
- [Effect 개요](#effect-개요)
- [Effect Client 설정](#effect-client-설정)
- [에러 타입 정의](#에러-타입-정의)
- [API 함수 작성](#api-함수-작성)
- [Zod 스키마 검증](#zod-스키마-검증)
- [TanStack Query 연동](#tanstack-query-연동)
- [에러 처리 패턴](#에러-처리-패턴)

---

## Effect 개요

### Effect란?

Effect는 TypeScript용 함수형 프로그래밍 라이브러리로, 타입 레벨에서 에러를 추적하고 안전하게 처리할 수 있습니다.

```bash
npm install effect @effect/schema
```

### 핵심 개념

```typescript
// Effect<A, E, R>
// A: 성공 값 타입
// E: 에러 타입 (타입 레벨에서 추적)
// R: 의존성 (Requirements)

import { Effect } from 'effect';

// 성공하는 Effect
const success = Effect.succeed(42);

// 실패하는 Effect
const failure = Effect.fail(new Error('Something went wrong'));

// 비동기 Effect
const fetchData = Effect.tryPromise({
  try: () => fetch('/api/data').then((r) => r.json()),
  catch: (error) => new NetworkError({ cause: error }),
});
```

### 왜 Effect인가?

| 기존 방식 (try-catch) | Effect 방식 |
|----------------------|-------------|
| 에러 타입이 `unknown` | 에러 타입이 명시적 |
| 런타임에서만 에러 확인 | 컴파일 타임에 에러 확인 |
| 에러 처리 누락 가능 | 타입 시스템이 에러 처리 강제 |
| 에러 복구 로직 복잡 | 선언적 에러 복구 |

---

## Effect Client 설정

### 기본 구조

```
shared/
├── lib/
│   ├── effect-client/
│   │   ├── index.ts           # Public exports
│   │   ├── client.ts          # HTTP 클라이언트
│   │   ├── errors.ts          # 에러 타입 정의
│   │   ├── interceptors.ts    # 요청/응답 인터셉터
│   │   └── utils.ts           # 유틸리티
│   └── query-client.ts
```

### Effect HTTP Client

```typescript
// shared/lib/effect-client/client.ts
import { Effect, Layer, Context, pipe } from 'effect';
import * as Http from '@effect/platform/HttpClient';
import * as HttpClientRequest from '@effect/platform/HttpClientRequest';
import * as HttpClientResponse from '@effect/platform/HttpClientResponse';
import { useAuthStore } from '@/features/auth';
import {
  ApiError,
  NetworkError,
  UnauthorizedError,
  NotFoundError,
  ValidationError,
  ServerError,
} from './errors';

// 환경 변수
const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

// API 클라이언트 서비스 정의
export class ApiClient extends Context.Tag('ApiClient')<
  ApiClient,
  {
    readonly request: <A>(
      req: HttpClientRequest.HttpClientRequest,
      decoder: (u: unknown) => A
    ) => Effect.Effect<A, ApiError>;
  }
>() {}

// API 클라이언트 구현
export const ApiClientLive = Layer.succeed(
  ApiClient,
  ApiClient.of({
    request: <A>(
      req: HttpClientRequest.HttpClientRequest,
      decoder: (u: unknown) => A
    ) =>
      pipe(
        req,
        // 기본 URL 설정
        HttpClientRequest.prependUrl(API_BASE_URL),
        // 인증 헤더 추가
        (request) => {
          const token = useAuthStore.getState().accessToken;
          return token
            ? HttpClientRequest.setHeader(request, 'Authorization', `Bearer ${token}`)
            : request;
        },
        // 요청 ID 추가
        HttpClientRequest.setHeader('X-Request-ID', crypto.randomUUID()),
        // 요청 실행
        Http.client.fetch,
        // 응답 처리
        Effect.flatMap((response) =>
          pipe(
            response,
            HttpClientResponse.json,
            Effect.map(decoder),
            Effect.mapError((error) => new ValidationError({ cause: error }))
          )
        ),
        // 에러 매핑
        Effect.catchTags({
          RequestError: (error) =>
            Effect.fail(new NetworkError({ message: '네트워크 오류', cause: error })),
          ResponseError: (error) => mapHttpError(error),
        })
      ),
  })
);

// HTTP 에러 매핑
function mapHttpError(error: Http.error.ResponseError): Effect.Effect<never, ApiError> {
  const status = error.response.status;

  return pipe(
    HttpClientResponse.json(error.response),
    Effect.map((body: any) => {
      switch (status) {
        case 401:
          return new UnauthorizedError({
            message: body?.message ?? '인증이 필요합니다',
          });
        case 403:
          return new UnauthorizedError({
            message: body?.message ?? '접근 권한이 없습니다',
            code: 'FORBIDDEN',
          });
        case 404:
          return new NotFoundError({
            message: body?.message ?? '리소스를 찾을 수 없습니다',
          });
        case 422:
          return new ValidationError({
            message: body?.message ?? '유효성 검사 실패',
            details: body?.details,
          });
        default:
          if (status >= 500) {
            return new ServerError({
              message: body?.message ?? '서버 오류가 발생했습니다',
              status,
            });
          }
          return new ApiError({
            message: body?.message ?? '요청 처리 중 오류가 발생했습니다',
            code: body?.code ?? 'UNKNOWN_ERROR',
            status,
          });
      }
    }),
    Effect.flatMap(Effect.fail)
  );
}
```

### 간단한 Effect Client (ky 래핑)

```typescript
// shared/lib/effect-client/client.ts
import { Effect, pipe } from 'effect';
import ky, { HTTPError } from 'ky';
import { useAuthStore } from '@/features/auth';
import {
  ApiError,
  NetworkError,
  UnauthorizedError,
  NotFoundError,
  ValidationError,
  ServerError,
} from './errors';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

// ky 인스턴스
const httpClient = ky.create({
  prefixUrl: API_BASE_URL,
  timeout: 30000,
  hooks: {
    beforeRequest: [
      (request) => {
        const token = useAuthStore.getState().accessToken;
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
        request.headers.set('X-Request-ID', crypto.randomUUID());
      },
    ],
  },
});

// Effect로 래핑된 HTTP 메서드
export const effectClient = {
  get: <A>(url: string, options?: { searchParams?: URLSearchParams }) =>
    createRequest<A>(() => httpClient.get(url, options).json()),

  post: <A>(url: string, data?: unknown) =>
    createRequest<A>(() => httpClient.post(url, { json: data }).json()),

  put: <A>(url: string, data?: unknown) =>
    createRequest<A>(() => httpClient.put(url, { json: data }).json()),

  patch: <A>(url: string, data?: unknown) =>
    createRequest<A>(() => httpClient.patch(url, { json: data }).json()),

  delete: (url: string) =>
    createRequest<void>(() => httpClient.delete(url).then(() => undefined)),
};

// Effect 생성 헬퍼
function createRequest<A>(request: () => Promise<A>): Effect.Effect<A, ApiError> {
  return pipe(
    Effect.tryPromise({
      try: request,
      catch: (error) => error,
    }),
    Effect.catchAll((error) => mapError(error))
  );
}

// 에러 매핑
function mapError(error: unknown): Effect.Effect<never, ApiError> {
  if (error instanceof HTTPError) {
    return pipe(
      Effect.tryPromise(() => error.response.json()),
      Effect.flatMap((body: any) => {
        const status = error.response.status;

        switch (status) {
          case 401:
            return Effect.fail(
              new UnauthorizedError({
                message: body?.message ?? '인증이 필요합니다',
              })
            );
          case 403:
            return Effect.fail(
              new UnauthorizedError({
                message: body?.message ?? '접근 권한이 없습니다',
                code: 'FORBIDDEN',
              })
            );
          case 404:
            return Effect.fail(
              new NotFoundError({
                message: body?.message ?? '리소스를 찾을 수 없습니다',
              })
            );
          case 422:
            return Effect.fail(
              new ValidationError({
                message: body?.message ?? '유효성 검사 실패',
                details: body?.details,
              })
            );
          default:
            if (status >= 500) {
              return Effect.fail(
                new ServerError({
                  message: body?.message ?? '서버 오류가 발생했습니다',
                  status,
                })
              );
            }
            return Effect.fail(
              new ApiError({
                message: body?.message ?? '요청 처리 중 오류가 발생했습니다',
                code: body?.code ?? 'UNKNOWN_ERROR',
                status,
              })
            );
        }
      }),
      Effect.catchAll(() =>
        Effect.fail(
          new NetworkError({ message: '응답을 파싱할 수 없습니다' })
        )
      )
    );
  }

  if (error instanceof TypeError) {
    return Effect.fail(
      new NetworkError({ message: '네트워크 연결을 확인해주세요', cause: error })
    );
  }

  return Effect.fail(
    new ApiError({
      message: error instanceof Error ? error.message : '알 수 없는 오류',
      code: 'UNKNOWN_ERROR',
    })
  );
}
```

---

## 에러 타입 정의

### 에러 클래스 계층

```typescript
// shared/lib/effect-client/errors.ts
import { Data } from 'effect';

// 기본 API 에러
export class ApiError extends Data.TaggedError('ApiError')<{
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, string[]>;
  cause?: unknown;
}> {
  get _tag() {
    return 'ApiError' as const;
  }
}

// 네트워크 에러
export class NetworkError extends Data.TaggedError('NetworkError')<{
  message: string;
  cause?: unknown;
}> {
  get _tag() {
    return 'NetworkError' as const;
  }
}

// 인증 에러
export class UnauthorizedError extends Data.TaggedError('UnauthorizedError')<{
  message: string;
  code?: 'UNAUTHORIZED' | 'FORBIDDEN' | 'TOKEN_EXPIRED';
}> {
  get _tag() {
    return 'UnauthorizedError' as const;
  }
}

// 리소스 미발견
export class NotFoundError extends Data.TaggedError('NotFoundError')<{
  message: string;
  resource?: string;
  id?: string;
}> {
  get _tag() {
    return 'NotFoundError' as const;
  }
}

// 유효성 검사 에러
export class ValidationError extends Data.TaggedError('ValidationError')<{
  message: string;
  details?: Record<string, string[]>;
  cause?: unknown;
}> {
  get _tag() {
    return 'ValidationError' as const;
  }
}

// 서버 에러
export class ServerError extends Data.TaggedError('ServerError')<{
  message: string;
  status?: number;
}> {
  get _tag() {
    return 'ServerError' as const;
  }
}

// 타임아웃 에러
export class TimeoutError extends Data.TaggedError('TimeoutError')<{
  message: string;
  timeout?: number;
}> {
  get _tag() {
    return 'TimeoutError' as const;
  }
}

// 통합 에러 타입
export type HttpError =
  | ApiError
  | NetworkError
  | UnauthorizedError
  | NotFoundError
  | ValidationError
  | ServerError
  | TimeoutError;
```

### 에러 유틸리티

```typescript
// shared/lib/effect-client/utils.ts
import { Effect, Match } from 'effect';
import type { HttpError } from './errors';

// 에러 메시지 추출
export function getErrorMessage(error: HttpError): string {
  return error.message;
}

// 사용자 친화적 에러 메시지
export function getUserFriendlyMessage(error: HttpError): string {
  return Match.value(error).pipe(
    Match.tag('NetworkError', () => '네트워크 연결을 확인해주세요'),
    Match.tag('UnauthorizedError', () => '로그인이 필요합니다'),
    Match.tag('NotFoundError', () => '요청하신 정보를 찾을 수 없습니다'),
    Match.tag('ValidationError', () => '입력 정보를 확인해주세요'),
    Match.tag('ServerError', () => '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요'),
    Match.tag('TimeoutError', () => '요청 시간이 초과되었습니다'),
    Match.orElse(() => '오류가 발생했습니다')
  );
}

// 재시도 가능 여부 확인
export function isRetryable(error: HttpError): boolean {
  return Match.value(error).pipe(
    Match.tag('NetworkError', () => true),
    Match.tag('ServerError', ({ status }) => status !== undefined && status >= 500),
    Match.tag('TimeoutError', () => true),
    Match.orElse(() => false)
  );
}
```

---

## API 함수 작성

### 기본 구조

```
features/{feature}/
├── api/
│   ├── {feature}.api.ts      # Effect 기반 API 함수
│   ├── {feature}.queries.ts  # TanStack Query 훅
│   └── {feature}.schema.ts   # Zod 스키마
└── types/
    └── {feature}.types.ts    # 타입 정의
```

### API 함수 예시

```typescript
// features/projects/api/projects.api.ts
import { Effect, pipe } from 'effect';
import { effectClient } from '@/lib/effect-client';
import { NotFoundError, ValidationError } from '@/lib/effect-client/errors';
import { projectSchema, projectListSchema } from './projects.schema';
import type { Project, CreateProjectRequest, UpdateProjectRequest, ProjectFilters } from '../types/project.types';

// 목록 조회
export function fetchProjects(params: ProjectFilters) {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.category) searchParams.set('category', params.category);
  if (params.search) searchParams.set('q', params.search);

  return pipe(
    effectClient.get<unknown>('projects', { searchParams }),
    Effect.flatMap((data) =>
      pipe(
        Effect.try(() => projectListSchema.parse(data)),
        Effect.mapError(
          (error) =>
            new ValidationError({
              message: '응답 데이터 형식이 올바르지 않습니다',
              cause: error,
            })
        )
      )
    )
  );
}

// 상세 조회
export function fetchProject(id: string) {
  return pipe(
    effectClient.get<unknown>(`projects/${id}`),
    Effect.flatMap((data) =>
      pipe(
        Effect.try(() => projectSchema.parse(data)),
        Effect.mapError(
          (error) =>
            new ValidationError({
              message: '응답 데이터 형식이 올바르지 않습니다',
              cause: error,
            })
        )
      )
    ),
    // 특정 에러에 대한 추가 컨텍스트
    Effect.mapError((error) => {
      if (error._tag === 'NotFoundError') {
        return new NotFoundError({
          message: '프로젝트를 찾을 수 없습니다',
          resource: 'Project',
          id,
        });
      }
      return error;
    })
  );
}

// 생성
export function createProject(data: CreateProjectRequest) {
  return pipe(
    effectClient.post<unknown>('projects', data),
    Effect.flatMap((response) =>
      Effect.try(() => projectSchema.parse(response))
    ),
    Effect.mapError(
      (error) =>
        new ValidationError({
          message: '프로젝트 생성 응답 형식이 올바르지 않습니다',
          cause: error,
        })
    )
  );
}

// 수정
export function updateProject(id: string, data: UpdateProjectRequest) {
  return pipe(
    effectClient.patch<unknown>(`projects/${id}`, data),
    Effect.flatMap((response) =>
      Effect.try(() => projectSchema.parse(response))
    ),
    Effect.mapError(
      (error) =>
        new ValidationError({
          message: '프로젝트 수정 응답 형식이 올바르지 않습니다',
          cause: error,
        })
    )
  );
}

// 삭제
export function deleteProject(id: string) {
  return effectClient.delete(`projects/${id}`);
}
```

### Effect 실행 유틸리티

```typescript
// shared/lib/effect-client/run.ts
import { Effect, Exit } from 'effect';
import type { HttpError } from './errors';

// Promise로 변환 (TanStack Query 연동용)
export async function runPromise<A>(
  effect: Effect.Effect<A, HttpError>
): Promise<A> {
  const exit = await Effect.runPromiseExit(effect);

  if (Exit.isFailure(exit)) {
    throw exit.cause.failures[0]; // 에러를 throw하여 TanStack Query가 처리
  }

  return exit.value;
}

// 결과 객체로 변환
export async function runSafe<A>(
  effect: Effect.Effect<A, HttpError>
): Promise<{ success: true; data: A } | { success: false; error: HttpError }> {
  const exit = await Effect.runPromiseExit(effect);

  if (Exit.isFailure(exit)) {
    return { success: false, error: exit.cause.failures[0] };
  }

  return { success: true, data: exit.value };
}
```

---

## Zod 스키마 검증

### 스키마 정의

```typescript
// features/projects/api/projects.schema.ts
import { z } from 'zod';

// 기본 스키마
export const projectSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.enum(['web', 'mobile', 'design', 'other']),
  thumbnail: z.string().url().nullable(),
  technologies: z.array(z.string()),
  githubUrl: z.string().url().nullable(),
  liveUrl: z.string().url().nullable(),
  featured: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// 목록 응답 스키마
export const projectListSchema = z.object({
  data: z.array(projectSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

// 생성 요청 스키마
export const createProjectSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요').max(100),
  description: z.string().min(10, '설명은 10자 이상 입력해주세요'),
  category: z.enum(['web', 'mobile', 'design', 'other']),
  thumbnail: z.string().url().optional(),
  technologies: z.array(z.string()).min(1, '기술 스택을 1개 이상 선택해주세요'),
  githubUrl: z.string().url().optional().or(z.literal('')),
  liveUrl: z.string().url().optional().or(z.literal('')),
  featured: z.boolean().default(false),
});

// 수정 요청 스키마
export const updateProjectSchema = createProjectSchema.partial();

// 타입 추출
export type Project = z.infer<typeof projectSchema>;
export type ProjectList = z.infer<typeof projectListSchema>;
export type CreateProjectRequest = z.infer<typeof createProjectSchema>;
export type UpdateProjectRequest = z.infer<typeof updateProjectSchema>;
```

### Effect + Zod 통합

```typescript
// shared/lib/effect-client/schema.ts
import { Effect, pipe } from 'effect';
import { z } from 'zod';
import { ValidationError } from './errors';

// Zod 스키마를 Effect로 변환
export function parseSchema<T>(schema: z.ZodType<T>) {
  return (data: unknown): Effect.Effect<T, ValidationError> =>
    pipe(
      Effect.try(() => schema.parse(data)),
      Effect.mapError(
        (error) =>
          new ValidationError({
            message: '데이터 검증 실패',
            details:
              error instanceof z.ZodError
                ? formatZodError(error)
                : undefined,
            cause: error,
          })
      )
    );
}

// Zod 에러를 포맷팅
function formatZodError(error: z.ZodError): Record<string, string[]> {
  const details: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const path = issue.path.join('.');
    if (!details[path]) {
      details[path] = [];
    }
    details[path].push(issue.message);
  }

  return details;
}

// 사용 예시
export function fetchProject(id: string) {
  return pipe(
    effectClient.get<unknown>(`projects/${id}`),
    Effect.flatMap(parseSchema(projectSchema))
  );
}
```

---

## TanStack Query 연동

### Query 훅

```typescript
// features/projects/api/projects.queries.ts
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { runPromise } from '@/lib/effect-client/run';
import * as projectsApi from './projects.api';
import type { ProjectFilters, CreateProjectRequest, UpdateProjectRequest } from '../types/project.types';

// Query Keys
export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (filters: ProjectFilters) => [...projectKeys.lists(), filters] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
};

// 목록 조회
export function useProjects(filters: ProjectFilters = {}) {
  return useQuery({
    queryKey: projectKeys.list(filters),
    queryFn: () => runPromise(projectsApi.fetchProjects(filters)),
    placeholderData: (previousData) => previousData,
  });
}

// 상세 조회
export function useProject(id: string) {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => runPromise(projectsApi.fetchProject(id)),
    enabled: !!id,
  });
}

// 무한 스크롤
export function useInfiniteProjects(category?: string) {
  return useInfiniteQuery({
    queryKey: [...projectKeys.all, 'infinite', category],
    queryFn: ({ pageParam = 1 }) =>
      runPromise(projectsApi.fetchProjects({ page: pageParam, category })),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,
    initialPageParam: 1,
  });
}

// 생성
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectRequest) =>
      runPromise(projectsApi.createProject(data)),
    onSuccess: (newProject) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      queryClient.setQueryData(projectKeys.detail(newProject.id), newProject);
    },
  });
}

// 수정
export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectRequest }) =>
      runPromise(projectsApi.updateProject(id, data)),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: projectKeys.detail(id) });
      const previousProject = queryClient.getQueryData(projectKeys.detail(id));

      queryClient.setQueryData(projectKeys.detail(id), (old: any) => ({
        ...old,
        ...data,
      }));

      return { previousProject };
    },
    onError: (err, { id }, context) => {
      queryClient.setQueryData(projectKeys.detail(id), context?.previousProject);
    },
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}

// 삭제
export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => runPromise(projectsApi.deleteProject(id)),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: projectKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}
```

---

## 에러 처리 패턴

### 컴포넌트에서 에러 처리

```typescript
// 타입 가드 활용
import { Match } from 'effect';
import type { HttpError } from '@/lib/effect-client/errors';
import { getUserFriendlyMessage } from '@/lib/effect-client/utils';

function ProjectDetail({ id }: { id: string }) {
  const { data, error, isError } = useProject(id);

  if (isError && error) {
    const httpError = error as HttpError;

    return Match.value(httpError).pipe(
      Match.tag('NotFoundError', (e) => (
        <NotFoundState message={e.message} />
      )),
      Match.tag('UnauthorizedError', () => (
        <Navigate to="/login" />
      )),
      Match.tag('NetworkError', (e) => (
        <ErrorState
          message={getUserFriendlyMessage(e)}
          onRetry={() => refetch()}
        />
      )),
      Match.orElse((e) => (
        <ErrorState message={getUserFriendlyMessage(e)} />
      ))
    );
  }

  return <ProjectView project={data} />;
}
```

### Mutation 에러 처리

```typescript
function CreateProjectForm() {
  const { mutate, isPending } = useCreateProject();
  const form = useForm<CreateProjectRequest>();

  const handleSubmit = (data: CreateProjectRequest) => {
    mutate(data, {
      onSuccess: () => {
        toast.success('프로젝트가 생성되었습니다');
        navigate('/projects');
      },
      onError: (error) => {
        const httpError = error as HttpError;

        Match.value(httpError).pipe(
          Match.tag('ValidationError', (e) => {
            // 폼 필드 에러 설정
            if (e.details) {
              Object.entries(e.details).forEach(([field, messages]) => {
                form.setError(field as keyof CreateProjectRequest, {
                  message: messages[0],
                });
              });
            }
          }),
          Match.tag('UnauthorizedError', () => {
            toast.error('로그인이 필요합니다');
            navigate('/login');
          }),
          Match.orElse((e) => {
            toast.error(getUserFriendlyMessage(e));
          })
        );
      },
    });
  };

  return <form onSubmit={form.handleSubmit(handleSubmit)}>...</form>;
}
```

### 에러 복구 패턴

```typescript
// shared/lib/effect-client/recovery.ts
import { Effect, pipe, Schedule, Duration } from 'effect';
import type { HttpError } from './errors';
import { isRetryable } from './utils';

// 재시도 정책
export const retryPolicy = Schedule.exponential(Duration.millis(1000)).pipe(
  Schedule.compose(Schedule.recurs(3)),
  Schedule.whileInput((error: HttpError) => isRetryable(error))
);

// 재시도가 적용된 API 호출
export function withRetry<A>(effect: Effect.Effect<A, HttpError>) {
  return pipe(
    effect,
    Effect.retry(retryPolicy),
    Effect.catchAll((error) => {
      // 최종 실패 시 로깅
      console.error('API 호출 최종 실패:', error);
      return Effect.fail(error);
    })
  );
}

// 폴백 값 제공
export function withFallback<A>(
  effect: Effect.Effect<A, HttpError>,
  fallback: A
) {
  return pipe(
    effect,
    Effect.catchAll(() => Effect.succeed(fallback))
  );
}

// 사용 예시
export function fetchProjectsWithRetry(filters: ProjectFilters) {
  return withRetry(fetchProjects(filters));
}

export function fetchProjectOrNull(id: string) {
  return withFallback(fetchProject(id), null);
}
```

### 토큰 리프레시 처리

```typescript
// shared/lib/effect-client/auth.ts
import { Effect, pipe, Ref } from 'effect';
import { effectClient } from './client';
import { useAuthStore } from '@/features/auth';
import { UnauthorizedError } from './errors';

// 리프레시 중복 방지
let refreshPromise: Promise<boolean> | null = null;

export async function tryRefreshToken(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) return false;

      const result = await Effect.runPromise(
        effectClient.post<{ accessToken: string; refreshToken: string }>(
          'auth/refresh',
          { refreshToken }
        )
      );

      useAuthStore.getState().login(
        useAuthStore.getState().user!,
        result.accessToken
      );
      localStorage.setItem('refresh_token', result.refreshToken);

      return true;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// 인증 에러 시 자동 리프레시
export function withAuthRefresh<A>(effect: Effect.Effect<A, HttpError>) {
  return pipe(
    effect,
    Effect.catchTag('UnauthorizedError', async (error) => {
      if (error.code === 'TOKEN_EXPIRED') {
        const refreshed = await tryRefreshToken();
        if (refreshed) {
          return effect; // 재시도
        }
      }
      useAuthStore.getState().logout();
      return Effect.fail(error);
    })
  );
}
```

---

## 체크리스트

### Effect Client
- [ ] effectClient 설정 (ky 래핑 또는 @effect/platform)
- [ ] 에러 타입 정의 (Data.TaggedError)
- [ ] 에러 매핑 로직

### API 함수
- [ ] Effect.pipe로 체이닝
- [ ] Zod 스키마 검증
- [ ] 컨텍스트 있는 에러 메시지

### TanStack Query
- [ ] runPromise로 Effect 실행
- [ ] Query Key 팩토리 패턴
- [ ] Optimistic Update

### 에러 처리
- [ ] Match 패턴으로 타입별 처리
- [ ] 사용자 친화적 에러 메시지
- [ ] 재시도/폴백 정책
