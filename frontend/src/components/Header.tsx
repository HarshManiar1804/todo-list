import { useUser, UserButton } from "@clerk/clerk-react";

export default function Header() {
    const { user } = useUser();
    console.log(user)

    return (
        <header className="flex justify-between items-center p-4 bg-white shadow w-full">
            {/* Left: Logo */}
            <div className="flex items-center gap-2">
                <img src="/logo.png" alt="Logo" className="h-10 w-10" />
            </div>

            {/* Center: Title */}
            <h1 className="text-2xl font-bold text-gray-800">Listify</h1>

            {/* Right: Profile Section */}
            <div className="flex items-center gap-4 justify-between">
                {/* User Avatar */}
                <div className="h-8 w-8 rounded-full overflow-hidden">
                    <UserButton
                        afterSignOutUrl="/signin"
                        appearance={{
                            elements: {
                                userButtonAvatarBox: "h-8 w-8",
                            },
                        }}
                    />
                </div>

                {/* Name & Email */}
                <div className="flex flex-col">
                    <span className="text-base font-bold text-gray-800">
                        {user?.firstName} {user?.lastName}
                    </span>
                    <span className="text-sm text-gray-600">{user?.primaryEmailAddress?.emailAddress}</span>
                </div>
            </div>
        </header>
    );
}
