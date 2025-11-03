import React, { useState, type FC, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';

/**
 * Props for the Footer component.
 */
interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  /** The source URL for the company logo. */
  logoSrc: string;
  /** The name of the company, displayed next to the logo. */
  companyName?: string;
  /** A short description of the company. */
  description?: string;
  /** An array of objects for generating useful links. */
  usefulLinks?: { label: string; href: string }[];
  /** An array of objects for generating social media links. */
  socialLinks?: { label: string; href: string; icon: ReactNode }[];
  /** The title for the newsletter subscription section. */
  newsletterTitle?: string;
  /** Async function to handle email subscription. Should return `true` for success and `false` for failure. */
  onSubscribe?: (email: string) => Promise<boolean>;
}

/**
 * A minimal, tech-focused footer component with sharp edges and monospace typography.
 * Follows the DeFi aesthetic with orange accents and clean borders.
 */
export const Footer: FC<FooterProps> = ({
  logoSrc,
  companyName = 'FLEXI YIELD',
  description = 'Your gateway to flexible DeFi yield solutions. Empowering your crypto assets with innovative strategies.',
  usefulLinks = [
    { label: 'PRODUCTS', href: '#' },
    { label: 'CAREERS', href: '#' },
    { label: 'CONTACT US', href: '#' },
    { label: 'PRIVACY POLICY', href: '#' },
  ],
  socialLinks = [
    { label: 'FACEBOOK', href: '#', icon: <DummyIcon /> },
    { label: 'INSTAGRAM', href: '#', icon: <DummyIcon /> },
    { label: 'TWITTER (X)', href: '#', icon: <DummyIcon /> },
  ],
  newsletterTitle = 'SUBSCRIBE OUR NEWSLETTER',
  onSubscribe,
  className,
  ...props
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubscribe = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !onSubscribe || isSubmitting) return;

    setIsSubmitting(true);
    const success = await onSubscribe(email);

    setSubscriptionStatus(success ? 'success' : 'error');
    setIsSubmitting(false);

    if (success) {
      setEmail('');
    }

    // Reset the status message after 3 seconds
    setTimeout(() => {
      setSubscriptionStatus('idle');
    }, 3000);
  };

  return (
    <footer 
      className={cn('border-t border-[#FF6B2C]/20 bg-background text-foreground', className)} 
      {...props}
    >
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center gap-3">
              <div >
                <img 
                  src={logoSrc} 
                  alt={`${companyName} Logo`} 
                  className="h-10 w-10 object-contain" 
                />
              </div>
              <span className="text-xl font-mono font-bold">{companyName}</span>
            </div>
            <p className="text-sm font-mono text-muted-foreground leading-relaxed">
              {description}
            </p>
          </motion.div>

          {/* Useful Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:justify-self-center"
          >
            <h3 className="mb-6 text-sm font-mono font-bold text-[#FF6B2C]">
              USEFUL LINKS
            </h3>
            <ul className="space-y-3">
              {usefulLinks.map((link, index) => (
                <motion.li
                  key={link.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <a
                    href={link.href}
                    className="text-sm font-mono text-muted-foreground transition-colors hover:text-[#FF6B2C] flex items-center gap-2 group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Follow Us */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:justify-self-center"
          >
            <h3 className="mb-6 text-sm font-mono font-bold text-[#FF6B2C]">
              FOLLOW US
            </h3>
            <ul className="space-y-3">
              {socialLinks.map((link, index) => (
                <motion.li
                  key={link.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <a
                    href={link.href}
                    aria-label={link.label}
                    className="flex items-center gap-3 text-sm font-mono text-muted-foreground transition-colors hover:text-[#FF6B2C] group"
                  >
                    <span className="group-hover:text-[#FF6B2C] transition-colors">
                      {link.icon}
                    </span>
                    <span>{link.label}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="mb-6 text-sm font-mono font-bold text-[#FF6B2C]">
              {newsletterTitle}
            </h3>
            <form onSubmit={handleSubscribe} className="relative">
              <div className="relative border border-[#FF6B2C]/20 overflow-hidden">
                <input
                  type="email"
                  placeholder="YOUR EMAIL ADDRESS"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting || subscriptionStatus !== 'idle'}
                  required
                  aria-label="Email for newsletter"
                  className="w-full bg-transparent px-4 py-3 font-mono text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting || subscriptionStatus !== 'idle'}
                className="mt-3 w-full bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white font-mono text-sm py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  'SUBSCRIBING...'
                ) : (
                  <>
                    SUBSCRIBE
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              {/* Status Message */}
              {subscriptionStatus !== 'idle' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    'mt-3 flex items-center gap-2 border p-3 font-mono text-xs',
                    subscriptionStatus === 'success' 
                      ? 'border-green-500/20 bg-green-500/5 text-green-500' 
                      : 'border-red-500/20 bg-red-500/5 text-red-500'
                  )}
                >
                  {subscriptionStatus === 'success' ? (
                    <>
                      <CheckCircle size={16} />
                      <span>SUBSCRIBED SUCCESSFULLY!</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={16} />
                      <span>SUBSCRIPTION FAILED. TRY AGAIN.</span>
                    </>
                  )}
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 pt-8 border-t border-[#FF6B2C]/20"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs font-mono text-muted-foreground">
              © {new Date().getFullYear()} {companyName}. ALL RIGHTS RESERVED.
            </p>
            <div className="flex gap-6">
              <a 
                href="#" 
                className="text-xs font-mono text-muted-foreground hover:text-[#FF6B2C] transition-colors"
              >
                TERMS OF SERVICE
              </a>
              <a 
                href="#" 
                className="text-xs font-mono text-muted-foreground hover:text-[#FF6B2C] transition-colors"
              >
                PRIVACY POLICY
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

// Dummy Icon: Replace with your actual icon library e.g., Lucide React
const DummyIcon: FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="4" />
  </svg>
);