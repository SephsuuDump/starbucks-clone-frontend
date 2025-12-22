"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ImageOff, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import DeleteLocation from "./DeleteLocationModal";
import LocationUpdateModal from "./UpdateLocationModal";

type LocationCardProps = {
    id : string,
    name: string;
    location: string;
    imageUrl?: string | null;
    type : string;
    onEdit?: () => void;
    onDelete?: () => void;
    reload?: () => void;
};

export function LocationCard({
    id,
    name,
    location,
    imageUrl,
    type,
    onEdit,
    onDelete,
    reload
}: LocationCardProps) {
    const [loading, setLoading] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [selected, setSelected] = useState<{ id: string; name: string, location : string } | null>(null);

    function handleSelected() {
        setSelected({ id, name, location });
    }
    return (
        <>
            {openDelete && selected && (
                <DeleteLocation
                id={selected.id}
                name={selected.name}
                type={type}
                setOpenDelete={setOpenDelete}
                setLoading={setLoading}
                loading={loading}
                reload={reload}
                />
            )}


            {openEdit && selected && (
                <LocationUpdateModal
                id={selected.id}
                name={selected.name}
                location={selected.location}
                type={type}
                setOpenEdit={setOpenEdit}
                setLoading={setLoading}
                loading={loading}
                reload={reload}
                />
            )}

            <Card
                className="
                    w-[240px] h-[380px] overflow-hidden rounded-2xl
                    border border-neutral-200/70 shadow-sm hover:shadow-md transition
                    flex flex-col
                "
                >
                <div className="relative w-full flex-[0_0_50%]">
                    {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-neutral-400 bg-gray-100">
                        <ImageOff className="h-6 w-6" />
                    </div>
                    )}
                </div>

                <CardContent className="flex flex-col justify-between flex-1 p-3">
                    <div className="flex flex-col gap-1 overflow-hidden">
                    <h3 className="text-base font-semibold text-neutral-900 break-words">{name}</h3>
                    <p className="text-sm text-neutral-600 break-words leading-tight">{location}</p>
                    </div>

                    <div className="mt-3 flex gap-2">
                    <Button
                        onClick={() => {
                        setOpenEdit(true);
                        handleSelected();
                        }}
                        variant="secondary"
                        size="sm"
                        className="flex-1 h-8 text-sm"
                    >
                        Edit
                    </Button>
                    <Button
                        onClick={() => {
                        setOpenDelete(true);
                        handleSelected();
                        }}
                        variant="destructive"
                        size="sm"
                        className="flex-1 h-8 text-sm"
                    >
                        Delete
                    </Button>
                    </div>
                </CardContent>
                </Card>

        </>
    );
}
