import axios from 'axios';

export const textToSpeech = async (text) => {
    try {
        const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
        
        if (!apiKey) {
            throw new Error('La clave API de ElevenLabs no está configurada. Por favor, configura VITE_ELEVENLABS_API_KEY en tu archivo .env');
        }

        const voiceId = "ErXwobaYiN019PkySvjV"; // Antoni - voz masculina hispana
        
        console.log('Usando API Key:', apiKey ? `${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 5)}` : 'No definida');
        console.log('Usando Voice ID:', voiceId);
        
        const elevenlabsApi = axios.create({
            baseURL: 'https://api.elevenlabs.io',
            headers: {
                'xi-api-key': apiKey,
                'Content-Type': 'application/json'
            }
        });
        
        const payload = {
            text: text,
            model_id: "eleven_multilingual_v2",
            voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75
            }
        };
        
        const response = await elevenlabsApi.post(
            `/v1/text-to-speech/${voiceId}`,
            payload,
            { responseType: 'arraybuffer' }
        );
        
        return response.data;
    } catch (error) {
        console.error('Error al convertir texto a voz:', error);
        
        if (error.response) {
            const status = error.response.status;
            let mensaje = 'Error al procesar la solicitud';
            
            switch (status) {
                case 401:
                    mensaje = 'Clave API inválida o no autorizada';
                    break;
                case 404:
                    mensaje = 'Voz no encontrada';
                    break;
                case 429:
                    mensaje = 'Límite de solicitudes excedido';
                    break;
                default:
                    mensaje = `Error del servidor (${status})`;
            }
            
            throw new Error(mensaje);
        }
        
        throw error;
    }
}; 