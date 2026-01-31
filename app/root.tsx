import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import { Providers } from "./providers";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* SEO Meta Tags - CSR 모드에서 크롤러가 읽을 수 있도록 직접 삽입 */}
        <title>Jinseok Seo | Frontend Developer</title>
        <meta name="description" content="프론트엔드 개발자 서진석의 인터랙티브 3D 포트폴리오. React, Three.js를 활용한 몰입형 웹 경험을 제공합니다." />
        <meta name="keywords" content="프론트엔드 개발자, Frontend Developer, React, Three.js, 포트폴리오, 서진석, Jinseok Seo, 웹 개발자, 3D 웹" />
        <meta name="author" content="Jinseok Seo (서진석)" />
        <meta name="theme-color" content="#0f172a" />
        <link rel="canonical" href="https://portfolio.jinseok9338.info" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://portfolio.jinseok9338.info" />
        <meta property="og:title" content="Jinseok Seo | Frontend Developer" />
        <meta property="og:description" content="프론트엔드 개발자 서진석의 인터랙티브 3D 포트폴리오. React, Three.js를 활용한 몰입형 웹 경험을 제공합니다." />
        <meta property="og:image" content="https://portfolio.jinseok9338.info/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="ko_KR" />
        <meta property="og:site_name" content="Jinseok Seo Portfolio" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://portfolio.jinseok9338.info" />
        <meta name="twitter:title" content="Jinseok Seo | Frontend Developer" />
        <meta name="twitter:description" content="프론트엔드 개발자 서진석의 인터랙티브 3D 포트폴리오. React, Three.js를 활용한 몰입형 웹 경험을 제공합니다." />
        <meta name="twitter:image" content="https://portfolio.jinseok9338.info/og-image.png" />

        <Meta />
        <Links />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Providers>
      <Outlet />
    </Providers>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
