"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/toaster";
import { AuthService } from "@/services/authService";
import { AuthCredential } from "@/types/user";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue
} from "@/components/ui/select";

export function AuthPage() {
    console.log(process.env.NEXT_PUBLIC_API_LINK);

    const [activeForm, setForm] = useState("Login");
    const [credential, setCredential] = useState<AuthCredential>({
        email: "",
        password: "",
        role: ""
    });
    const [onProcess, setProcess] = useState(false);

    function loginWithGoogle() {
        window.location.href = "http://localhost:4000/api/auth/google-login";
    }

    async function handleFormSubmission(e: FormEvent<HTMLFormElement>) {
        try {
            e.preventDefault();
            setProcess(true);

            if (!credential.email || !credential.password)
                return toast.error("Please fill up the form.");

            if (activeForm === "Signup") {
                if (!credential.role)
                    return toast.error("Please select a role.");

                const data = await AuthService.signup(credential);
                if (data) {
                    toast.success("Signup success");
                    const cookie = await AuthService.login(credential);
                    if (cookie) {
                        await AuthService.setCookies(cookie);
                        window.location.href = "/";
                    }
                }
            } else {
                const data = await AuthService.login(credential);
                if (data) {
                    await AuthService.setCookies(data);
                    window.location.href = "/";
                }
            }
        } catch (error) {
            toast.error(`${error}`);
        } finally {
            setProcess(false);
        }
    }

    return (
        <section className="h-screen flex-center">
            <Toaster position="top-center" richColors={false} />

            <div className="w-120 flex-col flex-center gap-4 mx-auto bg-white shadow-sm p-8">
                <Image
                    src="/svg/logo3.svg"
                    alt="Starbucks Logo"
                    width={60}
                    height={60}
                />

                <div className="text-xl text-orange-900 font-extrabold tracking-widest uppercase">
                    STARBUCKS {activeForm}
                </div>

                <Button
                    onClick={loginWithGoogle}
                    className="w-full"
                    variant="outline"
                >
                    <Image src="/svg/google.svg" alt="Google" width={20} height={20} />
                    Continue with Google
                </Button>

                <div className="font-semibold text-gray-500">OR</div>

                <form className="w-full flex flex-col gap-3" onSubmit={handleFormSubmission}>
                    <div className="text-lg font-bold text-center">
                        {activeForm === "Login" ? "SIGN IN" : "SIGN UP"} USING EMAIL
                    </div>

                    <Input
                        onChange={(e) =>
                            setCredential((prev) => ({
                                ...prev,
                                email: e.target.value
                            }))
                        }
                        className="w-full tracking-wider"
                        placeholder="Email Address"
                    />

                    <Input
                        onChange={(e) =>
                            setCredential((prev) => ({
                                ...prev,
                                password: e.target.value
                            }))
                        }
                        type="password"
                        className="w-full tracking-wider"
                        placeholder="Password"
                    />

                    {/* ONLY SHOW ROLE SELECTION ON SIGNUP */}
                    {activeForm === "Signup" && (
                        <Select
                            onValueChange={(value) =>
                                setCredential((prev) => ({ ...prev, role: value }))
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="CUSTOMER">CUSTOMER</SelectItem>
                                <SelectItem value="SUPPLIER">SUPPLIER</SelectItem>
                            </SelectContent>
                        </Select>
                    )}

                    <Button
                        type="submit"
                        disabled={
                            onProcess ||
                            !credential.email ||
                            !credential.password ||
                            (activeForm === "Signup" && !credential.role)
                        }
                        className="!bg-green-900 font-semibold tracking-widest uppercase hover:opacity-90"
                    >
                        {onProcess ? (
                            <>
                                <LoaderCircle className="text-white animate-spin" />
                                {activeForm}
                            </>
                        ) : (
                            activeForm
                        )}
                    </Button>

                    <div className="text-sm text-center">
                        {activeForm === "Login" ? (
                            <>
                                Don't have an account?{" "}
                                <span
                                    className="text-green-900 cursor-pointer underline"
                                    onClick={() => setForm("Signup")}
                                >
                                    Signup here
                                </span>{" "}
                                at Starbucks!
                            </>
                        ) : (
                            <>
                                Already have an account?{" "}
                                <span
                                    className="text-green-900 cursor-pointer underline"
                                    onClick={() => setForm("Login")}
                                >
                                    Login here
                                </span>{" "}
                                at Starbucks!
                            </>
                        )}
                    </div>
                </form>
            </div>
        </section>
    );
}
