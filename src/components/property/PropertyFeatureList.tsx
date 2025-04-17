
import { Check } from 'lucide-react';

interface PropertyFeatureListProps {
  features: string[];
}

export const PropertyFeatureList = ({ features }: PropertyFeatureListProps) => {
  if (features.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {features.map((feature, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div className="rounded-full bg-primary/10 p-1">
            <Check className="h-3 w-3 text-primary" />
          </div>
          <span>{feature}</span>
        </div>
      ))}
    </div>
  );
};
