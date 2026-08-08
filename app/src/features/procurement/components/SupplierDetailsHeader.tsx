import { formatToPeso } from "@/lib/formatter";
import { Supplier } from "@/types/supplier";
import { Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { SupplierService } from "@/services/procurement/supplierService";
import { useAuth } from "@/hooks/use-auth";

export function SupplierDetailsHeader({ supplier }: { supplier: Supplier }) {
    const { claims, loading } = useAuth();

    const [open, setOpen] = useState(false);

    const [form, setForm] = useState({
        name: supplier.name || "",
        contact: supplier.contact || "",
        logo_url: supplier.logo_url || "",
        description: supplier.description || "",
        rating: supplier.rating || 0,
        is_active: supplier.is_active || false,
        user_id: supplier.user_id || "",
    });

    function handleChange(e: any) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleUpdateSupplier() {
        try {
            const data = await SupplierService.updateSupplier(form, supplier.id);
            if (data) {
                toast.success('Successfully updated supplier information.')
            }
            setOpen(false);
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    if (loading) return <div>Loading</div>
    return (
        <div className="flex gap-4 p-4 bg-slate-50 rounded-md shadow-sm">

            {/* IMAGE */}
            <div className="aspect-[16/9] overflow-hidden rounded-lg">
                <Image
                    src={supplier.logo_url}
                    alt={supplier.name}
                    width={200}
                    height={200}
                    className="object-fit"
                />
            </div>

            {/* INFO */}
            <div className="h-full">
                <div className="font-extrabold text-xl text-orange-900 uppercase">{supplier.name}</div>
                <div className="text-sm text-gray-500 font-bold">{supplier.contact}</div>

                {/* RATING */}
                <div className="flex gap-1 mt-4">
                    {[...Array(supplier.rating)].map((_, i) => (
                        <Star className="w-4 h-4 text-green-900" fill="#0d542b" key={i} />
                    ))}
                    {[...Array(5 - supplier.rating)].map((_, i) => (
                        <Star className="w-4 h-4 text-green-900" key={i} />
                    ))}
                </div>

                {/* ➤ EDIT BUTTON */}
                <div className="mt-4">
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            {claims.role.includes("SUPPLIER") && (
                                <Button className="!bg-green-900 text-white hover:opacity-90">
                                    Edit Supplier
                                </Button>
                            )}
                        </DialogTrigger>

                        <DialogContent className="h-10/11 overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Edit Supplier Profile</DialogTitle>
                                <DialogDescription>
                                    Modify supplier information. User ID cannot be edited.
                                </DialogDescription>
                            </DialogHeader>

                            {/* FORM */}
                            <div className="space-y-4 py-4">
                                <div>
                                    <label className="text-sm font-semibold">Name</label>
                                    <Input
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-semibold">Contact</label>
                                    <Input
                                        name="contact"
                                        value={form.contact}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-semibold">Logo URL</label>
                                    <Input
                                        name="logo_url"
                                        value={form.logo_url}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-semibold">Description</label>
                                    <Textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-semibold">Rating</label>
                                    <Input
                                        name="rating"
                                        type="number"
                                        min="0"
                                        max="5"
                                        value={form.rating}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-semibold">User ID (readonly)</label>
                                    <Input
                                        name="user_id"
                                        value={form.user_id}
                                        readOnly
                                        className="bg-gray-100 cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <DialogFooter>
                                <Button
                                    className="!bg-green-900 text-white hover:opacity-90"
                                    onClick={handleUpdateSupplier}
                                >
                                    Save Changes
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* METRICS */}
            <div className="ms-auto flex gap-8">
                <div>
                    <div className="text-2xl font-bold scale-x-120 text-green-900">
                        {formatToPeso(supplier.total_sales)}
                    </div>
                    <div className="-ml-2 text-xs font-extrabold uppercase tracking-wider">Total</div>
                    <div className="-ml-2 text-xs font-extrabold uppercase tracking-wider">Sales</div>
                </div>

                <div>
                    <div className="text-2xl font-bold scale-x-120 text-green-900">
                        {supplier.supplier_item?.length}
                    </div>
                    <div className="-ml-1.5 text-xs font-extrabold uppercase tracking-wider">Total</div>
                    <div className="-ml-1.5 text-xs font-extrabold uppercase tracking-wider">Items</div>
                </div>
            </div>
        </div>
    );
}
