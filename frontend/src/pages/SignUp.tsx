import { SignUp } from "@clerk/clerk-react";

export default function SignUpPage() {
    return (
        <div className="h-screen flex justify-center items-center">
            <SignUp path="/signup" routing="path" signInUrl="/signin" />
        </div>
    );
}
