import React, { useState } from "react";
import { useUserContext } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";

export default function Header() {
    const { user, setUser } = useUserContext();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const initials = user?.username?.substring(0, 2).toUpperCase() || "US";

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        navigate("/signin");
    };

    return (
        <header className="flex justify-between items-center p-4 bg-white shadow w-full relative">
            {/* Left: Logo */}
            <div className="flex items-center gap-2">
                <img src="/logo.png" alt="Logo" className="h-10 w-10" />
            </div>

            {/* Center: Title */}
            <h1 className="text-2xl font-bold text-gray-800">TODO LIST</h1>

            {/* Right: Avatar and Dropdown */}
            <div className="relative">
                <div
                    className="h-9 w-9 rounded-full bg-gray-200 text-gray-700 font-semibold flex items-center justify-center text-sm cursor-pointer"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                    {initials}
                </div>

                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border z-50">
                        <div className="p-4">
                            <p className="text-sm font-semibold text-gray-800">{user?.username}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                        <hr />
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
