#!/usr/bin/env node

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { subArr2Srt } from './subArr2Srt';
import {format_subtitle} from './index'

const program = new Command();

program
  .name('format-subtitle')
  .description('Convert JSON subtitle to SRT format')
  .version('0.1.0')
  .argument('<input>', 'input JSON file path')
  .argument('[output]', 'output SRT file path (optional)')
  .action((input, output) => {
    try {
      const jsonContent = fs.readFileSync(input, 'utf-8');
      const subtitleData = JSON.parse(jsonContent);
      const srtContent = subArr2Srt(format_subtitle(subtitleData));
      
      // If output is not provided, use the same directory and name as input but with .srt extension
      const outputPath = output || path.join(
        path.dirname(input),
        path.basename(input, path.extname(input)) + '.srt'
      );
      
      fs.writeFileSync(outputPath, srtContent, 'utf-8');
      console.log(`Successfully converted ${input} to ${outputPath}`);
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