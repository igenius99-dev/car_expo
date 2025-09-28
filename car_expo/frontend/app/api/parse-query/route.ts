import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to update config.json with make and model
function updateConfigJson(make: string, model: string) {
  try {
    // Use absolute path to avoid issues with Next.js working directory
    const configPath = '/Users/igenius/Desktop/Hobby_projects/final_sun/car_expo/car_scraper/config.json';
    console.log('Attempting to update config at path:', configPath);
    
    // Check if file exists
    if (!fs.existsSync(configPath)) {
      console.error('Config file not found at:', configPath);
      return false;
    }
    
    // Read current config
    const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    
    // Update make and model
    configData.search_config.make = make.toLowerCase();
    configData.search_config.model = model.toLowerCase();
    
    // Write back to file
    fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));
    
    console.log(`Updated config.json with make: ${make}, model: ${model}`);
    return true;
  } catch (error) {
    console.error('Error updating config.json:', error);
    return false;
  }
}

// Function to run the scraper
async function runScraper() {
  try {
    const scraperPath = '/Users/igenius/Desktop/Hobby_projects/final_sun/car_expo/car_scraper';
    console.log('Running scraper from:', scraperPath);
    
    // Run the scraper with a timeout using the virtual environment's Python
    const venvPython = path.join(scraperPath, 'venv', 'bin', 'python');
    console.log('Using Python from:', venvPython);
    console.log('Virtual env exists:', fs.existsSync(venvPython));
    
    // Use virtual environment Python if it exists, otherwise fall back to system python3
    const pythonCommand = fs.existsSync(venvPython) ? venvPython : 'python3';
    console.log('Final Python command:', pythonCommand);
    
    const { stdout, stderr } = await execAsync(`${pythonCommand} carfax_tempe_scraper.py`, {
      cwd: scraperPath,
      timeout: 300000, // 5 minutes timeout
    });
    
    console.log('Scraper stdout:', stdout);
    if (stderr) {
      console.log('Scraper stderr:', stderr);
    }
    
    // Read the results file
    const resultsPath = path.join(scraperPath, 'carfax_search_results.json');
    if (fs.existsSync(resultsPath)) {
      const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
      console.log(`Scraper found ${results.length} cars`);
      return {
        success: true,
        carCount: results.length,
        results: results, // Return all results for swiping
        stdout: stdout,
        stderr: stderr
      };
    } else {
      return {
        success: false,
        error: 'Results file not found',
        stdout: stdout,
        stderr: stderr
      };
    }
  } catch (error) {
    console.error('Error running scraper:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stdout: '',
      stderr: ''
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Create the prompt for OpenAI
    const prompt = `Extract car information from the following user query and return ONLY a JSON object with the following structure:
{
  "make": "car make (e.g., Toyota, Honda, BMW)",
  "model": "car model (e.g., Camry, Accord, X5)",
  "year": "year if mentioned (e.g., 2020, 2023)",
  "type": "vehicle type if mentioned (e.g., sedan, SUV, truck, EV)",
  "price": "price range if mentioned (e.g., under 25000, 20000-30000)",
  "features": ["any specific features mentioned"]
}

User query: "${query}"

Return ONLY the JSON object, no additional text or explanation.`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that extracts car information from user queries and returns structured JSON data. Always return valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 200,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // Try to parse the JSON response
    let parsedData;
    try {
      parsedData = JSON.parse(response);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', response);
      return NextResponse.json(
        { error: 'Failed to parse OpenAI response' },
        { status: 500 }
      );
    }

    // Update config.json if we have valid make and model
    let configUpdated = false;
    let scraperResults = null;
    
    if (parsedData.make && parsedData.model) {
      configUpdated = updateConfigJson(parsedData.make, parsedData.model);
      
      // Run scraper if config was updated successfully
      if (configUpdated) {
        console.log('Config updated successfully, running scraper...');
        scraperResults = await runScraper();
      }
    }

    // Log the OpenAI output as requested
    console.log('OpenAI API Response:', {
      originalQuery: query,
      parsedData: parsedData,
      rawResponse: response,
      configUpdated: configUpdated,
      scraperResults: scraperResults
    });

    return NextResponse.json({
      success: true,
      originalQuery: query,
      parsedData: parsedData,
      rawResponse: response,
      configUpdated: configUpdated,
      scraperResults: scraperResults
    });

  } catch (error) {
    console.error('Error in parse-query API:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to parse query',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
