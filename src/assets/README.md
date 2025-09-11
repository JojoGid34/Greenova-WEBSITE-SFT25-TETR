# Assets Folder

This folder contains all the media assets for the GREENOVA AI Dashboard web application.

## Structure

```
assets/
├── images/
│   ├── logo/
│   │   ├── greenova-logo.svg
│   │   ├── greenova-logo-dark.svg
│   │   └── favicon.ico
│   ├── heroes/
│   │   ├── hero-bg.jpg
│   │   └── robot-hero.jpg
│   ├── team/
│   │   ├── team-member-1.jpg
│   │   ├── team-member-2.jpg
│   │   └── ...
│   └── icons/
│       ├── air-quality.svg
│       ├── robot.svg
│       └── ...
├── videos/
│   └── demo-robot.mp4
└── documents/
    ├── user-manual.pdf
    └── technical-specs.pdf
```

## Usage

- All images should be optimized for web (WebP format when possible)
- SVG icons should be clean and minimal
- Use consistent naming conventions
- Include both light and dark theme versions where applicable

## Placeholders

Currently, this application uses:
- SVG icons from Lucide React (loaded via CDN)
- Placeholder avatar images
- Stock photos from Unsplash API for demo purposes

To use your own assets:
1. Replace the placeholder images with your actual assets
2. Update the image references in the HTML and CSS files
3. Ensure all paths are correct relative to the web root

## Image Optimization

For best performance:
- Compress images before uploading
- Use appropriate formats (JPEG for photos, PNG for graphics with transparency, SVG for icons)
- Consider using WebP format for better compression
- Include multiple sizes for responsive images where needed