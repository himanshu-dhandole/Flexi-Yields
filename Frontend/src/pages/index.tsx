import DefaultLayout from '@/layouts/default';
import MynaHero from "@/components/myna-hero";

export default function HeroPage() {
  return (
    <DefaultLayout>
      <div className='-pt-6'>
      <MynaHero />
      </div>
    </DefaultLayout>
  );
}

