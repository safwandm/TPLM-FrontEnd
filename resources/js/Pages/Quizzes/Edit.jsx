// resources/js/Pages/Quizzes/Edit.jsx
import React, { useEffect, useState } from "react";
// import AppLayout from "@/Layouts/AppLayout";
import ProtectedLayout from "@/Layouts/ProtectedLayout";
// import { usePage, router } from "@inertiajs/react";
import { FaTrash } from "react-icons/fa";

export default function Edit() {
    /* =====================================================
       ROUTE PARAM (Mock Inertia)
    ===================================================== */
    const { id } = usePage().props;
    const quizId = Number(id);

    /* =====================================================
       LOAD QUIZ FROM LOCALSTORAGE
    ===================================================== */
    const [loaded, setLoaded] = useState(false);
    const [quiz, setQuiz] = useState(null);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("savedQuizzes")) ?? [];
        const found = saved.find(q => q.id === quizId);
        if (found) setQuiz(found);
        setLoaded(true);
    }, [quizId]);

    /* =====================================================
       QUIZ FORM STATE
    ===================================================== */
    const [title, setTitle] = useState("");
    const [duration, setDuration] = useState("");
    const [showAnswers, setShowAnswers] = useState(false);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        if (!quiz) return;
        setTitle(quiz.title);
        setDuration(quiz.duration ?? "");
        setShowAnswers(quiz.settings?.showAnswers ?? false);
        setShowLeaderboard(quiz.settings?.showLeaderboard ?? false);
        setQuestions(quiz.questions ?? []);
    }, [quiz]);

    /* =====================================================
       QUESTION FORM STATE
    ===================================================== */
    const [editingQuestionId, setEditingQuestionId] = useState(null);
    const [qText, setQText] = useState("");
    const [qImage, setQImage] = useState("");
    const [qMath, setQMath] = useState("");
    const [optA, setOptA] = useState("");
    const [optB, setOptB] = useState("");
    const [optC, setOptC] = useState("");
    const [optD, setOptD] = useState("");
    const [correct, setCorrect] = useState("a");
    const [qTimer, setQTimer] = useState("");

    function resetQuestionForm() {
        setEditingQuestionId(null);
        setQText("");
        setQImage("");
        setQMath("");
        setOptA("");
        setOptB("");
        setOptC("");
        setOptD("");
        setCorrect("a");
        setQTimer("");
    }

    function startEditQuestion(q) {
        setEditingQuestionId(q.id);
        setQText(q.text);
        setQImage(q.image ?? "");
        setQMath(q.math ?? "");
        setOptA(q.options.a);
        setOptB(q.options.b);
        setOptC(q.options.c);
        setOptD(q.options.d);
        setCorrect(q.correct);
        setQTimer(q.timer ?? "");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function submitQuestion() {
        if (!qText.trim()) return alert("Pertanyaan tidak boleh kosong");
        if (![optA, optB, optC, optD].every(v => v.trim()))
            return alert("Semua pilihan jawaban harus diisi");

        const payload = {
            id: editingQuestionId ?? Date.now(),
            text: qText,
            image: qImage || null,
            math: qMath || null,
            options: { a: optA, b: optB, c: optC, d: optD },
            correct,
            timer: qTimer ? Number(qTimer) : null,
        };

        setQuestions(prev =>
            editingQuestionId
                ? prev.map(q => (q.id === editingQuestionId ? payload : q))
                : [...prev, payload]
        );

        resetQuestionForm();
    }

    function deleteQuestion(id) {
        if (!confirm("Hapus pertanyaan?")) return;
        setQuestions(prev => prev.filter(q => q.id !== id));
    }

    function saveQuiz() {
        if (!quiz) return alert("Quiz not found!");

        const saved = JSON.parse(localStorage.getItem("savedQuizzes")) ?? [];
        const updatedQuiz = {
            ...quiz,
            title,
            duration,
            settings: { showAnswers, showLeaderboard },
            questions,
        };

        localStorage.setItem(
            "savedQuizzes",
            JSON.stringify(saved.map(q => (q.id === quizId ? updatedQuiz : q)))
        );

        router.visit("/dashboard");
    }

    if (!loaded) return <ProtectedLayout><div className="p-6">Loading...</div></ProtectedLayout>;
    if (!quiz) return <ProtectedLayout><div className="p-6 text-red-600">Quiz not found</div></ProtectedLayout>;

    /* =====================================================
       UI
    ===================================================== */
    return (
        <ProtectedLayout>
            <div className="max-w-4xl mx-auto space-y-8">

                {/* -------------------------------------- */}
                {/* CARD: Pengaturan Kuis */}
                {/* -------------------------------------- */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between mb-6">
                        <button
                            // onClick={() => router.visit("/dashboard")}
                            onClick={() => window.location.href = "/dashboard"}
                            className="text-blue-700"
                        >
                            ← Kembali
                        </button>
                        <button
                            onClick={saveQuiz}
                            className="bg-green-600 text-white px-4 py-2 rounded"
                        >
                            Simpan Kuis
                        </button>
                    </div>

                    <h2 className="font-semibold text-lg mb-3">Pengaturan Kuis</h2>
                    <div className="space-y-4 mb-4">

                        <div>
                            <label className="text-sm font-medium text-gray-600">Judul Kuis</label>
                            <input
                                className="w-full border p-2 rounded mt-1"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600">
                                Total Waktu Kuis (detik)
                            </label>
                            <input
                                type="number"
                                className="w-full border p-2 rounded mt-1"
                                value={duration}
                                onChange={e => setDuration(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-6 mt-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={showAnswers}
                                    onChange={e => setShowAnswers(e.target.checked)}
                                />
                                Tunjukkan Jawaban Benar
                            </label>

                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={showLeaderboard}
                                    onChange={e => setShowLeaderboard(e.target.checked)}
                                />
                                Tunjukkan Peringkat
                            </label>
                        </div>
                    </div>
                </div>

                {/* -------------------------------------- */}
                {/* CARD: Tambah / Edit Pertanyaan */}
                {/* -------------------------------------- */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="font-semibold text-lg mb-3">
                        {editingQuestionId ? "Edit Pertanyaan" : "Tambah Pertanyaan"}
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-600">Pertanyaan</label>
                            <textarea
                                className="w-full border p-2 rounded mt-1"
                                placeholder="Masukkan pertanyaan kuis"
                                value={qText}
                                onChange={e => setQText(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600">URL Gambar (opsional)</label>
                            <input
                                className="w-full border p-2 rounded mt-1"
                                placeholder="https://..."
                                value={qImage}
                                onChange={e => setQImage(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600">Persamaan Matematika</label>
                            <input
                                className="w-full border p-2 rounded mt-1"
                                placeholder="x^2 + y^2 = z^2"
                                value={qMath}
                                onChange={e => setQMath(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600">Pilihan Jawaban</label>
                            <div className="grid grid-cols-2 gap-3 mt-1">
                                <input className="border p-2 rounded" placeholder="Masukkan pilihan a" value={optA} onChange={e => setOptA(e.target.value)} />
                                <input className="border p-2 rounded" placeholder="Masukkan pilihan b" value={optB} onChange={e => setOptB(e.target.value)} />
                                <input className="border p-2 rounded" placeholder="Masukkan pilihan c" value={optC} onChange={e => setOptC(e.target.value)} />
                                <input className="border p-2 rounded" placeholder="Masukkan pilihan d" value={optD} onChange={e => setOptD(e.target.value)} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-sm font-medium text-gray-600">Kunci Jawaban</label>
                                <select
                                    className="border p-2 rounded w-full mt-1"
                                    value={correct}
                                    onChange={e => setCorrect(e.target.value)}
                                >
                                    <option value="a">Pilihan a</option>
                                    <option value="b">Pilihan b</option>
                                    <option value="c">Pilihan c</option>
                                    <option value="d">Pilihan d</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    Batas Waktu per Soal (detik)
                                </label>
                                <input
                                    type="number"
                                    className="border p-2 rounded w-full mt-1"
                                    value={qTimer}
                                    onChange={e => setQTimer(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={submitQuestion}
                                className="bg-blue-700 text-white px-4 py-2 rounded"
                            >
                                {editingQuestionId ? "Simpan Perubahan" : "Tambahkan Soal"}
                            </button>
                            {editingQuestionId && (
                                <button onClick={resetQuestionForm} className="text-gray-500">
                                    Batal
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* -------------------------------------- */}
                {/* CARD: Preview Pertanyaan */}
                {/* -------------------------------------- */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="font-semibold text-lg mb-4">Pertanyaan</h2>

                    <div className="space-y-4">
                        {questions.map((q, index) => (
                            <div key={q.id} className="border rounded-lg p-4 shadow-sm bg-white">
                                <div className="flex justify-between mb-3">
                                    <div className="font-medium">
                                        {index + 1}. {q.text}
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => startEditQuestion(q)}
                                            className="text-blue-600 text-sm"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteQuestion(q.id)}
                                            className="text-red-600"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>

                                {q.image && (
                                    <img src={q.image} className="max-w-xs rounded border mb-3" />
                                )}

                                {q.math && (
                                    <div className="text-gray-600 mb-3 font-mono">
                                        <span className="font-semibold">Persamaan:</span> {q.math}
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    {Object.entries(q.options).map(([key, value]) => (
                                        <div
                                            key={key}
                                            className={`border px-3 py-2 rounded ${
                                                key === q.correct
                                                    ? "bg-green-100 border-green-600"
                                                    : "bg-gray-50"
                                            }`}
                                        >
                                            <span className="font-semibold uppercase">{key}.</span> {value}
                                        </div>
                                    ))}
                                </div>

                                <div className="text-xs text-gray-500 mt-3">
                                    Batas waktu: {q.timer ? `${q.timer} detik` : "Tidak ada batas waktu"}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </ProtectedLayout>
    );
}
