"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const branches = [
    {
        id: "032e6326-d605-4e4d-a0de-8c5f62f70774",
        name: "Starbucks Hiraya",
        location: "Tagaytay City, Cavite",
        image_url: "https://lawaadzoxwufjbskafzu.supabase.co/storage/v1/object/public/images/location-images/1768178802241.jpg",
    },
    {
        id: "0b0f48e1-6866-4776-9ce9-31309f5f4dbe",
        name: "Starbucks Trece",
        location: "Trece Martires City",
        image_url: "https://lawaadzoxwufjbskafzu.supabase.co/storage/v1/object/public/images/location-images/1768178849854.jpg",
    },
    {
        id: "7e42ef23-002b-4d39-8d12-9101bbaf2385",
        name: "Starbucks Maple Grove",
        location: "General Trias Cavite",
        image_url: "https://lawaadzoxwufjbskafzu.supabase.co/storage/v1/object/public/images/location-images/1768178896021.jpg",
    },
];

export function EcommerceCustomerLandingPage() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {branches.map((branch) => (
                <div
                    key={branch.id}
                    className="border rounded-xl shadow-sm hover:shadow-md transition-all bg-white overflow-hidden group"
                >
                    {/* Image */}
                    <div className="h-40 w-full bg-gray-100 relative">
                        <Image
                            src={branch.image_url || "/placeholder.png"}
                            alt={branch.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-2">
                        <h3 className="text-lg font-semibold">{branch.name}</h3>
                        <p className="text-gray-600 text-sm">{branch.location}</p>

                        {/* Buttons */}
                        <div className="pt-3 gap-2 flex-center">
                            <Link
                                href={`/store/${branch.id}`}
                            >
                                <Button
                                    className="flex-1 uppercae font-extrabold !bg-green-900 hover:opacity-90"
                                    variant="default"
                                >
                                    SHOP NOW
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
