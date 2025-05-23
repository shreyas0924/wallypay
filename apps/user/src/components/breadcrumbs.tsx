import * as React from "react";
import Link from "next/link";

interface BreadcrumbItem {
  title: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
}

export function Breadcrumbs({ items, separator }: BreadcrumbsProps) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2">
        {items.map((item, index) => (
          <React.Fragment key={item.href}>
            <li>
              <Link
                href={item.href}
                className={`text-sm hover:text-foreground ${
                  index === items.length - 1
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {item.title}
              </Link>
            </li>
            {index < items.length - 1 && (
              <li className="text-muted-foreground">{separator}</li>
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}