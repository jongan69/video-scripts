require('dotenv').config();
const { program } = require('commander');
const openai = require('openai');
const fs = require('fs');
const path = require("path");

const openaiApiKey = process.env.openaiApiKey;

program
  .option('-t, --topic <topic>', 'Specify the topic for the video script')
  .parse(process.argv);

const topic = program.opts().topic;
const scriptDirectory = `./public` ?? projectDirectory

if (!topic) {
  console.error('Please provide a topic using the -t or --topic option.');
  process.exit(1);
}

async function generateVideoScript(topic) {

  const client = new openai({ apiKey: openaiApiKey });
  const prompt = `You are a World Renowned Movie Screen and Story Writer. Generate a video script about ${topic}.`;

  try {
    const response = await client.chat.completions.create({
      messages: [{ "role": "system", "content": prompt }],
      model: 'gpt-4',
    });

    const videoScript = response.choices[0].message.content;
    console.log('Generated Video Script:');
    console.log(videoScript);

    // Save the video script to a .txt file in the directory
    const filePath = path.join(scriptDirectory, 'video_script.txt');
    fs.writeFileSync(filePath, videoScript, 'utf-8');

    console.log(`Video script saved to ${filePath}`);
  } catch (error) {
    console.error('Error generating the video script:', error);
  }
}

generateVideoScript(topic);
