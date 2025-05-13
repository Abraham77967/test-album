// Thumbnail Generator Script
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuration
const sourceDir = 'photos';
const targetDir = 'thumbnails';
const thumbnailWidth = 200; // Width in pixels for thumbnails
const quality = 70; // WEBP compression quality (0-100)

// Ensure thumbnails directory exists
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir);
  console.log(`Created ${targetDir} directory`);
}

// Get list of all photos
const photoFiles = fs.readdirSync(sourceDir)
  .filter(file => 
    file.toLowerCase().endsWith('.webp') ||
    file.toLowerCase().endsWith('.jpg') ||
    file.toLowerCase().endsWith('.jpeg') ||
    file.toLowerCase().endsWith('.png')
  );

// Process each photo
async function processImages() {
  console.log(`Found ${photoFiles.length} images to process`);
  
  for (const file of photoFiles) {
    try {
      const sourcePath = path.join(sourceDir, file);
      const targetPath = path.join(targetDir, file);
      
      // Skip existing thumbnails unless source is newer
      if (fs.existsSync(targetPath)) {
        const sourceStats = fs.statSync(sourcePath);
        const targetStats = fs.statSync(targetPath);
        
        if (sourceStats.mtime <= targetStats.mtime) {
          console.log(`Skipping ${file} (already exists and up to date)`);
          continue;
        }
      }
      
      // Process the image with sharp
      await sharp(sourcePath)
        .resize(thumbnailWidth)
        .webp({ quality })
        .toFile(targetPath);
      
      console.log(`Processed: ${file}`);
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  }
  
  console.log('Thumbnail generation complete!');
}

processImages().catch(err => {
  console.error('Error generating thumbnails:', err);
}); 