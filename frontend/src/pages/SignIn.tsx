import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
    return (
        <div className="h-screen flex justify-center items-center">
            <SignIn path="/signin" routing="path" signUpUrl="/signup" />
        </div>
    );
}
