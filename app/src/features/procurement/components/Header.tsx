import Image from "next/image";

export function ProcurementHeader({ label }: { label: string }) {
    return(
        <section className="flex-center-y gap-2">
            <Image 
                src="/svg/logo1.svg"
                alt="Starbucks"
                width={45}
                height={45}
            />
            <div className="font-extrabold text-xl text-orange-900 uppercase">{ label }</div>
        </section>
    );
}