import React, { useEffect, useState } from "react";
import ProtectedLayout from "@/Layouts/ProtectedLayout";
import {
    FaPlus,
    FaEdit,
    FaPlay,
    FaFileAlt,
    FaTrash,
} from "react-icons/fa";

export default function Dashboard() {
    const user = JSON.parse(localStorage.getItem("auth_user"));

    /* =====================================
       QUIZ STATE
    ===================================== */
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loadingId, setLoadingId] = useState(null);

    /* =====================================
       FETCH QUIZZES
    ===================================== */
    useEffect(() => {
        const token = localStorage.getItem("auth_token");
        if (!token) return;

        async function fetchQuizzes() {
            try {
                const res = await fetch(
                    "http://127.0.0.1:8001/api/teacher/kuis",
                    {
                        method: "GET",
                        headers: {
                            "Accept": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                    }
                );

                console.log("Fetch quizzes response:", res);

                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`);
                }

                const data = await res.json();
                setQuizzes(data);
            } catch (err) {
                console.error("Fetch quiz error:", err);
                setError("Gagal memuat data kuis");
            } finally {
                setLoading(false);
            }
        }

        fetchQuizzes();
    }, []);

    /* =====================================
       HANDLERS
    ===================================== */
    function handleEdit(id) {
        window.location.href = `/quizzes/${id}/edit`;
    }

    function handleStart(id) {
        setLoadingId(id);
        setTimeout(() => {
            setQuizzes((q) =>
                q.map((x) =>
                    x.id === id ? { ...x, started: !x.started } : x
                )
            );
            setLoadingId(null);
        }, 700);
    }

    function handleExport() {
        alert("Exported quiz (mock)");
    }

    function handleDelete(id) {
        if (!confirm("Hapus kuis?")) return;

        setLoadingId(id);
        setTimeout(() => {
            setQuizzes((q) => q.filter((x) => x.id !== id));
            setLoadingId(null);
        }, 600);
    }

    /* =====================================
       LOADING / ERROR
    ===================================== */

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    /* =====================================
       UI
    ===================================== */
    return (
        <ProtectedLayout allowedRoles={["teacher"]}>
            <div>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-semibold">Kuis saya</h2>
                        <p className="text-sm text-gray-600">
                            Login sebagai{" "}
                            <span className="font-medium">{user.name}</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <a
                            href="/quizzes/create"
                            className="inline-flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded"
                        >
                            <FaPlus /> Kuis Baru
                        </a>

                    </div>
                </div>

                {quizzes.length === 0 ? (
                    <p className="text-gray-500">Belum ada kuis.</p>
                ) : (
                    <div className="space-y-4">
                        {quizzes.map((q) => (
                            <div
                                key={q.id}
                                className="border rounded-xl p-4 flex justify-between items-center"
                            >
                                <div>
                                    <h3 className="text-blue-700 font-semibold text-lg">
                                        {q.judul}
                                    </h3>

                                    <div className="flex gap-4 text-gray-600 mt-1">
                                        <span className="text-yellow-600">
                                            {q.pertanyaan_count} Soal
                                        </span>

                                        {q.total_waktu && (
                                            <span>Batas waktu: {q.total_waktu}s</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button onClick={() => handleEdit(q.id)}>
                                        <FaEdit />
                                    </button>
                                    <button onClick={() => handleStart(q.id)}>
                                        <FaPlay />
                                    </button>
                                    <button onClick={handleExport}>
                                        <FaFileAlt />
                                    </button>
                                    <button onClick={() => handleDelete(q.id)}>
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </ProtectedLayout>
    );
}