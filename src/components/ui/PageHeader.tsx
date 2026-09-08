import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  lead?: string;
  children?: ReactNode;
}

export function PageHeader({ title, lead, children }: PageHeaderProps) {
  return (
    <header className="page-header">
      <h1 className="page-title" tabIndex={-1}>
        {title}
      </h1>
      {lead ? <p className="page-lead">{lead}</p> : null}
      {children}
    </header>
  );
}
