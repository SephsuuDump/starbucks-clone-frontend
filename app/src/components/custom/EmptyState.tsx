import Image from "next/image";

export function EmptyState({ title = "No results found", message = "There is nothing to display here." }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center w-full">
            <Image
                src="/images/empty-state.png"
                alt="empty state"
                width={160}
                height={160}
                className="opacity-80 mb-4"
            />

            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
            <p className="text-gray-500 text-sm mt-1 max-w-xs">{message}</p>
        </div>
    );
}
