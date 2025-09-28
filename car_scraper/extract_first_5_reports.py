#!/usr/bin/env python3
"""
Extract Carfax report links for the first 5 listings only.
"""

import json
import requests
from bs4 import BeautifulSoup
import time
import re

def extract_carfax_report_link(listing_url):
    """Extract the specific Carfax report link from a listing page."""
    try:
        print(f"🔍 Scraping: {listing_url}")
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(listing_url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Look for the specific Carfax report link pattern
        # Pattern: https://www.carfax.com/vehiclehistory/ccl/[encoded_string]
        report_links = soup.find_all('a', href=re.compile(r'https://www\.carfax\.com/vehiclehistory/ccl/'))
        
        for link in report_links:
            href = link.get('href')
            text = link.get_text(strip=True).lower()
            
            # Look for "View FREE CARFAX Report" or similar
            if href and ('view' in text and 'report' in text):
                print(f"✅ Found report link: {href}")
                return href
        
        print(f"❌ No report link found")
        return None
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def main():
    # Read the JSON file
    with open('carfax_search_results.json', 'r') as f:
        data = json.load(f)
    
    # Process only first 5 listings
    carfax_report_links = []
    
    print(f"🚀 Processing first 5 listings...")
    
    for i, item in enumerate(data[:5]):
        if isinstance(item, dict) and 'listing_url' in item:
            listing_url = item['listing_url']
            vin = item.get('vin', '')
            
            print(f"\n📊 Processing {i+1}/5 - VIN: {vin}")
            
            # Extract the Carfax report link
            report_link = extract_carfax_report_link(listing_url)
            
            if report_link:
                carfax_report_links.append({
                    "vin": vin,
                    "listing_url": listing_url,
                    "carfax_report_url": report_link
                })
            
            # Add delay between requests
            time.sleep(2)
    
    # Create output - just the links, nothing else
    output_data = carfax_report_links
    
    # Write to output file
    with open('carfax_report_links_first_5.json', 'w') as f:
        json.dump(output_data, f, indent=2)
    
    print(f"\n✅ Extraction completed!")
    print(f"📁 Output file: carfax_report_links_first_5.json")
    print(f"🔗 Carfax report links found: {len(carfax_report_links)}")
    
    # Show the results
    print(f"\n📋 Results:")
    for i, link in enumerate(carfax_report_links):
        print(f"{i+1}. VIN: {link['vin']}")
        print(f"   Report URL: {link['carfax_report_url']}")

if __name__ == "__main__":
    main()
