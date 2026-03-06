import { signInWithGoogle } from './actions';
import { Github } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 relative overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            {/* Fondo con gradiente radial simulando la imagen */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-slate-50 to-slate-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 opacity-80" />

            <div className="z-10 w-full max-w-sm flex flex-col items-center">
                <div className="flex flex-col items-center gap-3 mb-10 text-center">
                    <h1 className="text-[28px] font-bold text-slate-900 dark:text-slate-100 tracking-tight">Concurso Docente 2026</h1>
                    <p className="text-[13px] text-slate-500 dark:text-slate-400 max-w-[300px] leading-relaxed">
                        Simulacro no oficial basado en la normativa pública del Ministerio de Educación para práctica pedagógica
                    </p>
                </div>

                <form action={signInWithGoogle} className="w-full mb-10">
                    <button
                        type="submit"
                        className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3.5 text-[14px] font-medium text-slate-700 dark:text-slate-300 shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-slate-700 hover:shadow focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700 focus:ring-offset-2 dark:focus:ring-offset-slate-900 cursor-pointer"
                    >
                        <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                            <path
                                d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                                fill="#EA4335"
                            />
                            <path
                                d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                                fill="#4285F4"
                            />
                            <path
                                d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                                fill="#34A853"
                            />
                        </svg>
                        <span>Continuar con Google</span>
                    </button>
                </form>

                <div className="w-full flex flex-col items-center border-t border-slate-200/60 dark:border-slate-700/60 pt-8 pb-12 gap-3">
                    <p className="text-[11px] font-bold tracking-[0.15em] text-slate-400 dark:text-slate-500 uppercase">
                        Acceso Seguro
                    </p>
                    <p className="text-[12px] text-slate-400 dark:text-slate-500 text-center max-w-[280px] leading-relaxed">
                        Al continuar, el usuario acepta los términos, condiciones y políticas de seguridad del sitio.
                    </p>
                </div>
            </div>

            <div className="absolute bottom-8 z-10 w-full flex justify-center">
                <Link
                    href="https://github.com/crisacm/concurso-docente-2026"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[13px] text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                    <Github className="h-4 w-4" />
                    <span>Proyecto de código abierto bajo licencia GNU GPLv3</span>
                </Link>
            </div>
        </div>
    );
}
