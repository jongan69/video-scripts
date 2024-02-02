require('dotenv').config();
const { program } = require('commander');
const fs = require('fs');
const path = require('path');

const openai = require('openai');
const { createClient } = require('pexels');

const pexelsApiKey = process.env.pexelsApiKey;
const openaiApiKey = process.env.openaiApiKey;
const sketchApiKey = process.env.sketchApiKey;

program
  .name('gen')
  .description('Use AI to generate and combine video assets programatically')
  .usage("[ai command]")

program
  .helpOption('-l, --list', 'List All Commands');

program.action(() => {
  program.help();
});

// Each video project will have to create a new local directory for saving associated assets 
// Easiest Difficulty
program.command("script", "Returns a Script on Given Topic and saves to .txt");
program.command("captions", "Create captions from topic script and saves to .txt");
program.command("speech", "Turn topic script .txt file into speech .mp3");
program.command("stock", "Retrieves a collection of related stock footage and saves");
program.command("models", "Retrieves a collection of related 3d models from sketchfab");

const projectDirectory = `./public/`

// Some assets will be generated using remotion
// program.command("threeAnimation", "Will use the related 3D Models to generate 3D Animation Clips");


program.parse(process.argv);