import Breadcrumb from "./Breadcrumb.tsx";

interface NavProps {
  breadcrumbItems?: { label: string; href?: string }[];
}

export default function Nav({ breadcrumbItems = [] }: NavProps) {
  return (
    <nav class="bg-white border-b border-gray-200">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-14 items-center justify-between">
          <div class="flex items-center">
            <a href="/" class="text-lg font-medium text-gray-900">
              NBA Fresh
            </a>
            <div class="ml-8 flex space-x-6">
              <a
                href="/teams"
                class="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm"
              >
                Teams
              </a>
              <span
                class="text-gray-300 px-3 py-2 text-sm cursor-not-allowed"
                title="Coming soon"
              >
                Games
              </span>
              <span
                class="text-gray-300 px-3 py-2 text-sm cursor-not-allowed"
                title="Coming soon"
              >
                Players
              </span>
            </div>
          </div>
          {breadcrumbItems.length > 0 && (
            <div class="flex items-center">
              <Breadcrumb items={breadcrumbItems} />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
