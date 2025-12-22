"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ModalButton } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ProcurementHeader } from "@/features/procurement/components/Header";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { CustomerService } from "@/services/ecommerce/customerService";

export default function UpdateAccount({ toUpdate, setUpdate, setReload }: any) {
    const [onProcess, setProcess] = React.useState(false);
    const [customer, setCustomer] = React.useState<any>(toUpdate);

    const handleSubmit = async () => {
        try {
            setProcess(true);
            const data = await CustomerService.updateCustomer(customer);
            if (data) {
                toast.success("Customer updated successfully");
                setReload((prev: any) => !prev);
                setUpdate(undefined);
            }
        } catch (error) {
            toast.error(String(error));
        } finally {
            setProcess(false);
        }
    };

    return (
        <Dialog open onOpenChange={(open) => { if (!open) setUpdate(undefined) }}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogTitle>
                    <ProcurementHeader label="Update Profile" />
                </DialogTitle>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                    className="space-y-4"
                >

                    {/* ✅ NAME FIELDS */}
                    <div className="flex flex-col gap-1">
                        <Label>First Name</Label>
                        <Input
                            value={customer.first_name ?? ''}
                            onChange={(e) =>
                                setCustomer((prev: any) => ({ ...prev, first_name: e.target.value }))
                            }
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label>Middle Name</Label>
                        <Input
                            value={customer.middle_name ?? ''}
                            onChange={(e) =>
                                setCustomer((prev: any) => ({ ...prev, middle_name: e.target.value }))
                            }
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label>Last Name</Label>
                        <Input
                            value={customer.last_name ?? ''}
                            onChange={(e) =>
                                setCustomer((prev: any) => ({ ...prev, last_name: e.target.value }))
                            }
                            required
                        />
                    </div>

                    {/* ✅ CONTACT & ADDRESS FIELDS */}
                    <div className="flex flex-col gap-1">
                        <Label>Phone</Label>
                        <Input
                            value={customer.phone}
                            onChange={(e) =>
                                setCustomer((prev: any) => ({ ...prev, phone: e.target.value }))
                            }
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label>Address</Label>
                        <Input
                            value={customer.address}
                            onChange={(e) =>
                                setCustomer((prev: any) => ({ ...prev, address: e.target.value }))
                            }
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                            <Label>City</Label>
                            <Input
                                value={customer.city}
                                onChange={(e) =>
                                    setCustomer((prev: any) => ({ ...prev, city: e.target.value }))
                                }
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <Label>Province</Label>
                            <Input
                                value={customer.province}
                                onChange={(e) =>
                                    setCustomer((prev: any) => ({ ...prev, province: e.target.value }))
                                }
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                            <Label>Zip Code</Label>
                            <Input
                                value={customer.zip_code}
                                onChange={(e) =>
                                    setCustomer((prev: any) => ({ ...prev, zip_code: e.target.value }))
                                }
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <Label>Country</Label>
                            <Input
                                value={customer.country}
                                onChange={(e) =>
                                    setCustomer((prev: any) => ({ ...prev, country: e.target.value }))
                                }
                                required
                            />
                        </div>
                    </div>

                    <ModalButton
                        type="submit"
                        className="!bg-green-900"
                        label="Update Account"
                        loadingLabel="Updating Account..."
                        onProcess={onProcess}
                        icon={Plus}
                    />
                </form>
            </DialogContent>
        </Dialog>
    );
}
