#!/usr/bin/env node

import { Command } from 'commander';
import * as fs from 'fs';
import { subArr2Srt } from './subArr2Srt';

const program = new Command();

program
  .name('format-subtitle')
  .description('CLI tool for subtitle format conversion')
  .version('0.1.0');

program
  .command('subtitle2Srt')
  .description('Convert JSON subtitle to SRT format')
  .argument('<input>', 'input JSON file path')
  .argument('<output>', 'output SRT file path')
  .action((input, output) => {
    try {
      const jsonContent = fs.readFileSync(input, 'utf-8');
      const subtitleData = JSON.parse(jsonContent);
      const srtContent = subArr2Srt(subtitleData);
      fs.writeFileSync(output, srtContent, 'utf-8');
      console.log(`Successfully converted ${input} to ${output}`);
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