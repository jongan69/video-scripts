require('dotenv').config();
const { program } = require('commander');
const fs = require('fs');
const path = require("path");
const openai = require('openai');

const openaiApiKey = process.env.openaiApiKey;

program
  .option('-v, --voice <voice>', 'Specify the voice for the video speech (alloy, echo, fable, onyx, nova, and shimmer)')
  .parse(process.argv);

const voice = program.opts().voice;
const speechDirectory = `./public` ?? projectDirectory
const textFilePath = `${speechDirectory}/video_captions.txt`;

if (!textFilePath) {
  console.error('Please generate a video script providing a topic using yarn gen script -t <topic> or --topic option before transcribing');
  process.exit(1);
}

async function synthesizeText() {
  const client = new openai({ apiKey: openaiApiKey });
  try {
    const textFile = fs.readFileSync(textFilePath);
    console.log(textFile)
    fs.readFile(textFilePath, async (err, data) => {
      if (err) throw err;
      const text = data.toString()
      console.log(text);
      const mp3 = await client.audio.speech.create({
        model: "tts-1",
        voice: voice ?? "alloy",
        input: text,
      });

      if (mp3) {
        try {
          console.log(`Transcription Status: ${mp3.status}`);
          console.log(`Please Wait, Saving Speech as .mp3 in ${speechDirectory}...`);
          const buffer = Buffer.from(await mp3.arrayBuffer())
          if (buffer) {
            await fs.promises.writeFile(`${speechDirectory}/speech.mp3`, buffer);
          }
        } catch {
          console.log(`Saved Speech as .mp3 in ${speechDirectory}, you can try other voice with -v (alloy, echo, fable, onyx, nova, and shimmer)`);
        }
      } else {
        console.error('Failed to transcribe audio.');
      }
    });
  } catch (error) {
    console.error('Error transcribing audio:', error);
  }
}

synthesizeText();
