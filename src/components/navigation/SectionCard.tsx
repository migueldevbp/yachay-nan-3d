import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { useConfirmNavigation } from '@/hooks/useConfirmNavigation';

interface SectionCardProps {
  to: string;
  title: string;
  description: string;
}

export function SectionCard({ to, title, description }: SectionCardProps) {
  const { guardClick } = useConfirmNavigation();

  return (
    <Card className="section-card">
      <h3 className="section-card__title">
        <Link to={to} onClick={guardClick}>
          {title}
        </Link>
      </h3>
      <p className="section-card__description">{description}</p>
    </Card>
  );
}
