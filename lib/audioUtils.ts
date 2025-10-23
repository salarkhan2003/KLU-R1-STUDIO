import { GoogleGenAI, Modality } from "@google/genai";

// Base64 decoding function
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Raw PCM audio data to AudioBuffer decoding function
async function decodePCMAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


let ai: GoogleGenAI | null = null;
const getAi = () => {
    if (!ai) {
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    }
    return ai;
}

export const generateSpeech = async (text: string): Promise<string> => {
    const ai = getAi();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                      prebuiltVoiceConfig: { voiceName: 'Kore' }, // A clear female voice
                    },
                },
            },
        });
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
            return base64Audio;
        } else {
            throw new Error("No audio data received from API.");
        }
    } catch (error) {
        console.error("Error generating speech:", error);
        throw error;
    }
};

export const decodeAndBuffer = async (audioContext: AudioContext, base64Audio: string): Promise<AudioBuffer> => {
    const decoded = decode(base64Audio);
    // Gemini TTS provides audio at 24000 sample rate, 1 channel
    return await decodePCMAudioData(decoded, audioContext, 24000, 1);
};