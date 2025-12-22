"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ModalButton } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProcurementHeader } from "@/features/procurement/components/Header";
import { toast } from "sonner";
import { ProductService } from "@/services/ecommerce/productService";
import { Plus } from "lucide-react";

const categories = ["BAKED", "DESSERTS", "FRAPUCCINO", "FRUITS", "ICED CHOCOLATE", "ICED COFFEE", "ICED ESPRESSO", "ICED TEA", "PASTA", "REFRESHERS", "SANDWICHES"];

export default function UpdateProduct({ toUpdate, setUpdate, setReload }: any) {
    console.log(toUpdate);
    
    const [onProcess, setProcess] = React.useState(false);
    const [product, setProduct] = React.useState<any>(toUpdate);

    const [image, setImage] = React.useState<File | null>(null);

    const handleSubmit = async () => {
        try {
            setProcess(true);

            const formData = new FormData();
            formData.append("id", product.id);
            formData.append("name", product.name);
            formData.append("category", product.category);
            formData.append("description", product.description);
            formData.append("price", product.price.toString());

            // 👇 Only append image if user selected a new one
            if (image) formData.append("image", image);

            const data = await ProductService.updateProduct(formData);

            if (data) {
                toast.success(`${product.name} has been updated successfully.`);
                setReload((prev: any) => !prev);
                setUpdate(false);
            }
        } catch (error) {
            toast.error(`${error}`);
        } finally {
            setProcess(false);
        }
    };

    return (
        <Dialog open onOpenChange={ (open) => { if (!open) setUpdate(undefined) }}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogTitle><ProcurementHeader label="Update product" /></DialogTitle>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                    className="space-y-4"
                >
                    <div className="flex flex-col gap-1">
                        <Label>Product Name</Label>
                        <Input
                            value={product.name}
                            onChange={(e) =>
                                setProduct((prev: any) => ({
                                    ...prev,
                                    name: e.target.value
                                }))
                            }
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label>Category</Label>
                        <Select
                            value={product.category}
                            onValueChange={(value) =>
                                setProduct((prev: any) => ({
                                    ...prev,
                                    category: value
                                }))
                            }
                            required
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat} value={cat}>
                                        {cat}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label>Description</Label>
                        <Textarea
                            value={product.description}
                            onChange={(e) =>
                                setProduct((prev: any) => ({
                                    ...prev,
                                    description: e.target.value
                                }))
                            }
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label>Price</Label>
                        <Input
                            value={product.price}
                            onChange={(e) =>
                                setProduct((prev: any) => ({
                                    ...prev,
                                    price: e.target.value
                                }))
                            }
                            type="number"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label>Update Image (optional)</Label>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                        />
                        <p className="text-xs text-gray-500">Leave empty to keep current image.</p>
                    </div>

                    <ModalButton
                        type="submit"
                        className="!bg-green-900"
                        label="Update Product"
                        loadingLabel="Updating..."
                        onProcess={onProcess}
                        icon={Plus}
                    />
                </form>
            </DialogContent>
        </Dialog>
    );
}
