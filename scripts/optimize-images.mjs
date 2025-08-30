import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const inputDir = 'public/images';
const outputDir = 'public/images/optimized';

async function optimizeImage(inputPath, outputPath, format, quality = 80) {
  try {
    if (format === 'webp') {
      await sharp(inputPath)
        .webp({ quality })
        .toFile(outputPath);
    } else if (format === 'avif') {
      await sharp(inputPath)
        .avif({ quality })
        .toFile(outputPath);
    }
    
    console.log(`✅ Optimized: ${path.basename(inputPath)} -> ${path.basename(outputPath)}`);
  } catch (error) {
    console.error(`❌ Error optimizing ${inputPath}:`, error.message);
  }
}

async function main() {
  try {
    // Create output directory
    await fs.mkdir(outputDir, { recursive: true });
    
    // Get all image files
    const files = await fs.readdir(inputDir);
    const imageFiles = files.filter(file => 
      /\.(png|jpg|jpeg|gif|bmp)$/i.test(file)
    );
    
    if (imageFiles.length === 0) {
      console.log('No image files found to optimize');
      return;
    }
    
    console.log(`Found ${imageFiles.length} images to optimize...`);
    
    // Process images in parallel
    const promises = [];
    for (const file of imageFiles) {
      const inputPath = path.join(inputDir, file);
      const baseName = path.parse(file).name;
      
      // Create WebP version
      const webpPath = path.join(outputDir, `${baseName}.webp`);
      promises.push(optimizeImage(inputPath, webpPath, 'webp', 85));
      
      // Create AVIF version
      const avifPath = path.join(outputDir, `${baseName}.avif`);
      promises.push(optimizeImage(inputPath, avifPath, 'avif', 80));
    }
    
    await Promise.all(promises);
    console.log('🎉 Image optimization complete!');
    
  } catch (error) {
    console.error('❌ Error during optimization:', error);
  }
}

main();