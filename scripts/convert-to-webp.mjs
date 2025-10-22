import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const imagesDir = 'public/images';
const quality = 80;

async function convertToWebP() {
  try {
    const files = fs.readdirSync(imagesDir);
    const jpgFiles = files.filter(file => file.endsWith('.jpg'));
    
    console.log(`Found ${jpgFiles.length} JPG files to convert...`);
    
    for (const file of jpgFiles) {
      const inputPath = path.join(imagesDir, file);
      const outputPath = path.join(imagesDir, file.replace('.jpg', '.webp'));
      
      console.log(`Converting ${file}...`);
      
      await sharp(inputPath)
        .webp({ quality })
        .toFile(outputPath);
        
      console.log(`✓ Created ${file.replace('.jpg', '.webp')}`);
    }
    
    console.log('All images converted successfully!');
  } catch (error) {
    console.error('Error converting images:', error);
  }
}

convertToWebP();