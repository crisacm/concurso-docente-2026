'use client'

import React, { useEffect, useState } from 'react';
import { User, LogOut, GraduationCap, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

export function Topbar({ email }: { email: string }) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    return (
        <div className="max-w-[800px] mx-auto fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 py-4">
            {/* Title Pill (Glassmorphism) */}
            <div className="flex items-center bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-full shadow-sm border border-white/40 dark:border-slate-700/40 px-4 py-2 gap-2">
                <GraduationCap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-[12px] font-bold tracking-tight text-slate-700 dark:text-slate-200 uppercase">
                    Concurso Docente 2026
                </span>
            </div>

            {/* User Info & Logout Pill (Glassmorphism) */}
            <div className="flex items-center bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-full shadow-sm border border-white/40 dark:border-slate-700/40 px-3 py-1.5 gap-3">
                <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-slate-700 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <User className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-[12px] font-medium text-slate-700 dark:text-slate-300 hidden sm:block">{email}</span>
                </div>

                {mounted && (
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        title="Alternar tema"
                    >
                        {theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                    </button>
                )}

                <div className="w-[1px] h-3 bg-slate-200 dark:bg-slate-600"></div>

                <form action="/auth/signout" method="post" className="flex items-center">
                    <button type="submit" className="flex items-center gap-1.5 text-[12px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                        <LogOut className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Salir</span>
                    </button>
                </form>
            </div>
        </div>
    );
}
