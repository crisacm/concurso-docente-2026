'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Contact, BrainCircuit, Users, BookOpen, Presentation, Brain, CheckCircle2, ArrowRight } from 'lucide-react';

type ProfileType = 'aula' | 'orientador' | 'directivo';

export function SimConfigForm() {
    const router = useRouter();
    const [selectedProfile, setSelectedProfile] = useState<ProfileType | null>('aula');
    const [selectedAreas, setSelectedAreas] = useState<string[]>(['fundamentos', 'pedagogicos']);

    const toggleArea = (areaId: string) => {
        if (selectedAreas.includes(areaId)) {
            setSelectedAreas(selectedAreas.filter(id => id !== areaId));
        } else {
            setSelectedAreas([...selectedAreas, areaId]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here we could save the configuration to the state/store/db before navigating
        if (selectedProfile && selectedAreas.length > 0) {
            router.push('/quiz');
        }
    };

    const isConfigurationValid = selectedProfile !== null && selectedAreas.length > 0;

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-[24px] p-6 sm:p-10 shadow-sm border border-slate-100 dark:border-slate-700/60 w-full">

            <div className="text-center mb-10">
                <h2 className="text-[28px] font-bold text-slate-900 dark:text-slate-100 tracking-tight">Configuración del Simulacro</h2>
                <p className="text-slate-500 dark:text-slate-400 text-[14px] mt-2">Personaliza tu prueba para el Concurso Docente 2026</p>
            </div>

            {/* Profile Selection */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-5">
                    <div className="h-6 w-6 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400 text-[12px] font-bold">1</span>
                    </div>
                    <h3 className="text-[18px] font-bold text-slate-800 dark:text-slate-200">Selecciona tu Perfil</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Profile 1 */}
                    <button
                        type="button"
                        onClick={() => setSelectedProfile('aula')}
                        className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-200 ${selectedProfile === 'aula'
                                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/5 shadow-sm'
                                : 'border-slate-200 dark:border-slate-700 bg-transparent hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                            }`}
                    >
                        <Contact className={`h-8 w-8 mb-3 ${selectedProfile === 'aula' ? 'text-blue-500 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
                        <span className={`text-[15px] font-bold ${selectedProfile === 'aula' ? 'text-slate-800 dark:text-slate-200' : 'text-slate-600 dark:text-slate-400'}`}>
                            Docente de Aula
                        </span>
                    </button>

                    {/* Profile 2 */}
                    <button
                        type="button"
                        onClick={() => setSelectedProfile('orientador')}
                        className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-200 ${selectedProfile === 'orientador'
                                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/5 shadow-sm'
                                : 'border-slate-200 dark:border-slate-700 bg-transparent hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                            }`}
                    >
                        <BrainCircuit className={`h-8 w-8 mb-3 ${selectedProfile === 'orientador' ? 'text-blue-500 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
                        <span className={`text-[15px] font-bold ${selectedProfile === 'orientador' ? 'text-slate-800 dark:text-slate-200' : 'text-slate-600 dark:text-slate-400'}`}>
                            Docente Orientador
                        </span>
                    </button>

                    {/* Profile 3 */}
                    <button
                        type="button"
                        onClick={() => setSelectedProfile('directivo')}
                        className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-200 ${selectedProfile === 'directivo'
                                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/5 shadow-sm'
                                : 'border-slate-200 dark:border-slate-700 bg-transparent hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                            }`}
                    >
                        <Users className={`h-8 w-8 mb-3 ${selectedProfile === 'directivo' ? 'text-blue-500 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
                        <span className={`text-[15px] font-bold ${selectedProfile === 'directivo' ? 'text-slate-800 dark:text-slate-200' : 'text-slate-600 dark:text-slate-400'}`}>
                            Directivo Docente
                        </span>
                    </button>
                </div>
            </div>

            {/* Areas Selection */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-5">
                    <div className="h-6 w-6 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400 text-[12px] font-bold">2</span>
                    </div>
                    <h3 className="text-[18px] font-bold text-slate-800 dark:text-slate-200">Áreas a Evaluar</h3>
                </div>

                <div className="flex flex-col gap-3">
                    {/* Area 1 */}
                    <div
                        onClick={() => toggleArea('fundamentos')}
                        className={`flex items-center justify-between p-4 sm:p-5 rounded-xl border ${selectedAreas.includes('fundamentos') ? 'border-blue-200 bg-blue-50/50 dark:border-blue-900/50 dark:bg-blue-900/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'} cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors`}
                    >
                        <div className="flex items-start sm:items-center gap-4">
                            <div className="mt-1 sm:mt-0 flex-shrink-0">
                                {selectedAreas.includes('fundamentos') ? (
                                    <CheckCircle2 className="h-6 w-6 text-blue-500 dark:text-blue-400" />
                                ) : (
                                    <div className="h-6 w-6 rounded-full border-2 border-slate-200 dark:border-slate-600"></div>
                                )}
                            </div>
                            <div>
                                <h4 className="text-[14px] font-bold text-slate-800 dark:text-slate-200">Componente de Fundamentos Generales</h4>
                                <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-0.5">Lectura Crítica y Razonamiento Cuantitativo.</p>
                            </div>
                        </div>
                        <BookOpen className="h-5 w-5 text-slate-300 dark:text-slate-600 hidden sm:block" />
                    </div>

                    {/* Area 2 */}
                    <div
                        onClick={() => toggleArea('pedagogicos')}
                        className={`flex items-center justify-between p-4 sm:p-5 rounded-xl border ${selectedAreas.includes('pedagogicos') ? 'border-blue-200 bg-blue-50/50 dark:border-blue-900/50 dark:bg-blue-900/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'} cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors`}
                    >
                        <div className="flex items-start sm:items-center gap-4">
                            <div className="mt-1 sm:mt-0 flex-shrink-0">
                                {selectedAreas.includes('pedagogicos') ? (
                                    <CheckCircle2 className="h-6 w-6 text-blue-500 dark:text-blue-400" />
                                ) : (
                                    <div className="h-6 w-6 rounded-full border-2 border-slate-200 dark:border-slate-600"></div>
                                )}
                            </div>
                            <div>
                                <h4 className="text-[14px] font-bold text-slate-800 dark:text-slate-200">Conocimientos Pedagógicos</h4>
                                <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-0.5">Evalúa, forma y enseña.</p>
                            </div>
                        </div>
                        <Presentation className="h-5 w-5 text-slate-300 dark:text-slate-600 hidden sm:block" />
                    </div>

                    {/* Area 3 */}
                    <div
                        onClick={() => toggleArea('psicotecnica')}
                        className={`flex items-center justify-between p-4 sm:p-5 rounded-xl border ${selectedAreas.includes('psicotecnica') ? 'border-blue-200 bg-blue-50/50 dark:border-blue-900/50 dark:bg-blue-900/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'} cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors`}
                    >
                        <div className="flex items-start sm:items-center gap-4">
                            <div className="mt-1 sm:mt-0 flex-shrink-0">
                                {selectedAreas.includes('psicotecnica') ? (
                                    <CheckCircle2 className="h-6 w-6 text-blue-500 dark:text-blue-400" />
                                ) : (
                                    <div className="h-6 w-6 rounded-full border-2 border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800"></div>
                                )}
                            </div>
                            <div>
                                <h4 className="text-[14px] font-bold text-slate-800 dark:text-slate-200">Prueba Psicotécnica</h4>
                                <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-0.5">Actitudes, habilidades y competencias comportamentales.</p>
                            </div>
                        </div>
                        <Brain className="h-5 w-5 text-slate-300 dark:text-slate-600 hidden sm:block border-none" />
                    </div>
                </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
                <button
                    type="submit"
                    disabled={!isConfigurationValid}
                    className={`w-full py-4 flex items-center justify-center gap-2 rounded-xl text-[15px] font-bold transition-all ${isConfigurationValid
                            ? 'bg-[#1877F2] hover:bg-blue-600 text-white shadow-md hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.98]'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                        }`}
                >
                    Comenzar Simulacro
                    <ArrowRight className="h-5 w-5" />
                </button>
                <p className="text-center text-[12px] text-slate-400 dark:text-slate-500 mt-4">
                    Al comenzar, tendrás 4 horas para completar las 100 preguntas seleccionadas.
                </p>
            </div>
        </form>
    );
}
