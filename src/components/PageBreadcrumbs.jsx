import Link from "next/link";

export default function PageBreadcrumbs({ items }) {
  if (!items?.length) {
    return null;
  }

  return (
    <nav className="page-breadcrumbs" aria-label="Breadcrumb">
      <div className="container">
        <ol className="page-breadcrumbs-list">
          {items.map((item, index) => {
            const isCurrent = index === items.length - 1;

            return (
              <li className="page-breadcrumbs-item" key={`${item.href}-${item.label}`}>
                {isCurrent ? (
                  <span aria-current="page">{item.label}</span>
                ) : (
                  <Link href={item.href}>{item.label}</Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
