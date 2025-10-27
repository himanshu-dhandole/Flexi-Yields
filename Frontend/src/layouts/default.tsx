import { Link } from "@heroui/link";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Book, FacebookIcon, InstagramIcon, XIcon } from "lucide-react";
import { GithubIcon, TwitterIcon } from "@/components/icons";
const socialLinksData = [
  { label: "Github", href: "#", icon: <GithubIcon /> },
  { label: "Instagram", href: "#", icon: <InstagramIcon /> },
  { label: "Twitter (X)", href: "#", icon: <TwitterIcon /> },
];

const handleNewsletterSubscribe = async (email: string): Promise<boolean> => {
  console.log(`Subscribing ${email}...`);
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));
  // Simulate a 70% success rate
  if (Math.random() > 0.3) {
    console.log(`Successfully subscribed ${email}!`);
    return true;
  } else {
    console.error(`Failed to subscribe ${email}.`);
    return false;
  }
};

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen ">
      <Navbar />
      <main className="w-full flex-grow -mt-16">{children}</main>
      <Footer
        logoSrc="https://i.ibb.co/wrF16VDS/Screenshot-2025-10-27-004851.png"
        onSubscribe={handleNewsletterSubscribe}
        socialLinks={socialLinksData}
      />
    </div>
  );
}
