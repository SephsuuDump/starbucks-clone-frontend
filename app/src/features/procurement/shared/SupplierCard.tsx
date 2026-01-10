"use client"

import { Button } from "@/components/ui/button";
import { Bookmark, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { SupplierService } from "@/services/procurement/supplierService";

export function SupplierCard({ role, supplier }: { 
    supplier: any,
    role: string
}) {

    async function verifySupplier(active: boolean, id: string) {
        try {
            const data = await SupplierService.updateActiveState(active, id)

            if (data) {
                toast.error("Failed to verify supplier.");
                return;
            }

            toast.success("Supplier verified successfully!");
            window.location.reload();
        } catch (error: any) {
            toast.error(error.message);
        }
    }


    return (
        <div className="flex flex-col gap-2 rounded-lg shadow-sm bg-white p-1 break-inside-avoid mb-4">
            <div className="p-4 bg-orange-50 rounded-sm">
                <div className="flex-center-y justify-between">
                    <div className="flex gap-1">
                        {[...Array(supplier.rating)].map((_, i) => (
                            <Star className="w-4 h-4 text-orange-900" fill="#7e2a0c" key={i} />
                        ))}
                        {[...Array(5 - supplier.rating)].map((_, i) => (
                            <Star className="w-4 h-4 text-orange-900" key={i} />
                        ))}
                    </div>
                    <button><Bookmark className="w-5 h-5 text-green-900" /></button>
                </div>
                <div className="text-3xl py-4">{ supplier.description }</div>
            </div>

            <div className="flex-center-y justify-between px-4 pb-2 my-auto">
                <div className="flex-center-y gap-2">
                    <img src={ supplier.logo_url } alt={ supplier.name } className="w-10 h-10" />
                    <div>
                        <div className="text-sm text-orange-900 font-bold tracking-wider uppercase">{ supplier.name }</div>
                        <div className="text-xs text-gray-500">{ supplier.contact }</div>
                    </div>
                </div>

                <div className="flex-center-y gap-2">
                    {role.includes("MANAGER") && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    className="text-xs rounded-full bg-green-900 text-white px-3 py-1 h-6"
                                >
                                    EDIT
                                </Button>
                            </AlertDialogTrigger>

                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Verify this supplier?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will change the supplier status to <b>Active</b>.  
                                        Do you want to continue?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>

                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                        className="!bg-green-900 text-white"
                                        onClick={() => verifySupplier(true, supplier.id)}
                                    >
                                        Yes, Verify Supplier
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}

                    {supplier.is_active && (
                        <Link
                            href={role.includes("EMPLOYEE") ? `/procurement/purchase-order/${supplier.id}` : `/procurement/suppliers/${supplier.id}`}
                            className="text-xs rounded-full bg-green-900 text-white px-3 py-1"
                        >
                            {role.includes("EMPLOYEE") ? "ORDER" : "VIEW"}
                        </Link>
                    )}
                </div>
                
            </div>
        </div>
    );
}
