# import os
# from google import genai
# from typing import Optional

# class GeminiAI:
#     def __init__(self):
#         self.api_key = "AIzaSyA13I5c4fOFF77sBcXKK5Edh8X-nExGcB0"
#         if self.api_key == 'AIzaSyA13I5c4fOFF77sBcXKK5Edh8X-nExGcB0':
#             print("Warning: Please set your Gemini API key in environment variables or replace 'PASTE_API_KEY_HERE' in gemini_ai.py")
        
#         try:
#             genai.configure(api_key=self.api_key)
#             self.model = "gemini-1.5-flash"
#         except Exception as e:
#             print(f"Error initializing Gemini AI: {e}")
#             self.model = None
    
#     def generate_response(self, prompt: str) -> Optional[str]:
#         """Generate a response using Gemini AI"""
#         if not self.model:
#             return "AI service is not properly configured. Please check your API key."
        
#         try:
#             response = self.model.generate_content(prompt)
#             return response.text
#         except Exception as e:
#             return f"Error generating response: {str(e)}"
    
#     def is_configured(self) -> bool:
#         """Check if the AI is properly configured"""
#         return self.api_key != 'AIzaSyA13I5c4fOFF77sBcXKK5Edh8X-nExGcB0' and self.model is not None





# from google import genai
# from typing import Optional

# class GeminiAI:
#     def __init__(self):
#         # ⚠️ APNI NAYI API KEY YAHA PASTE KARO
#         self.api_key = "Paste_API_Key_Here"

#         try:
#             # Client create karo
#             self.client = genai.Client(api_key=self.api_key)

#             # Model name (string)
#             self.model = "gemini-1.5-flash"

#             print("✅ Gemini AI configured successfully")

#         except Exception as e:
#             print(f"❌ Error initializing Gemini AI: {e}")
#             self.client = None

#     def generate_response(self, prompt: str) -> Optional[str]:
#         if not self.client:
#             return "AI service is not properly configured."

#         try:
#             response = self.client.models.generate_content(
#                 model=self.model,
#                 contents=prompt
#             )
#             return response.text

#         except Exception as e:
#             return f"Error generating response: {e}"

#     def is_configured(self) -> bool:
#         return self.client is not None



import google.generativeai as genai
from typing import Optional
import os

class GeminiAI:
    def __init__(self, api_key: str):
        """
        Initialize Gemini AI with your API key
        
        Args:
            api_key: Your Google AI API key from https://makersuite.google.com/app/apikey
        """
        self.api_key = api_key

        try:
            # Configure the API
            genai.configure(api_key=self.api_key)
            
            # Use the correct model name
            self.model = genai.GenerativeModel('gemini-flash-lite-latest')
            
            print("✅ Gemini AI configured successfully")

        except Exception as e:
            print(f"❌ Error initializing Gemini AI: {e}")
            self.model = None

    def generate_response(self, prompt: str) -> Optional[str]:
        """
        Generate response from Gemini AI
        
        Args:
            prompt: Your question or prompt
            
        Returns:
            AI response as string or error message
        """
        if not self.model:
            return "AI service is not properly configured."

        try:
            # Add system prompt for better formatting
            system_prompt = """Please provide a well-structured, professional response using proper markdown formatting. Follow these guidelines:

1. Use clear headings (##, ###) for different sections
2. Use bullet points (*) for lists
3. Use numbered lists (1., 2., 3.) for sequential information
4. Use **bold** for important terms and emphasis
5. Use code blocks (```language) for code examples
6. Use tables for organized data when appropriate
7. Keep paragraphs concise and well-spaced
8. Use emojis sparingly for better readability

Format your response like a professional documentation or tutorial.

User Question: """
            
            full_prompt = system_prompt + prompt
            response = self.model.generate_content(full_prompt)
            return response.text

        except Exception as e:
            error_str = str(e)
            if "quota" in error_str.lower() or "429" in error_str:
                return "I apologize, but I've reached my usage limit for now. Please try again later or check your API quota at https://ai.google.dev/gemini-api/docs/rate-limits"
            elif "404" in error_str or "not found" in error_str.lower():
                return "AI model is not available. Please check the model configuration."
            else:
                return f"Error generating response: {e}"

    def is_configured(self) -> bool:
        """Check if AI is properly configured"""
        return self.model is not None


# 📍 Example usage - API key should be loaded from .env file
if __name__ == "__main__":
    # AI object create karo
    ai = GeminiAI(api_key="your_api_key_here")
    
    # Check if configured properly
    if ai.is_configured():
        # Test prompt
        prompt = "Hello! How are you?"
        response = ai.generate_response(prompt)
        print(f"\n🤖 AI Response: {response}")
    else:
        print("❌ AI is not configured properly. Check your API key!")