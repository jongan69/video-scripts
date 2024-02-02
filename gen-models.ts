require('dotenv').config();
const { program } = require('commander');
const zip = require("zip");
const fs = require('fs');
const path = require("path");
const fetch = require('node-fetch');
const openai = require('openai');

const openaiApiKey = process.env.openaiApiKey;
const sketchApiKey = process.env.sketchApiKey;

// Fuck Sketch fab for forcing oauth2 to download models

program
  .option('-t, --topic <topic>', 'Specify the topic of the video script')
  .parse(process.argv);

const topic = program.opts().topic;
const modelDirectory = `./public` ?? projectDirectory
const textFilePath = `${modelDirectory}/video_script.txt`;

if (!textFilePath) {
  console.error('Please provide an topic using the -t or --topic option.');
  process.exit(1);
}

async function retrieveModelAssets() {
  const client = new openai({ apiKey: openaiApiKey });
  try {
    fs.readFile(textFilePath, async (err, data) => {
      if (err) throw err;
      const text = data.toString()
      console.log('Video Script loaded successfully');
      const prompt = `You are a 3D Model Expert. 
      Your Job is to idenitify all scenes in this script: ${text} and for each, create a brief phrase or object name related to the scene, no more than 5 words each. 
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

      fs.mkdirSync(modelDirectory, { recursive: true });
      console.log(modelDirectory)
      if (!Array.isArray(Scenes)) throw new Error("AI did not format properly, please try again");

      Scenes.forEach(async (scene) => {
        await searchSketchAssets(scene).then((model) => {
          if (model)
            console.log(`Found Model: ${model}`)
          downloadSketchAssets(model)
        });
      })
    })
  } catch (error) {
    console.error('Error saving model data:', error);
  }
}

// Function to search for stock footage using Pexels
async function searchSketchAssets(query) {
  try {
    console.log(`Searching for ${query}`);
    const url = `https://api.sketchfab.com/v3/search?type=models&q=${query}&downloadable=true&file_format=glb&archives_flavours=false`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${sketchApiKey}`,
      },
      mode: 'cors'
    };

    const model = await fetch(url, options)
      .then((response) => response.json())
      .then((data) => data.results[0].uri)

    return model;
  } catch (error) {
    console.error('Error searching for models:', error);
  }
}

async function downloadSketchAssets(model) {
  if (model !== undefined) {
    console.log(`Downloading Model ${model.uri}`)
    return new Promise((res, rej) => {
      var url = `https://api.sketchfab.com/v3/models/${model.uid}/download`;
      const options = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${sketchApiKey}`,
        },
        mode: 'cors'
      };
      fetch(url, options)
        .then((response) => response.json())
        .then((data) => console.log(data))
    })
  }
}

retrieveModelAssets();
