"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // added useRouter
import { format } from "date-fns";
import { ProjectActivityService } from "@/services/project_management/ProjectActivity";
import { Button } from "@/components/ui/button"; // added button
import { ArrowLeft } from "lucide-react"; // added icon

type ActivityLog = {
    id: string;
    actor_role: string;
    entity_type: string;
    action: string;
    description: string;
    created_at: string;
};

export default function ProjectLogsPage() {
    const { id } = useParams();
    const router = useRouter(); // router instance
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchLogs() {
            try {
                const res = await ProjectActivityService.getByProject(id as string);
                setLogs(res.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        if (id) fetchLogs();
    }, [id]);

    const grouped = logs.reduce<Record<string, ActivityLog[]>>((acc, log) => {
        const dateKey = format(new Date(log.created_at), "MMMM dd, yyyy");
        acc[dateKey] = acc[dateKey] || [];
        acc[dateKey].push(log);
        return acc;
    }, {});

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center text-sm text-gray-500">
                Loading activity logs...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto p-6 space-y-4">
                
                <Button
                    variant="outline"
                    className="flex items-center gap-2 w-fit"
                    onClick={() => router.push(`/project/${id}`)} // navigate back to project
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Project
                </Button>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h1 className="text-xl font-semibold text-gray-800 mb-6">
                        Project Activity Log
                    </h1>

                    {logs.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="text-gray-400 text-sm">
                                No activity for this project yet.
                            </div>
                        </div>
                    )}

                    <div className="space-y-10">
                        {Object.entries(grouped).map(([date, items]) => (
                            <div key={date}>
                                <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-4">
                                    {date}
                                </h2>

                                <div className="relative border-l border-gray-200 pl-6 space-y-6">
                                    {items.map(log => (
                                        <div key={log.id} className="relative">
                                            <span className="absolute -left-[9px] top-2 w-4 h-4 bg-blue-600 rounded-full" />

                                            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition">
                                                <div className="flex justify-between items-start gap-4">
                                                    <p className="text-sm text-gray-800 leading-relaxed">
                                                        {log.description}
                                                    </p>

                                                    <span className="text-xs text-gray-400 whitespace-nowrap">
                                                        {format(new Date(log.created_at), "hh:mm a")}
                                                    </span>
                                                </div>

                                                <div className="mt-2 text-xs text-gray-500">
                                                    {log.actor_role} · {log.entity_type}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>  
    );
}
