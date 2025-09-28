#!/usr/bin/env python3
"""
Carfax Tempe Area Scraper
Searches for cars within 200 miles of Tempe, Arizona
Allows user to select make and model
"""

import requests
import json
import time
import os
from datetime import datetime

class CarfaxTempeScraper:
    def __init__(self, config_file="config.json"):
        self.session = requests.Session()
        # Headers based on the discovered API
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Referer': 'https://www.carfax.com/',
            'Origin': 'https://www.carfax.com',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'cross-site',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
        })
        self.cars_data = []
        self.api_base_url = "https://helix.carfax.com/search/v2/vehicles"
        
        # Load configuration
        self.config = self.load_config(config_file)
        self.tempe_zip = self.config['location_config']['zip_code']
        self.search_radius = self.config['location_config']['radius_miles']
    
    def load_config(self, config_file):
        """Load configuration from JSON file"""
        try:
            if os.path.exists(config_file):
                with open(config_file, 'r', encoding='utf-8') as f:
                    config = json.load(f)
                print(f"Configuration loaded from {config_file}")
                return config
            else:
                print(f"Config file {config_file} not found. Using default configuration.")
                return self.get_default_config()
        except Exception as e:
            print(f"Error loading config file: {e}. Using default configuration.")
            return self.get_default_config()
    
    def get_default_config(self):
        """Return default configuration if config file is not available"""
        return {
            "search_config": {
                "make": "Honda",
                "model": "Civic",
                "max_pages": 10,
                "rows_per_page": 24
            },
            "location_config": {
                "zip_code": "85281",
                "city": "Tempe",
                "state": "AZ",
                "radius_miles": 50
            },
            "output_config": {
                "save_to_json": True,
                "filename": "carfax_search_results.json"
            },
            "scraping_config": {
                "delay_between_requests": 2,
                "timeout_seconds": 10,
                "max_retries": 3
            }
        }
    
    
    def build_api_params(self, make, model, page=1, rows=None):
        """Build API parameters for Tempe area search"""
        if rows is None:
            rows = self.config['search_config']['rows_per_page']
            
        params = {
            'zip': self.tempe_zip,
            'radius': self.search_radius,
            'sort': 'BEST',
            'certified': 'false',
            'vehicleCondition': 'USED',
            'rows': rows,
            'mpgCombinedMin': 0,
            'page': page,
            'dynamicRadius': 'false',
            'fetchImageLimit': 6,
            'tpPositions': '1,2,3',
            'make': make,
            'model': model
        }
        
        # Add urlInfo for the search
        params['urlInfo'] = f"{make}-{model}_w10920"
        
        return params
    
    def extract_cars_from_response(self, data):
        """Extract car data from API response"""
        cars = []
        
        if not isinstance(data, dict) or 'listings' not in data:
            return cars
        
        for listing in data['listings']:
            if not isinstance(listing, dict):
                continue
            
            # Extract dealer information
            dealer = listing.get('dealer', {})
            
            # Extract car data
            car_data = {
                'vin': listing.get('vin', ''),
                'year': str(listing.get('year', '')),
                'make': listing.get('make', ''),
                'model': listing.get('model', ''),
                'trim': listing.get('trim', ''),
                'sub_trim': listing.get('subTrim', ''),
                'price': self.format_price(listing.get('currentPrice', '')),
                'list_price': self.format_price(listing.get('listPrice', '')),
                'mileage': self.format_mileage(listing.get('mileage', '')),
                'location': f"{dealer.get('city', '')}, {dealer.get('state', '')}",
                'dealer': dealer.get('name', ''),
                'dealer_address': f"{dealer.get('address', '')}, {dealer.get('city', '')}, {dealer.get('state', '')} {dealer.get('zip', '')}",
                'dealer_phone': dealer.get('phone', ''),
                'dealer_rating': dealer.get('dealerAverageRating', ''),
                'dealer_review_count': dealer.get('dealerReviewCount', ''),
                'exterior_color': listing.get('exteriorColor', ''),
                'interior_color': listing.get('interiorColor', ''),
                'engine': listing.get('engine', ''),
                'displacement': listing.get('displacement', ''),
                'transmission': listing.get('transmission', ''),
                'drivetrain': listing.get('drivetype', ''),
                'fuel_type': listing.get('fuel', ''),
                'mpg_city': listing.get('mpgCity', ''),
                'mpg_highway': listing.get('mpgHighway', ''),
                'body_style': listing.get('bodytype', ''),
                'vehicle_condition': listing.get('vehicleCondition', ''),
                'stock_number': listing.get('stockNumber', ''),
                'listing_url': listing.get('vdpUrl', ''),
                'image_url': self.get_image_url(listing.get('images', {})),
                'image_count': listing.get('imageCount', ''),
                'top_options': listing.get('topOptions', []),
                'no_accidents': listing.get('noAccidents', ''),
                'service_records': listing.get('serviceRecords', ''),
                'first_seen': listing.get('firstSeen', ''),
                'distance_to_dealer': listing.get('distanceToDealer', ''),
                'record_type': listing.get('recordType', ''),
                'advantage': listing.get('advantage', ''),
                'scraped_at': datetime.now().isoformat()
            }
            
            # Add monthly payment estimate if available
            monthly_payment = listing.get('monthlyPaymentEstimate', {})
            if monthly_payment:
                car_data['monthly_payment'] = {
                    'amount': monthly_payment.get('monthlyPayment', ''),
                    'down_payment': monthly_payment.get('downPaymentAmount', ''),
                    'loan_amount': monthly_payment.get('loanAmount', ''),
                    'interest_rate': monthly_payment.get('interestRate', ''),
                    'term_months': monthly_payment.get('termInMonths', '')
                }
            
            # Add accident and service history
            accident_history = listing.get('accidentHistory', {})
            if accident_history:
                car_data['accident_history'] = {
                    'text': accident_history.get('text', ''),
                    'summary': accident_history.get('accidentSummary', [])
                }
            
            service_history = listing.get('serviceHistory', {})
            if service_history:
                car_data['service_history'] = {
                    'text': service_history.get('text', ''),
                    'count': service_history.get('number', ''),
                    'history': service_history.get('history', [])
                }
            
            if car_data['vin']:
                cars.append(car_data)
        
        return cars
    
    def get_image_url(self, images_data):
        """Extract the best image URL from images data"""
        if not isinstance(images_data, dict):
            return ''
        
        # Try to get the first photo
        first_photo = images_data.get('firstPhoto', {})
        if first_photo:
            return first_photo.get('medium', first_photo.get('large', ''))
        
        # Fallback to base URL
        base_url = images_data.get('baseUrl', '')
        if base_url:
            return f"{base_url}1/344x258"
        
        return ''
    
    def format_price(self, price):
        """Format price consistently"""
        if not price:
            return ''
        
        if isinstance(price, (int, float)):
            return f"${price:,.0f}"
        
        price_str = str(price)
        if '$' not in price_str and price_str.isdigit():
            return f"${price_str}"
        
        return price_str
    
    def format_mileage(self, mileage):
        """Format mileage consistently"""
        if not mileage:
            return ''
        
        if isinstance(mileage, (int, float)):
            return f"{mileage:,.0f} miles"
        
        mileage_str = str(mileage)
        if 'miles' not in mileage_str.lower() and mileage_str.isdigit():
            return f"{mileage_str} miles"
        
        return mileage_str
    
    def scrape_page(self, make, model, page=1, rows=None):
        """Scrape a single page from the API"""
        try:
            if rows is None:
                rows = self.config['search_config']['rows_per_page']
            params = self.build_api_params(make, model, page, rows)
            
            print(f"Fetching page {page} for {make} {model}...")
            
            timeout = self.config['scraping_config']['timeout_seconds']
            response = self.session.get(self.api_base_url, params=params, timeout=timeout)
            
            if response.status_code == 200:
                try:
                    # Try to get JSON directly
                    data = response.json()
                    cars = self.extract_cars_from_response(data)
                    print(f"Found {len(cars)} cars on page {page}")
                    return cars, data
                except json.JSONDecodeError as e:
                    print(f"JSON decode error: {e}")
                    
                    # Try manual decompression - check for Brotli compression
                    content_encoding = response.headers.get('content-encoding', '')
                    
                    if content_encoding == 'br':
                        # Brotli compression
                        try:
                            import brotli
                            content = brotli.decompress(response.content).decode('utf-8')
                            data = json.loads(content)
                            cars = self.extract_cars_from_response(data)
                            print(f"Found {len(cars)} cars on page {page}")
                            return cars, data
                        except ImportError:
                            print("Brotli library not installed. Install with: pip install brotli")
                            return [], None
                        except Exception as brotli_error:
                            print(f"Brotli decompression error: {brotli_error}")
                            return [], None
                    elif content_encoding == 'gzip':
                        # Gzip compression
                        import gzip
                        try:
                            content = gzip.decompress(response.content).decode('utf-8')
                            data = json.loads(content)
                            cars = self.extract_cars_from_response(data)
                            print(f"Found {len(cars)} cars on page {page}")
                            return cars, data
                        except Exception as gzip_error:
                            print(f"Gzip decompression error: {gzip_error}")
                            return [], None
                    else:
                        print(f"Unknown compression: {content_encoding}")
                        return [], None
            else:
                print(f"Error: {response.status_code} - {response.text[:500]}")
                return [], None
                
        except requests.RequestException as e:
            print(f"Request error: {e}")
            return [], None
        except json.JSONDecodeError as e:
            print(f"JSON decode error: {e}")
            return [], None
        except Exception as e:
            print(f"Unexpected error: {e}")
            return [], None
    
    def scrape_all_pages(self, make, model, max_pages=None, rows=None):
        """Scrape all pages of results"""
        if max_pages is None:
            max_pages = self.config['search_config']['max_pages']
        if rows is None:
            rows = self.config['search_config']['rows_per_page']
            
        all_cars = []
        page = 1
        
        while page <= max_pages:
            print(f"\n--- Page {page} ---")
            
            cars, response_data = self.scrape_page(make, model, page, rows)
            
            if not cars:
                print(f"No cars found on page {page}, stopping...")
                break
            
            all_cars.extend(cars)
            
            # Check if we've reached the last page
            if response_data and 'facets' in response_data:
                # Look for total count in facets or other indicators
                total_count = 0
                for facet_name, facet_data in response_data['facets'].items():
                    if isinstance(facet_data, dict) and 'facets' in facet_data:
                        for facet in facet_data['facets']:
                            if facet.get('name') == 'Used':
                                total_count = facet.get('value', 0)
                                break
                
                if total_count > 0:
                    total_pages = (total_count + rows - 1) // rows
                    print(f"Total results: {total_count}, Total pages: {total_pages}")
                    
                    if page >= total_pages:
                        print("Reached last page, stopping...")
                        break
            
            page += 1
            
            # Be respectful - add delay between requests
            delay = self.config['scraping_config']['delay_between_requests']
            time.sleep(delay)
        
        return all_cars
    
    def save_to_json(self, cars_data, make, model):
        """Save car data to JSON file"""
        if not self.config['output_config']['save_to_json']:
            print("Saving to JSON is disabled in configuration")
            return None
            
        # Use filename from config (single file that gets replaced each time)
        filename = self.config['output_config']['filename']
            
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(cars_data, f, indent=2, ensure_ascii=False)
            print(f"Data saved to {filename}")
            return filename
        except Exception as e:
            print(f"Error saving to JSON: {e}")
            return None
    
    def get_config_search_params(self):
        """Get make and model from configuration"""
        search_config = self.config['search_config']
        make = search_config.get('make', '').strip()
        model = search_config.get('model', '').strip()
        return make, model
    
    def run(self, make=None, model=None, max_pages=None, rows=None):
        """Main method to run the scraper"""
        city = self.config['location_config']['city']
        state = self.config['location_config']['state']
        zip_code = self.config['location_config']['zip_code']
        
        print("Starting Carfax Tempe Area Scraper...")
        print(f"Search radius: {self.search_radius} miles from {city}, {state} ({zip_code})")
        print("-" * 60)
        
        # Get make and model from config
        config_make, config_model = self.get_config_search_params()
        if config_make and config_model:
            make, model = config_make, config_model
            print(f"Using configuration: {make} {model}")
        else:
            print("No make/model found in configuration. Exiting.")
            return []
        
        print(f"Searching for: {make} {model}")
        print(f"Location: Within {self.search_radius} miles of {city}, {state}")
        print("-" * 60)
        
        # Scrape all pages
        all_cars = self.scrape_all_pages(make, model, max_pages, rows)
        
        # Remove duplicates based on VIN
        unique_cars = []
        seen_vins = set()
        for car in all_cars:
            if car['vin'] and car['vin'] not in seen_vins:
                unique_cars.append(car)
                seen_vins.add(car['vin'])
        
        print("-" * 60)
        print(f"Scraping completed!")
        print(f"Total cars found: {len(unique_cars)}")
        
        # Save to JSON file
        filename = self.save_to_json(unique_cars, make, model)
        
        # Display summary
        print(f"\nCars Data Summary:")
        for i, car in enumerate(unique_cars[:10], 1):
            distance = car.get('distance_to_dealer', 'N/A')
            print(f"{i}. {car['year']} {car['make']} {car['model']} {car['trim']} - {car['price']} - {car['mileage']} - {car['location']} ({distance} miles)")
        
        if len(unique_cars) > 10:
            print(f"... and {len(unique_cars) - 10} more cars")
        
        if filename:
            print(f"\nAll cars data has been saved to '{filename}'")
        
        return unique_cars

def main():
    # Create scraper instance (loads config.json automatically)
    scraper = CarfaxTempeScraper()
    
    # Run with configuration settings
    cars_data = scraper.run()
    
    print(f"\nTotal cars scraped: {len(cars_data)}")

if __name__ == "__main__":
    main()