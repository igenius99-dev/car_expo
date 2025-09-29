from http.server import BaseHTTPRequestHandler
import json
import sys
import os

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from carfax_tempe_scraper import CarfaxTempeScraper

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # Get the content length
            content_length = int(self.headers['Content-Length'])
            
            # Read the request body
            post_data = self.rfile.read(content_length)
            
            # Parse JSON data
            data = json.loads(post_data.decode('utf-8'))
            
            # Extract make and model from the request
            make = data.get('make', 'toyota')
            model = data.get('model', 'camry')
            
            # Initialize scraper
            scraper = CarfaxTempeScraper()
            
            # Update config with make and model
            scraper.config['search_config']['make'] = make.lower()
            scraper.config['search_config']['model'] = model.lower()
            
            # Run the scraper
            results = scraper.scrape_cars()
            
            # Return results
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            
            response = {
                'success': True,
                'carCount': len(results),
                'results': results
            }
            
            self.wfile.write(json.dumps(response).encode('utf-8'))
            
        except Exception as e:
            # Return error response
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            error_response = {
                'success': False,
                'error': str(e)
            }
            
            self.wfile.write(json.dumps(error_response).encode('utf-8'))
    
    def do_OPTIONS(self):
        # Handle CORS preflight requests
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
