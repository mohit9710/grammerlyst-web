import ForgotPasswordClient from "@/components/ForgotPasswordClient";
import { Suspense } from "react";

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForgotPasswordClient />
    </Suspense>
  );
}