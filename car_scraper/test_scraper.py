#!/usr/bin/env python3
"""
Test script to scrape a few Carfax report links first.
"""

import json
import requests
from bs4 import BeautifulSoup
import time
import random
from urllib.parse import urljoin
import re

def test_scrape_carfax_report(listing_url):
    """Test scraping a single Carfax listing page."""
    try:
        print(f"🔍 Testing: {listing_url}")
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(listing_url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Look for Carfax report links
        report_links = []
        
        # Find all links
        all_links = soup.find_all('a', href=True)
        for link in all_links:
            href = link.get('href')
            text = link.get_text(strip=True).lower()
            
            # Check if it's a report link
            if href and ('report' in href.lower() or 'report' in text):
                full_url = urljoin(listing_url, href)
                report_links.append({
                    'text': link.get_text(strip=True),
                    'href': full_url
                })
        
        print(f"📄 Page title: {soup.title.string if soup.title else 'No title'}")
        print(f"🔗 Found {len(report_links)} potential report links:")
        for i, link in enumerate(report_links[:5]):  # Show first 5
            print(f"  {i+1}. {link['text']} -> {link['href']}")
        
        return report_links
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return []

def main():
    # Test with first few URLs from the JSON
    with open('carfax_search_results.json', 'r') as f:
        data = json.load(f)
    
    # Test first 3 URLs
    for i, item in enumerate(data[:3]):
        if 'listing_url' in item:
            print(f"\n{'='*60}")
            print(f"Test {i+1}/3")
            test_scrape_carfax_report(item['listing_url'])
            time.sleep(2)

if __name__ == "__main__":
    main()
