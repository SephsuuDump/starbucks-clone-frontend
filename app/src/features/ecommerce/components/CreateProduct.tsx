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
import { Plus } from "lucide-react";
import { ProductService } from "@/services/ecommerce/productService";

const categories = ["BAKED", "DESSERTS", "FRAPUCCINO", "FRUITS", "ICED CHOCOLATE", "ICED COFFEE", "ICED ESPRESSO", "ICED TEA", "PASTA", "REFRESHERS", "SANDWICHES"]

export default function CreateProduct({ setOpen, setReload }: {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    setReload: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const [onProcess, setProcess] = React.useState(false);
    const [product, setProduct] = React.useState<any>({
        name: "",
        category: "",
        description: "",
        price: 0
    })
    const [image, setImage] = React.useState<File | null>(null);
    const handleSubmit = async () => {
        try {
            setProcess(true);
            const formData = new FormData();
                formData.append("name", product.name);
                formData.append("category", product.category);
                formData.append("description", product.description);
                formData.append("price", product.price.toString());
                formData.append("image", image!);
            for (const [k, v] of formData.entries()) {
      console.log("FD:", k, v);
    }
            const data = await ProductService.createProduct(formData);
            if (data) {
                toast.success(`${product.name} has been added to products.`)
                setReload(prev => !prev)
                setOpen(prev => !prev)
            }
        } catch (error) { toast.error(`${error}`) }
        finally { setProcess(false) }
    };

    return (
        <Dialog open onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogTitle><ProcurementHeader label="create new product" /></DialogTitle>
                <form 
                    onSubmit={ e => {
                        e.preventDefault();
                        handleSubmit();
                    }} 
                    className="space-y-4"
                >
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="name">Product Name</Label>
                        <Input   
                            value={ product.name }
                            onChange={ e => setProduct((prev: any) => ({
                                ...prev,
                                name: e.target.value
                            }))}
                            required 
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="category">Category</Label>
                        <Select 
                            value={ product.category }
                            onValueChange={ (value) => setProduct((prev: any) => ({
                                ...prev,
                                category: value
                            }))}
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
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            value={ product.description }
                            onChange={ e => setProduct((prev: any) => ({
                                ...prev,
                                description: e.target.value
                            }))}
                            placeholder="Write a short description..."
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="price">Price</Label>
                        <Input 
                            value={ product.price }
                            onChange={ e => setProduct((prev: any) => ({
                                ...prev,
                                price: e.target.value
                            }))}
                            type="number" 
                            required 
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="image">Product Image</Label>
                        <Input
                            id="image"
                            name="image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                            required
                        />
                    </div>
                    <ModalButton
                        type="submit"
                        className="!bg-green-900"
                        label="Create Product"
                        loadingLabel="Creating Product"
                        onProcess={ onProcess }
                        icon={ Plus }
                    />
                </form>
            </DialogContent>
        </Dialog>
    );
}
