"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Logo from "@/components/Logo";
import FormRow from "@/components/FormRow";
import Link from "next/link";

const Login = () => {
    const router = useRouter();
    const [values, setValues] = useState({
        email: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = values;
        if (!email || !password) {
            toast.error("Please fill out all fields");
            return;
        }
        setIsLoading(true);

        // Explicitly use credentials provider
        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        setIsLoading(false);

        if (result.error) {
            toast.error("Invalid credentials");
        } else {
            toast.success("Login Successful!");
            router.push("/dashboard");
        }
    };

    return (
        <div className='min-h-screen grid items-center justify-center bg-[#0f0f12]'>
            <div className='w-full max-w-md bg-white p-8 rounded-lg shadow-md border border-gray-100'>
                <div className='text-center mb-6'>
                    <Logo />
                    <h3 className='text-xl font-semibold mt-4 text-gray-800'>Login</h3>
                </div>
                <form className='form' onSubmit={onSubmit}>
                    <FormRow type='email' name='email' value={values.email} handleChange={handleChange} />
                    <FormRow type='password' name='password' value={values.password} handleChange={handleChange} />
                    <button
                        type='submit'
                        className='w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 mt-4 disabled:opacity-50'
                        disabled={isLoading}
                    >
                        {isLoading ? "Loading..." : "Submit"}
                    </button>
                    <p className='text-center mt-4 text-gray-600'>
                        Not a member yet?
                        <Link href='/register' className='text-blue-500 ml-1 hover:underline'>
                            Register
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};
export default Login;
