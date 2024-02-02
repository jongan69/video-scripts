require('dotenv').config();
const { program } = require('commander');
const fs = require('fs');
const path = require("path");
const openai = require('openai');
const { createClient } = require('pexels');

const openaiApiKey = process.env.openaiApiKey;
const pexelsApiKey = process.env.pexelsApiKey;

program
  .option('-t, --topic <topic>', 'Specify the topic of the video script')
  .parse(process.argv);

const topic = program.opts().topic;
const stockDirectory = `./public` ?? projectDirectory
const textFilePath = `${stockDirectory}/video_script.txt`;

if (!textFilePath || !topic) {
  console.error('Please provide an topic using the -t or --topic option.');
  process.exit(1);
}





async function retrieveStockFootage() {
  const client = new openai({ apiKey: openaiApiKey });
  try {
    const textFile = fs.readFileSync(textFilePath);
    console.log(textFile)
    fs.readFile(textFilePath, async (err, data) => {
      if (err) throw err;
      const text = data.toString()
      console.log(text);
      const prompt = `You are a World Renowned Movie Screen Director. 
      Your Job is to idenitify all scenes in this script and create a searchable video phrase. 
      return a properly formatted JSON array of only phrases in order with nothing else.`;

      const response = await client.chat.completions.create({
        response_format: { type: "json_object" },
        messages: [{ "role": "system", "content": prompt }],
        model: "gpt-3.5-turbo-1106",
      });

      const JSONScenes = response.choices[0].message.content;
      const Scenes = JSON.parse(JSONScenes).scenes;
      console.log('Scenes:');
      console.log(Scenes);

      console.log(`Going to save stock videos in ${stockDirectory}`)
      if (!Array.isArray(Scenes)) throw new Error("AI did not format properly, please try again");

      Scenes.forEach(async (scene) => {
        const stockFootageUrl = await searchStockFootage(scene);
        download(scene, stockFootageUrl)
      })
    })
  } catch (error) {
    console.error('Error retrieving stock footage:', error);
  }
}

// Function to search for stock footage using Pexels
async function searchStockFootage(query) {
  const client = createClient(pexelsApiKey);
  try {
    const videos = await client.videos.search({ query, per_page: 1 });
    // console.log(videos.videos[0], query)
    return videos.videos[0];
  } catch (error) {
    console.error('Error searching for stock footage:', error);
    return null;
  }
}

async function download(scene, video) {
  const title = scene.replace(/[^\w\s]/g, '').replace(/\s+/g, '_');
  console.log(`Downloading video ${title}`)
  return new Promise((res, rej) => {
    fetch(video.video_files[0].link).then(res => res.blob()).then(async file => {
      const bufferData = Buffer.from(await file.arrayBuffer());
      if (bufferData) fs.writeFileSync(`${stockDirectory}/${title}.mp4`, bufferData, 'utf-8');
    }).catch(err => {
      rej(err);
    });
  });
}

retrieveStockFootage();
