const fs = require('fs');
const path = require('path');

// WCAG AA contrast ratio requirements
const WCAG_AA_NORMAL = 4.5;
const WCAG_AA_LARGE = 3.0;

// Convert hex to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Calculate relative luminance
function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Calculate contrast ratio
function getContrastRatio(color1, color2) {
  const lum1 = getLuminance(color1.r, color1.g, color1.b);
  const lum2 = getLuminance(color2.r, color2.g, color2.b);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

// Common color combinations to check
const colorTests = [
  // Text on backgrounds
  { fg: '#EC4899', bg: '#FFFFFF', desc: 'Pink text on white' },
  { fg: '#3B82F6', bg: '#FFFFFF', desc: 'Blue text on white' },
  { fg: '#FFFFFF', bg: '#EC4899', desc: 'White text on pink' },
  { fg: '#FFFFFF', bg: '#3B82F6', desc: 'White text on blue' },
  { fg: '#1F2937', bg: '#FFFFFF', desc: 'Dark gray text on white' },
  { fg: '#6B7280', bg: '#FFFFFF', desc: 'Gray text on white' },
  { fg: '#FFFFFF', bg: '#1F2937', desc: 'White text on dark gray' },
  { fg: '#EC4899', bg: '#FDF2F8', desc: 'Pink text on pink background' },
  { fg: '#3B82F6', bg: '#EFF6FF', desc: 'Blue text on blue background' },
  { fg: '#059669', bg: '#ECFDF5', desc: 'Green text on green background' },
  { fg: '#DC2626', bg: '#FEF2F2', desc: 'Red text on red background' },
  // Gradient combinations
  { fg: '#FFFFFF', bg: '#EC4899', desc: 'White on pink gradient start' },
  { fg: '#FFFFFF', bg: '#3B82F6', desc: 'White on blue gradient end' },
];

console.log('🎨 COLOR CONTRAST ANALYSIS\n');
console.log('=' .repeat(60));

let issues = [];

colorTests.forEach(test => {
  const fgColor = hexToRgb(test.fg);
  const bgColor = hexToRgb(test.bg);
  
  if (fgColor && bgColor) {
    const ratio = getContrastRatio(fgColor, bgColor);
    const passAA = ratio >= WCAG_AA_NORMAL;
    const passAALarge = ratio >= WCAG_AA_LARGE;
    
    const status = passAA ? '✅ PASS' : passAALarge ? '⚠️  LARGE ONLY' : '❌ FAIL';
    
    console.log(`${status} ${test.desc}`);
    console.log(`   Ratio: ${ratio.toFixed(2)}:1 (Need: ${WCAG_AA_NORMAL}:1)`);
    
    if (!passAA) {
      issues.push({
        description: test.desc,
        ratio: ratio.toFixed(2),
        severity: passAALarge ? 'medium' : 'high'
      });
    }
    console.log('');
  }
});

// Scan actual component files for potential issues
console.log('\n🔍 SCANNING COMPONENT FILES\n');
console.log('=' .repeat(60));

const srcDir = path.join(__dirname, '../src');
const componentFiles = [];

function scanDirectory(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      scanDirectory(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      componentFiles.push(filePath);
    }
  });
}

scanDirectory(srcDir);

const problematicPatterns = [
  { pattern: /text-gray-400/g, issue: 'Light gray text may have low contrast' },
  { pattern: /text-gray-500/g, issue: 'Medium gray text may have contrast issues' },
  { pattern: /text-pink-300/g, issue: 'Light pink text may be hard to read' },
  { pattern: /text-blue-300/g, issue: 'Light blue text may be hard to read' },
  { pattern: /bg-pink-50.*text-pink-600/g, issue: 'Pink text on light pink background' },
  { pattern: /bg-blue-50.*text-blue-600/g, issue: 'Blue text on light blue background' },
];

let fileIssues = [];

componentFiles.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(srcDir, filePath);
  
  problematicPatterns.forEach(({ pattern, issue }) => {
    const matches = content.match(pattern);
    if (matches) {
      fileIssues.push({
        file: relativePath,
        issue: issue,
        count: matches.length
      });
    }
  });
});

if (fileIssues.length > 0) {
  console.log('Found potential contrast issues in files:');
  fileIssues.forEach(issue => {
    console.log(`⚠️  ${issue.file}: ${issue.issue} (${issue.count} occurrences)`);
  });
} else {
  console.log('✅ No obvious contrast issues found in component files');
}

// Summary
console.log('\n📊 SUMMARY\n');
console.log('=' .repeat(60));

if (issues.length === 0) {
  console.log('✅ All tested color combinations pass WCAG AA standards!');
} else {
  console.log(`❌ Found ${issues.length} contrast issues:`);
  issues.forEach(issue => {
    const severity = issue.severity === 'high' ? '🔴 HIGH' : '🟡 MEDIUM';
    console.log(`   ${severity}: ${issue.description} (${issue.ratio}:1)`);
  });
}

console.log(`\n📁 Scanned ${componentFiles.length} component files`);
console.log(`⚠️  Found ${fileIssues.length} potential issues in code`);

// Recommendations
console.log('\n💡 RECOMMENDATIONS\n');
console.log('=' .repeat(60));
console.log('1. Use text-gray-900 or text-gray-800 for main text');
console.log('2. Use text-gray-700 for secondary text');
console.log('3. Avoid text-gray-400 and text-gray-500 on white backgrounds');
console.log('4. Test color combinations with actual content');
console.log('5. Use browser dev tools to check contrast ratios');
console.log('6. Consider users with visual impairments');