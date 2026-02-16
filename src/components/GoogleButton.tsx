'use client';

import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function GoogleButton({ text = "Continue with Google", onLoading }: { text?: string, onLoading?: (loading: boolean) => void }) {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const handleSuccess = async (credentialResponse: any) => {
        setIsLoading(true);
        if (onLoading) onLoading(true);

        try {
            const { credential } = credentialResponse;
            if (!credential) {
                setIsLoading(false);
                if (onLoading) onLoading(false);
                return;
            }

            const res = await api.post('/auth/google', { token: credential });

            if (res.data.success) {
                // Save Token
                localStorage.setItem('token', res.data.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.data.user));

                toast.success('Login Successful!');

                // Redirect based on Role
                if (res.data.data.user.role === 'ADMIN') {
                    window.location.href = '/admin';
                } else {
                    window.location.href = '/';
                }
                // Don't set loading false here as we are redirecting
            }
        } catch (error: any) {
            console.error('Google Login Error:', error);
            toast.error(error.response?.data?.message || 'Google Login Failed');
            setIsLoading(false);
            if (onLoading) onLoading(false);
        }
    };

    const textType = text.toLowerCase().includes('up') ? 'signup_with' : 'signin_with';

    return (
        <div className="w-full flex justify-center mt-4">
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => {
                    console.log('Login Failed');
                    toast.error("Google Login Failed");
                }}
                theme="filled_black"
                shape="pill"
                text={textType}
                size="large"
                width="300"
            />
        </div>
    );
}
