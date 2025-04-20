interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol class="flex items-center space-x-2">
        {items.map((item) => (
          <li key={item.label} class="flex items-center">
            <span class="text-gray-400 mx-2">/</span>
            {item.href ? (
              <a
                href={item.href}
                class="text-gray-400 hover:text-gray-600 text-sm"
              >
                {item.label}
              </a>
            ) : (
              <span class="text-gray-600 text-sm">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}