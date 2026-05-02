import CheckoutClient from "@/components/CheckoutClient";

export default function Page({ searchParams }: any) {
  const planId = searchParams?.planId ?? "pro";

  return <CheckoutClient planId={planId} />;
}