# Infinite Moodboard

A local web application for creating infinite moodboards with media organization capabilities. Create unlimited moodboards with an infinite canvas, organize them into sections, and add various types of media (images, text notes, links).

## Features

1. **Dashboard with Moodboard Thumbnails**
   - View all your moodboards in a grid layout
   - Create new moodboards with custom names
   - Auto-generated thumbnails from your moodboard content

2. **Infinite Canvas**
   - Zoomable, pannable canvas for unlimited creativity
   - Organize content spatially without constraints
   - Drag and drop sections to arrange them

3. **Customizable Sections**
   - Create titled sections to organize your content
   - Add, edit, or delete sections as needed
   - Each section works as a container for related media

4. **Media Support**
   - Images: Upload from your local device
   - Text notes: Create and edit text notes
   - Links: Save links to websites or YouTube videos
   - Pinterest integration (coming soon)

5. **Local Storage**
   - All data is stored locally in your browser using IndexedDB
   - No account required, works offline

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Clone and Install
```bash
# Clone the repository
git clone https://github.com/dpsignio/infinite-moodboard.git
cd infinite-moodboard

# Install dependencies
npm install
# or
yarn install
```

### Running the Application
```bash
# Start the development server
npm start
# or
yarn start
```

This will start the application on http://localhost:3000.

## Usage Guide

### Creating a Moodboard
1. From the dashboard, click "New Moodboard"
2. Enter a name for your moodboard
3. Click "Create"

### Adding Sections
1. In the moodboard editor, click "Add Section"
2. Enter a title for your section
3. Click "Create"

### Adding Media to Sections
1. Click on a section to select it
2. Use the toolbar that appears to:
   - Upload images
   - Add text notes
   - Add links

### Navigating the Canvas
- **Pan**: Click and drag the canvas
- **Zoom**: Use mouse wheel or the zoom controls
- **Reset View**: Click the "Reset View" button in the tools panel

### Saving Your Work
- All changes are automatically saved to your browser's local storage
- To create a thumbnail of your moodboard, use the camera button in the tools panel

## Technologies

- React
- TailwindCSS
- React Konva (for infinite canvas)
- Dexie.js (IndexedDB wrapper)
- React Router

## Future Features

- Pinterest API integration for importing pins
- Export/import functionality to share moodboards
- Collaborative editing
- Cloud storage options

## License

MIT License
