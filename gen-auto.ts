require('dotenv').config();
const { program } = require('commander');
const openai = require('openai');
const fs = require('fs');
const path = require("path");

const openaiApiKey = process.env.openaiApiKey;

const captionDirectory = `./public` ?? projectDirectory
const videoPath = `${captionDirectory}/stream.mp4`;

async function autoCut() {
  const client = new openai({ apiKey: openaiApiKey });
  try {
   // Chain 1: Transcribe .MP4
   // Chain 2: Take prompt + Transcript + Timestamps
  } catch (error) {
    console.error('Error captioning script:', error);
  }
}

transcribeVideoCaptions();
