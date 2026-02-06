from flask import Flask, render_template, request, jsonify
from gemini_ai import GeminiAI
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Get API key from environment variables
api_key = os.getenv('GEMINI_API_KEY')
if not api_key:
    print("Warning: GEMINI_API_KEY not found in environment variables")
    print("Please create a .env file with your API key or set it as environment variable")
    # Use a placeholder key for now to prevent initialization error
    api_key = "placeholder_key_please_set_env_variable"

ai = GeminiAI(api_key)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({'error': 'No message provided'}), 400
        
        user_message = data['message'].strip()
        if not user_message:
            return jsonify({'error': 'Empty message'}), 400
        
        ai_response = ai.generate_response(user_message)
        
        return jsonify({
            'response': ai_response,
            'configured': ai.is_configured()
        })
    
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/health')
def health():
    return jsonify({
        'status': 'healthy',
        'ai_configured': ai.is_configured()
    })

if __name__ == '__main__':
    print("Starting AI Chatbot...")
    print("Please ensure you have set your Gemini API key:")
    print("1. Create a .env file with GEMINI_API_KEY=your_key_here")
    print("2. Or set it as an environment variable")
    print("3. Or replace 'PASTE_API_KEY_HERE' in gemini_ai.py")
    print("\nStarting server on http://localhost:5000")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
