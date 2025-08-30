import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const inputDir = 'public/images';
const outputDir = 'public/images';

async function convertToWebP(inputPath, outputPath, quality = 85) {
  try {
    await sharp(inputPath)
      .webp({ quality })
      .toFile(outputPath);
    
    console.log(`✅ Converted: ${path.basename(inputPath)} -> ${path.basename(outputPath)}`);
  } catch (error) {
    console.error(`❌ Error converting ${inputPath}:`, error.message);
  }
}

async function main() {
  try {
    const files = await fs.readdir(inputDir);
    const pngFiles = files.filter(file => /\.png$/i.test(file));
    
    if (pngFiles.length === 0) {
      console.log('No PNG files found to convert');
      return;
    }
    
    console.log(`Found ${pngFiles.length} PNG files to convert...`);
    
    for (const file of pngFiles) {
      const inputPath = path.join(inputDir, file);
      const baseName = path.parse(file).name;
      const outputPath = path.join(outputDir, `${baseName}.webp`);
      
      await convertToWebP(inputPath, outputPath);
    }
    
    console.log('🎉 PNG to WebP conversion complete!');
    
  } catch (error) {
    console.error('❌ Error during conversion:', error);
  }
}

main();