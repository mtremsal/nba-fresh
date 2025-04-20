import { type PageProps } from "$fresh/server.ts";
import Nav from "../components/Nav.tsx";

interface CustomPageData {
  breadcrumbItems?: { label: string; href?: string }[];
}

export default function App({ Component, data }: PageProps<CustomPageData>) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>NBA 2022-23</title>
      </head>
      <body>
        <div class="min-h-screen bg-gray-50">
          <Nav breadcrumbItems={data?.breadcrumbItems || []} />
          <main>
            <Component />
          </main>
        </div>
      </body>
    </html>
  );
}
