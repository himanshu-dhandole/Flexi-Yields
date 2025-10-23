import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { useActiveAccount  } from "thirdweb/react";

export default function DocsPage() {
  const account = useActiveAccount ()
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <h1 className={title()}>Dev Page</h1>
        <h3>{account ? account.address : "Connect your wallet"}</h3>
        <br />
        
      </section>
    </DefaultLayout>
  );
}