import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
// const model = genAI.getGenerativeModel({ model: "gemini-pro" });
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Adjectives array for variation
// const topics = [
//     'travel',
//     'hobbies',
//     'music',
//     'movies',
//     'books',
//     'goals',
//     'food',
//     'memories',
//     'friendship',
//     'dreams',
//     'family',
//     'favorite places',
//     'technology',
//     'sports',
//     'personal growth',
//     'adventure',
//     'nature',
//     'creativity',
//     'learning',
//     'fun facts'
// ];

// Helper function to generate a random prompt
// const getRandomPrompt = () => {
//     const randomTopic = topics[Math.floor(Math.random() * topics.length)];
//     const prompt = `Generate three open-ended questions or sentences about the topic '${randomTopic}'. Each question or sentence should encourage thoughtful conversations and be under 200 words. The output should be a single string, with each question or sentence separated by '||'. Do not add '||' at the start or end of the string. Do not include numbers, bullet points, special characters, or any other symbols. The output should only contain plain sentences or questions separated by '||'.`;
//     return prompt;
// };

// const getRandomPrompt = () => {
//     const randomTopic = topics[Math.floor(Math.random() * topics.length)];
//     const timestamp = new Date().getTime();  // Add a timestamp to ensure randomness
//     const prompt = `Generate three open-ended suggestions or advice type sentences about the topic '${randomTopic}' at time ${timestamp}. Each question or sentence should encourage thoughtful conversations and be under 200 words. The output should be a single string, with each suggestions or advice type sentences are separated by '||'. Do not add '||' at the start or end of the string. Do not include numbers, bullet points, special characters, or any other symbols. The output should only contain plain sentences or questions separated by '||'`;
//     return prompt;
// };

const topics = [
    "Write an inspiring message.",
    "What advice would you give to someone feeling low?",
    "Suggest three motivational quotes."
]

function getRandomPrompt() {
    const timestamp = new Date().getTime();
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
        const prompt = `Generate three sentences about the topic '${randomTopic}' at time ${timestamp}. Each sentence should be under 200 words. The output should be a single string, with each sentence is separated by '||'. Do not add '||' at the start or end of the string. Do not include numbers, bullet points, special characters, or any other symbols. The output should only contain plain sentences or questions separated by '||'`;

    // Pick a random prompt
    return prompt;
}




export async function GET() {
    try {
        // Generate a new prompt on each request
        const prompt = getRandomPrompt();

        const result = await model.generateContent(prompt);
        const response = result.response.text();

        return NextResponse.json({
            success: true,
            message: response,
        }, {
            status: 200,
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            },
        });

    } catch (error) {
        console.log("Error generating messages", error);
        return NextResponse.json({
            success: false,
            message: 'Error generating messages',
        }, { status: 500 });
    }
}
