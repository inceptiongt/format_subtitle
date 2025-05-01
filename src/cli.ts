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
  .option('-e, --english <english>', 'English subtitle JSON file path')
  .action((input, output, options) => {
    try {
      // Helper function to get base name without language suffix and extension
      const getBaseFileName = (filePath: string) => {
        const fileName = path.basename(filePath);
        // Remove language suffix and extension (e.g., .zh-Hans-en.json3 or .en.json3)
        return fileName.replace(/\.(zh-Hans-en|en)\.json3$/, '');
      };

      // Helper function to parse json3 subtitle file
      const parseSubtitleFile = (filePath: string) => {
        const content = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(content);
        // Extract events array from json3 format
        return data.events || data;
      };

      const subtitleData = parseSubtitleFile(input);
      
      // Get the base output path without extension
      const baseOutputPath = output 
        ? path.join(path.dirname(output), path.basename(output, path.extname(output)))
        : path.join(path.dirname(input), getBaseFileName(input));
      
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
          // Try to load default chapters file from .info.json
          const defaultChaptersPath = path.join(
            path.dirname(input),
            `${getBaseFileName(input)}.info.json`
          );
          if (fs.existsSync(defaultChaptersPath)) {
            const infoContent = fs.readFileSync(defaultChaptersPath, 'utf-8');
            const infoData = JSON.parse(infoContent);
            if (infoData.chapters) {
              chaptersData = infoData.chapters;
            }
          }
        } else {
          const chaptersContent = fs.readFileSync(chaptersPath, 'utf-8');
          chaptersData = JSON.parse(chaptersContent);
        }

        let englishData = null;
        let englishPath = options.english;
        
        if (!englishPath) {
          // Try to load default English file with .en.json3 extension
          const defaultEnglishPath = path.join(
            path.dirname(input),
            `${getBaseFileName(input)}.en.json3`
          );
          if (fs.existsSync(defaultEnglishPath)) {
            englishPath = defaultEnglishPath;
          }
        }
        
        if (englishPath) {
          englishData = parseSubtitleFile(englishPath);
        }
        
        const mdContent = subArr2Md(subtitleData, chaptersData, englishData);
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