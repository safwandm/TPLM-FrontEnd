import AppLayout from "@/Layouts/AppLayout";

export default function ProtectedLayout({ children }) {
    const token = localStorage.getItem("auth_token");

    if (!token) {
        window.location.href = "/login";
        return null;
    }

    return (
        <AppLayout>
            {children}
        </AppLayout>
    );
}
