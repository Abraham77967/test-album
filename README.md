# Prom Night Memories Gallery

An elegant photo gallery website designed specifically for prom photos. Simply open the index.html file in a browser - no server required!

## How to Use

1. **Add Your Prom Photos**:
   - Place all your prom night photos in the `photos` folder
   - Open `script.js` and update the `photoFiles` array with your photo filenames

   ```javascript
   const photoFiles = [
       'prom-photo1.jpg',
       'prom-photo2.jpg',
       'group-photo.jpg',
       // Add all your prom photos here
   ];
   ```

2. **Set Up Download Link**:
   - Upload all prom photos to Google Drive in a shared folder
   - Make sure to set the folder's sharing to "Anyone with the link can view"
   - Get the folder ID from the sharing link (it's the part after `/folders/` in the URL)
   - Open `index.html` and replace `YOUR_FOLDER_ID` in the download button link:

   ```html
   <a href="https://drive.google.com/drive/folders/YOUR_FOLDER_ID" target="_blank" class="download-btn">
   ```

3. **View the Gallery**:
   - Simply double-click on the `index.html` file to open it in your default web browser
   - No server setup needed!
   - Share the folder containing these files with friends to let them view the gallery on their computers

## Features

- Elegant design with gold and dark theme perfect for prom photos
- Simple photo navigation with arrow buttons
- Thumbnail gallery for quick access to specific photos
- Keyboard navigation (left/right arrow keys)
- Mobile-responsive design looks great on all devices
- Direct download link to all photos via Google Drive

## Customization

You can easily customize the gallery:

- Change the title in `index.html` to your specific prom event (e.g., "Lincoln High Prom 2023")
- Modify colors in `styles.css` to match your prom theme
- Adjust the subtitle text in `index.html` to personalize your gallery

# Photos Website

A responsive photo gallery website with optimized thumbnail loading for improved performance.

## Thumbnail Optimization

This website now includes a thumbnail optimization system that creates and uses compressed thumbnail images for faster loading and smoother browsing experience.

### How it works

1. Original photos are stored in the `photos/` directory
2. Compressed thumbnails are generated and stored in the `thumbnails/` directory
3. The website loads the smaller thumbnail images in the gallery view
4. Full-sized images are only loaded when viewing a photo at full size

### Setup Instructions

1. Install Node.js if you don't have it already
2. Install dependencies:
   ```
   npm install
   ```
3. Generate thumbnails:
   ```
   npm run generate-thumbnails
   ```

This will create optimized thumbnail versions of all your photos in the `thumbnails/` directory.

### Thumbnail Configuration

You can adjust the thumbnail settings in `generate-thumbnails.js`:

- `thumbnailWidth`: Width in pixels for thumbnails (default: 200)
- `quality`: WEBP compression quality (0-100, default: 70)

### When to Regenerate Thumbnails

Regenerate thumbnails whenever you:
- Add new photos to the `photos/` directory
- Update existing photos
- Want to change thumbnail size or quality settings

The script will only process new or updated photos, skipping thumbnails that are already up to date.

## Performance Tips

For best performance:
- Keep thumbnail sizes small (200px is recommended)
- Use WEBP format for all images
- Optimize original photos before adding them to the site

## Access Control System

This website now includes an access control system that requires users to enter a valid access code to view the photos.

### How it works

1. Users visit the login page (login.html) when they first access the site
2. They enter an access code to gain access to the photos
3. Valid codes are stored in the user's browser, allowing them to return without re-entering the code
4. Sessions expire after 30 days for security

### Setting Up Access Codes

Configure the access codes in two places:

1. In `login.js`:
   ```javascript
   const accessCodes = {
       'PROM2025': { name: 'Prom 2025' }, 
       'RUINA': { name: 'Ruina' },
       'JESSE': { name: 'Jesse' },
       // Add more codes as needed
   };
   ```

2. In `access-control.js` (keep in sync with login.js):
   ```javascript
   const accessCodes = {
       'PROM2025': { name: 'Prom 2025' }, 
       'RUINA': { name: 'Ruina' },
       'JESSE': { name: 'Jesse' },
       // Add more codes as needed
   };
   ```

### Default Homepage

To make the login page your default homepage:
1. Rename `login.html` to `index.html`
2. Rename the current `index.html` to `gallery.html`
3. Update all references in the scripts (login.js and access-control.js) to point to `gallery.html` instead of `index.html`

### Security Notes

This is a client-side access control system meant for simple privacy, not high security. It prevents casual visitors from accessing the photos, but is not designed to resist determined attackers.

## License

All rights reserved. 