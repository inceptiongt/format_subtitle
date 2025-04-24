#!/usr/bin/env node

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import {format_subtitle, subArr2Srt, subArr2Txt} from './index'

const program = new Command();

program
  .name('format-subtitle')
  .description('Convert JSON subtitle to SRT or TXT format')
  .version('0.1.0')
  .argument('<input>', 'input JSON file path')
  .argument('[output]', 'output file path (optional)')
  .option('-t, --txt', 'output both SRT and TXT formats')
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
      
      // If -t flag is used, also generate TXT file
      if (options.txt) {
        const txtContent = subArr2Txt(subtitleData);
        const txtPath = `${baseOutputPath}.txt`;
        fs.writeFileSync(txtPath, txtContent, 'utf-8');
        console.log(`Successfully converted ${input} to ${txtPath}`);
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