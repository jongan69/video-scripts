require('dotenv').config();
const { program } = require('commander');
const openai = require('openai');
const fs = require('fs');
const path = require("path");

const openaiApiKey = process.env.openaiApiKey;

const captionDirectory = `./public` ?? projectDirectory
const textFilePath = `${captionDirectory}/video_script.txt`;

if (!textFilePath) {
  console.error('Please generate a script using yarn gen -t <"Insert your topic in quotes">or --topic option.');
  process.exit(1);
}

async function generateVideoCaptions() {
  const client = new openai({ apiKey: openaiApiKey });
  try {
    const textFile = fs.readFileSync(textFilePath);
    console.log(textFile)
    fs.readFile(textFilePath, async (err, data) => {
      if (err) throw err;
      const text = data.toString()
      console.log(text);
      const prompt = `You are in charge of creating captioning and narrating from this script: ${text} . Make the cpations first person.`;
      const captions = await client.chat.completions.create({
        messages: [{ "role": "system", "content": prompt }],
        model: 'gpt-4',
      });

      if (captions) {
        const videoCaptions = captions.choices[0].message.content;
        console.log('Generated Captions Script:');
        console.log(videoCaptions);

        // Create a directory with the topic as the name
        fs.mkdirSync(captionDirectory, { recursive: true });

        const filePath = path.join(captionDirectory, 'video_captions.txt');
        fs.writeFileSync(filePath, videoCaptions, 'utf-8');
      } else {
        console.error('Failed to caption script.');
      }
    });
  } catch (error) {
    console.error('Error captioning script:', error);
  }
}

generateVideoCaptions();
