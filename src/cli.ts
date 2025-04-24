#!/usr/bin/env node

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import {format_subtitle, subArr2Srt, subArr2Md} from './index'

const program = new Command();

program
  .name('format-subtitle')
  .description('Convert JSON subtitle to SRT or MD format')
  .version('0.1.0')
  .argument('<input>', 'input JSON file path')
  .argument('[output]', 'output file path (optional)')
  .option('-m, --md', 'output both SRT and MD formats')
  .option('-c, --chapters <chapters>', 'chapters JSON file path')
  .action((input, output, options) => {
    try {
      const jsonContent = fs.readFileSync(input, 'utf-8');
      const subtitleData = JSON.parse(jsonContent);
      
      // Get the base output path without extension
      const baseOutputPath = output 
        ? path.join(path.dirname(output), path.basename(output, path.extname(output)))
        : path.join(path.dirname(input), path.basename(input, path.extname(input)));
      
      // Always generate SRT file
      const srtContent = subArr2Srt(format_subtitle(subtitleData));
      const srtPath = `${baseOutputPath}.srt`;
      fs.writeFileSync(srtPath, srtContent, 'utf-8');
      console.log(`Successfully converted ${input} to ${srtPath}`);
      
      // If -m flag is used, also generate MD file
      if (options.md) {
        let chaptersData = null;
        let chaptersPath = options.chapters;
        
        if (!chaptersPath) {
          // Try to load default chapters file
          const defaultChaptersPath = path.join(
            path.dirname(input),
            `${path.basename(input, path.extname(input))}_chapters.json`
          );
          if (fs.existsSync(defaultChaptersPath)) {
            chaptersPath = defaultChaptersPath;
          }
        }
        
        if (chaptersPath) {
          const chaptersContent = fs.readFileSync(chaptersPath, 'utf-8');
          chaptersData = JSON.parse(chaptersContent);
        }
        
        const mdContent = subArr2Md(subtitleData, chaptersData);
        const mdPath = `${baseOutputPath}.md`;
        fs.writeFileSync(mdPath, mdContent, 'utf-8');
        console.log(`Successfully converted ${input} to ${mdPath}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error:', error.message);
      } else {
        console.error('An unknown error occurred');
      }
      process.exit(1);
    }
  });

program.parse(); 