# Setup Instructions

## 1. Install Dependencies

Run the following command to install all required packages:

```bash
npm install
```

## 2. Get Your OpenWeatherMap API Key

1. Go to [https://openweathermap.org/api](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to your API keys section
4. Copy your API key

## 3. Create Environment File

Create a file named `.env.local` in the root directory of the project with the following content:

```
NEXT_PUBLIC_WEATHER_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with your actual API key from step 2.

**Important**: The `.env.local` file is already in `.gitignore`, so it won't be committed to version control.

## 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app!

## Troubleshooting

- **API key errors**: Make sure your `.env.local` file is in the root directory and the variable name is exactly `NEXT_PUBLIC_WEATHER_API_KEY`
- **Module not found errors**: Run `npm install` again
- **Port already in use**: Change the port by running `npm run dev -- -p 3001`

