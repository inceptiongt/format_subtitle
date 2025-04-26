import { format_subtitle, subArr2Md, subArr2Srt } from '../src';
import fs from 'fs'

const SubJson = JSON.parse(fs.readFileSync('./examples/World War I - Summary on a Map - Geo History.json', 'utf8'))
const ChapterJson = JSON.parse(fs.readFileSync('./examples/World War I - Summary on a Map - Geo History_chapters.json', 'utf8'))
const SubJsonEnglish = JSON.parse(fs.readFileSync('./examples/World War I - Summary on a Map - Geo History_english.json', 'utf8'))

describe('blah', () => {
  it('works', () => {
    const result = format_subtitle(SubJson);
    const srtContent = subArr2Srt(result);
    fs.writeFileSync('./output1_test.srt', srtContent);
    const txtContent = subArr2Md(SubJson,ChapterJson, SubJsonEnglish);
    fs.writeFileSync('./output1_test.md', txtContent);
  });
});
