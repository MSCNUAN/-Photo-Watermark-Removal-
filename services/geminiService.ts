
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

/**
 * Utility to convert file to base64
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

export type ErrorType = 'API_KEY_INVALID' | 'RATE_LIMIT' | 'SAFETY_BLOCK' | 'SERVER_ERROR' | 'NETWORK_ERROR' | 'UNKNOWN';

export class AppError extends Error {
  constructor(public type: ErrorType, message: string) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Service to handle AI operations
 */
export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: API_KEY });
  }

  private handleError(error: any): never {
    const message = error?.message || '';
    
    if (message.includes('API key not valid')) {
      throw new AppError('API_KEY_INVALID', '暖暖发现魔法密钥（API Key）似乎失效了，请联系站长检查配置。');
    }
    if (message.includes('429') || message.includes('Too Many Requests')) {
      throw new AppError('RATE_LIMIT', '呼~ 暖暖有点忙不过来了（请求太频繁），请稍等片刻再试哦。');
    }
    if (message.includes('Safety') || message.includes('blocked')) {
      throw new AppError('SAFETY_BLOCK', '这张图片触发了次元禁制（安全过滤），暖暖没法对它施展魔法呢。');
    }
    if (message.includes('fetch') || !window.navigator.onLine) {
      throw new AppError('NETWORK_ERROR', '网络连接似乎断开了，暖暖没法连接到魔法森林，请检查下网络。');
    }
    
    throw new AppError('UNKNOWN', `魔法施放失败了: ${message || '原因未知'}`);
  }

  /**
   * Analyze image to generate a detailed prompt
   */
  async analyzeImage(base64Image: string): Promise<{ description: string; prompt: string }> {
    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: base64Image,
              },
            },
            {
              text: "Please describe this image in detail. Then, provide a concise prompt in English that can be used to recreate this exact scene WITHOUT watermarks. Format as JSON with 'description' and 'prompt' keys.",
            },
          ],
        },
        config: {
          responseMimeType: 'application/json'
        }
      });

      if (!response.text) {
        throw new Error('Empty response from model');
      }

      const data = JSON.parse(response.text);
      return {
        description: data.description || "暖暖看不太清，但能感觉到一股奇妙的气息。",
        prompt: data.prompt || "A beautiful artwork"
      };
    } catch (e) {
      return this.handleError(e);
    }
  }

  /**
   * Directly de-watermark by editing the image
   */
  async directDeWatermark(base64Image: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: base64Image,
              },
            },
            {
              text: "Redraw this image exactly as it is, but carefully remove all watermarks, logos, overlays, and text. Ensure the visual quality remains high and the content is identical to the original scene.",
            },
          ],
        },
      });

      const candidate = response.candidates?.[0];
      if (candidate?.finishReason === 'SAFETY' || candidate?.finishReason === 'BLOCKLIST') {
        throw new Error('Safety filter blocked the image generation.');
      }

      for (const part of candidate?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      
      throw new Error("模型没有返回生成的图像部分。");
    } catch (e) {
      return this.handleError(e);
    }
  }
}

export const geminiService = new GeminiService();
