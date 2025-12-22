'use client'

import ResourceForm from "@/components/custom/project/ResourceForm";
import { ProcurementHeader } from "@/components/custom/procurement/Header";
import { useRouter } from "next/navigation";

export default function CreateResourcePage() {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-6">
      <ProcurementHeader label="Create Resource" />
      <ResourceForm onSaved={() => router.push("/project/resources")} />
    </div>
  );
}
