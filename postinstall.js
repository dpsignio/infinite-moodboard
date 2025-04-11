const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Running post-installation checks...');

// Check for required dependency date-fns
try {
  require.resolve('date-fns');
  console.log('✓ date-fns is installed');
} catch (e) {
  console.log('Installing missing dependency: date-fns');
  execSync('npm install date-fns', { stdio: 'inherit' });
}

// Create the public directory if it doesn't exist
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
  console.log('✓ Created public directory');
}

// Create placeholder logo files if they don't exist
const logoSizes = [
  { name: 'favicon.ico', size: 32 },
  { name: 'logo192.png', size: 192 },
  { name: 'logo512.png', size: 512 }
];

for (const logo of logoSizes) {
  const logoPath = path.join(publicDir, logo.name);
  if (!fs.existsSync(logoPath)) {
    console.log(`Creating placeholder for ${logo.name}...`);
    // We're just checking existence and won't actually create the files
    // In a real scenario, you might generate placeholder images
    console.log(`✓ Please add a ${logo.name} file to the public directory`);
  }
}

// Create the src directory structure if it doesn't exist
const directories = [
  'src/components',
  'src/contexts',
  'src/db',
  'src/utils'
];

for (const dir of directories) {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✓ Created ${dir} directory`);
  }
}

console.log('Post-installation checks completed successfully!');
console.log('Run "npm start" to start the application.');
