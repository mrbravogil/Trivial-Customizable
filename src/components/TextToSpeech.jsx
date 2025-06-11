import React, { useState, useEffect } from 'react';
import { textToSpeech } from '../services/elevenLabsService';

const TextToSpeech = () => {
    const [text, setText] = useState('Hola, esto es una prueba de voz en español');
    const [isPlaying, setIsPlaying] = useState(false);
    const [error, setError] = useState('');
    const [debug, setDebug] = useState('');
    const [apiStatus, setApiStatus] = useState('no-verificado');

    // Verifica la información de la API en la carga del componente
    useEffect(() => {
        const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
        
        const debugInfo = [];
        
        if (!apiKey) {
            debugInfo.push('⚠️ ADVERTENCIA: La clave API de ElevenLabs no está configurada');
        } else if (apiKey.length < 30) {
            debugInfo.push('⚠️ ADVERTENCIA: La clave API de ElevenLabs parece ser demasiado corta');
        } else {
            debugInfo.push(`✅ Clave API configurada: ${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 5)}`);
        }
        
        debugInfo.push('✅ Usando voz: Antoni (voz masculina en español)');
        
        setDebug(debugInfo.join('\n'));
    }, []);

    const handleTextChange = (e) => {
        setText(e.target.value);
        setError('');
    };

    const handlePlay = async () => {
        if (!text.trim()) {
            setError('Por favor, escribe algún texto para convertir a voz');
            return;
        }

        try {
            setIsPlaying(true);
            setError('');
            setApiStatus('verificando');
            setDebug(prev => `${prev}\n\n🔄 Enviando solicitud a ElevenLabs...`);
            
            const audioData = await textToSpeech(text);
            
            setApiStatus('ok');
            setDebug(prev => `${prev}\n✅ Respuesta recibida, creando audio...`);
            
            // Crear un Blob con los datos binarios recibidos
            const blob = new Blob([audioData], { type: 'audio/mpeg' });
            
            // Crear una URL para el blob
            const url = URL.createObjectURL(blob);
            
            setDebug(prev => `${prev}\n🔊 Reproduciendo audio...`);
            
            // Reproducir el audio
            const audioElement = new Audio(url);
            audioElement.onended = () => {
                setIsPlaying(false);
                setDebug(prev => `${prev}\n✅ Reproducción finalizada`);
                URL.revokeObjectURL(url); // Liberar memoria
            };
            audioElement.onerror = (e) => {
                setError(`Error al reproducir el audio: ${e.message || 'Error desconocido'}`);
                setDebug(prev => `${prev}\n❌ Error de reproducción: ${JSON.stringify(e)}`);
                setIsPlaying(false);
                URL.revokeObjectURL(url); // Liberar memoria
            };
            await audioElement.play();
        } catch (error) {
            console.error('Error al reproducir audio:', error);
            
            let errorMessage = 'No se pudo reproducir el audio';
            let errorCode = '';
            
            if (error.code === "VOICE_NOT_FOUND") {
                errorMessage = "La voz seleccionada no está disponible en ElevenLabs";
            } else if (error.response) {
                errorCode = error.response.status;
                if (errorCode === 400) {
                    errorMessage = 'Error en los parámetros enviados a ElevenLabs';
                } else if (errorCode === 401) {
                    errorMessage = 'Error de autenticación. Clave API inválida o expirada';
                    setApiStatus('error-api');
                } else if (errorCode === 429) {
                    errorMessage = 'Has excedido el límite de solicitudes a ElevenLabs';
                } else {
                    errorMessage = `Error del servidor (${errorCode})`;
                }
            }
            
            setError(`Error ${errorCode}: ${errorMessage}`);
            setDebug(prev => `${prev}\n❌ Error completo: ${JSON.stringify(error.message || 'Desconocido')}`);
            setIsPlaying(false);
            setApiStatus(errorCode === 401 ? 'error-api' : 'error');
        }
    };

    const getApiStatusBadge = () => {
        switch (apiStatus) {
            case 'ok':
                return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">API Funcionando</span>;
            case 'error-api':
                return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Clave API Inválida</span>;
            case 'error':
                return <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">Error de Conexión</span>;
            case 'verificando':
                return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Verificando...</span>;
            default:
                return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">No Verificado</span>;
        }
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Convertir Texto a Voz</h2>
                {getApiStatusBadge()}
            </div>
            
            <textarea
                className="w-full p-2 border rounded mb-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={text}
                onChange={handleTextChange}
                placeholder="Escribe el texto que quieres convertir a voz..."
                rows={4}
            />
            
            {error && (
                <div className="p-2 mb-4 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}
            
            {debug && (
                <div className="p-2 mb-4 bg-gray-100 text-gray-700 rounded text-xs font-mono whitespace-pre-wrap overflow-auto max-h-40">
                    {debug}
                </div>
            )}
            
            <div className="flex justify-start">
                <button
                    onClick={handlePlay}
                    disabled={isPlaying}
                    className={`px-4 py-2 rounded ${
                        isPlaying
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600'
                    } text-white font-medium transition-colors duration-200`}
                >
                    {isPlaying ? 'Reproduciendo...' : 'Reproducir'}
                </button>
            </div>
        </div>
    );
};

export default TextToSpeech; 