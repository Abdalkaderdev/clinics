import { ImageResponse } from '@squoosh/lib';
import { cpus } from 'os';
import fs from 'fs/promises';
import path from 'path';

const inputDir = 'public/images';
const outputDir = 'public/images/optimized';

async function optimizeImage(inputPath, outputPath, format, quality = 80) {
  try {
    const imageData = await fs.readFile(inputPath);
    const image = new ImageResponse(imageData);
    
    if (format === 'webp') {
      await image.encode({
        webp: {
          quality,
          target_size: 0,
          target_PSNR: 0,
          method: 4,
          sns_strength: 50,
          filter_strength: 60,
          filter_sharpness: 0,
          filter_type: 1,
          partitions: 0,
          segments: 4,
          pass: 1,
          show_compressed: 0,
          preprocessing: 0,
          autofilter: 0,
          partition_limit: 0,
          alpha_compression: 1,
          alpha_filtering: 1,
          alpha_quality: 100,
          lossless: 0,
          exact: 0,
          image_hint: 0,
          emulate_jpeg_size: 0,
          thread_level: 0,
          low_memory: 0,
          near_lossless: 100,
          use_delta_palette: 0,
          use_sharp_yuv: 0,
        },
      });
    } else if (format === 'avif') {
      await image.encode({
        avif: {
          cqLevel: Math.round((100 - quality) * 63 / 100),
          cqAlphaLevel: -1,
          denoiseLevel: 0,
          tileColsLog2: 0,
          tileRowsLog2: 0,
          speed: 6,
          subsample: 1,
          chromaDeltaQ: false,
          sharpness: 0,
          tune: 0,
        },
      });
    }
    
    const encodedImage = await image.encodedWith[format];
    await fs.writeFile(outputPath, encodedImage.binary);
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