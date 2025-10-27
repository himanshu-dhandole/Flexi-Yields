import { Brain, TrendingUp, Shield, Zap, ArrowRight, Activity, Target } from 'lucide-react';
import DefaultLayout from '@/layouts/default';
import Web3HeroSection from '@/components/web3-hero-section';

export default function HeroPage() {
  const metrics = [
    { label: 'Total Value Locked', value: '$847M', change: '+12.4%' },
    { label: 'Active Strategies', value: '2,847', change: '+8.2%' },
    { label: 'Average APY', value: '23.7%', change: '+5.1%' }
  ];

  return (
    <DefaultLayout>
      <div className='pt-16'>
      <Web3HeroSection/>
      </div>
    </DefaultLayout>
  );
}