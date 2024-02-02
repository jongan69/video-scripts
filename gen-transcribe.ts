require('dotenv').config();
const { program } = require('commander');
const openai = require('openai');
const fs = require('fs');
const path = require("path");

const openaiApiKey = process.env.openaiApiKey;

const captionDirectory = `./public` ?? projectDirectory
const videoPath = `${captionDirectory}/stream.mp4`;

// program
//   .option('-a, --audio <soundfile>', 'Alternatively Specify the sound file to transcribe')
//   .parse(process.argv);

// const audio = program.opts().audio;
// if (audio) {
//   console.error('Pass audio to transcribe ');
//  
// }

async function transcribeVideoCaptions() {
  const client = new openai({ apiKey: openaiApiKey });
  try {
   
  } catch (error) {
    console.error('Error captioning script:', error);
  }
}

transcribeVideoCaptions();
