"use client";
import { useEffect, useState } from "react";
import {
  Landmark,
  Fingerprint,
  Car,
  GraduationCap,
  BriefcaseBusiness,
  House,
  LifeBuoy,
  HeartPulse,
  Zap,
  Scale,
  Shield,
  HandHeart,
  Sprout,
  ChartNoAxesCombined,
} from "lucide-react";
const icons: Record<string, typeof Landmark> = {
  government: Landmark,
  identity: Fingerprint,
  transport: Car,
  education: GraduationCap,
  tax: BriefcaseBusiness,
  property: House,
  support: LifeBuoy,
  health: HeartPulse,
  utilities: Zap,
  justice: Scale,
  safety: Shield,
  welfare: HandHeart,
  agriculture: Sprout,
  data: ChartNoAxesCombined,
};
export function CategoryIcon({
  category,
  size = 24,
}: {
  category: string;
  size?: number;
}) {
  const Icon = icons[category] || Landmark;
  return <Icon size={size} strokeWidth={1.6} />;
}
export default function ResourceIcon({
  name,
  url,
  category,
}: {
  name: string;
  url?: string;
  category: string;
}) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [url]);
  return (
    <span className={"resource-logo category-" + category}>
      {url && !failed ? (
        <img
          src={url}
          alt={`${name} site icon`}
          width={38}
          height={38}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
        />
      ) : (
        <CategoryIcon category={category} size={29} />
      )}
    </span>
  );
}
