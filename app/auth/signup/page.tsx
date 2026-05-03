import { Suspense } from "react";
import SignupClient from "./SignupClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-20 text-center">Loading...</div>}>
      <SignupClient />
    </Suspense>
  );
}