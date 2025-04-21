// 加载 sub.json 文件

/**
 * simple:
 * {
    "tStartMs": 11760,
    "dDurationMs": 6640,
    "segs": [ {
      "utf8": "亚洲曾是古代帝国和传奇统治者的土地\n，但"
    }]
 */
export interface subtitle_item {
  tStartMs: number;
  dDurationMs: number;
  segs: {
    utf8: string;
  }[];
}


/**
 * 根据字幕的文字内容，按照"完整句子"，重新整理字幕内容
 * @example
 * 输入：
 * [ {
    "tStartMs": 11760,
    "dDurationMs": 6640,
    "segs": [ {
      "utf8": "亚洲曾是古代帝国和传奇统治者的土地\n，但"
    } ]
  }, {
    "tStartMs": 18400,
    "dDurationMs": 6960,
    "segs": [ {
      "utf8": "在近代早期沦为不断扩张的欧洲列强的殖民地\n。 受亚洲丝绸和香料贸易的吸引，"
    } ]
  }, {
    "tStartMs": 25360,
    "dDurationMs": 4960,
    "segs": [ {
      "utf8": "他们的殖民努力最初是\n为了利用亚洲大陆的经济"
    } ]
  }, {
    "tStartMs": 30320,
    "dDurationMs": 6160,
    "segs": [ {
      "utf8": "实力。 最终，欧洲国家开始\n使用越来越多的武力，到"
    } ]
  }, {
    "tStartMs": 36480,
    "dDurationMs": 6000,
    "segs": [ {
      "utf8": "20 世纪初，东方世界\n几乎完全掌握在殖民帝国的手中。"
    } ]
  }
  
  输出：
    [ {
    "tStartMs": 11760,
    "dDurationMs": ,
    "segs": [ {
      "utf8": "亚洲曾是古代帝国和传奇统治者的土地\n，但在近代早期沦为不断扩张的欧洲列强的殖民地\n。"
    } ]
  }, {
    "tStartMs": ,
    "dDurationMs": ,
    "segs": [ {
      "utf8": "受亚洲丝绸和香料贸易的吸引，他们的殖民努力最初是\n为了利用亚洲大陆的经济实力。"
    } ]
  }, {
    "tStartMs": ,
    "dDurationMs": ,
    "segs": [ {
      "utf8": " 最终，欧洲国家开始\n使用越来越多的武力，到20 世纪初，东方世界\n几乎完全掌握在殖民帝国的手中。"
    } ]
  }
  ]

  转换的逻辑是：
  segs 里是完整的句子，根据字符中的句号、问号等判断
  tStartMs、dDurationMs需要根据 segs 的内容长度重新计算
 *  
 * 
 */
export const format_subtitle = (subtitle: subtitle_item[]): subtitle_item[] => {
  // If input is empty, return empty array
  if (subtitle.length === 0) return [];

  // Helper function to clean text (remove newlines and excess whitespace)
  const cleanText = (text: string): string => {
    return text
      .replace(/\n/g, '')  // Remove newlines
      .replace(/\s+/g, '') // Remove all whitespace
      .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width spaces
      .trim();
  };

  // Create an array of all characters with their timing information
  type CharInfo = { char: string; startMs: number; durationMs: number };
  const chars: CharInfo[] = [];
  
  // Extract characters with timing information
  for (const item of subtitle) {
    const startMs = Math.round(item.tStartMs);
    const durationMs = Math.round(item.dDurationMs);
    
    let totalChars = 0;
    for (const seg of item.segs) {
      const cleanedText = cleanText(seg.utf8);
      totalChars += cleanedText.length;
    }
    
    // If no characters, skip
    if (totalChars === 0) continue;
    
    // Calculate per-character duration and ensure it's an integer
    const charDuration = Math.round(durationMs / totalChars);
    
    for (const seg of item.segs) {
      const cleanedText = cleanText(seg.utf8);
      for (let i = 0; i < cleanedText.length; i++) {
        chars.push({
          char: cleanedText[i],
          startMs: Math.round(startMs + (i * charDuration)),
          durationMs: charDuration
        });
      }
    }
  }
  
  // Build the text from all characters
  const allText = chars.map(c => c.char).join('');
  
  // Split by sentence endings (。.?!？！) and handle Chinese punctuation
  // Modified regex to better handle sentence boundaries
  const sentenceRegex = /([^。？！，；]+[。？！，；])/g;
  const sentences = allText.match(sentenceRegex) || [];
  
  // Group sentences into complete subtitle items
  const result: subtitle_item[] = [];
  let currentText = '';
  let charIndex = 0;
  
  for (const sentence of sentences) {
    // Clean the sentence of any whitespace and remove punctuation at the end
    const cleanSentence = sentence.trim().replace(/[。？！，；]$/, '');
    
    // Skip empty sentences
    if (!cleanSentence) continue;
    
    // Check if adding this sentence would make the subtitle too long
    // For Chinese text, we use a smaller limit of 10 characters
    if (currentText && (currentText.length > 10)) {
      // Save current subtitle with proper timing
      const sentenceChars = chars.slice(charIndex - currentText.length, charIndex);
      const startMs = Math.round(sentenceChars[0].startMs);
      const endMs = Math.round(sentenceChars[sentenceChars.length - 1].startMs + 
                   sentenceChars[sentenceChars.length - 1].durationMs);
      
      result.push({
        tStartMs: startMs,
        dDurationMs: Math.round(endMs - startMs),
        segs: [{ utf8: currentText }]
      });
      
      // Start new subtitle
      currentText = cleanSentence;
      charIndex += cleanSentence.length;
    } else {
      currentText += cleanSentence;
      charIndex += cleanSentence.length;
    }
  }
  
  // Add the last subtitle if it has content
  if (currentText) {
    const sentenceChars = chars.slice(charIndex - currentText.length, charIndex);
    const startMs = Math.round(sentenceChars[0].startMs);
    const endMs = Math.round(sentenceChars[sentenceChars.length - 1].startMs + 
                 sentenceChars[sentenceChars.length - 1].durationMs);
    
    result.push({
      tStartMs: startMs,
      dDurationMs: Math.round(endMs - startMs),
      segs: [{ utf8: currentText }]
    });
  }
  
  return result;
}

// const result = format_subtitle(sub1);
// const srtContent = subArr2Srt(result);
// fs.writeFileSync('./output1.srt', srtContent);