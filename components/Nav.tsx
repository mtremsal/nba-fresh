import Breadcrumb from "./Breadcrumb.tsx";

interface NavProps {
  breadcrumbItems?: { label: string; href?: string }[];
}

export default function Nav({ breadcrumbItems = [] }: NavProps) {
  return (
    <nav class="bg-white border-b border-gray-200">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Use flex and justify-start for the main container */}
        <div class="flex h-14 items-center justify-start">
          {/* Group Title and Links together */}
          <div class="flex items-center">
            <div class="flex-shrink-0 text-black mr-6"> {/* Changed text-white to text-black for visibility on white bg */}
              <a href="/" class="font-semibold text-xl tracking-tight">
                NBA 2022-23
              </a>
            </div>
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

          {/* Push Breadcrumbs to the right */}
          {breadcrumbItems.length > 0 && (
            <div class="flex items-center ml-auto"> {/* Added ml-auto */}
              <Breadcrumb items={breadcrumbItems} />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
