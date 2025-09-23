// Run: npm install lighthouse
// Then: node lighthouse-audit.js
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import fs from 'fs';

const URL = 'https://beautylandcard.vip';

async function runAudit() {
  console.log('🚀 Starting Lighthouse audit for:', URL);
  
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  
  const options = {
    logLevel: 'info',
    output: 'html',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
  };

  try {
    const runnerResult = await lighthouse(URL, options);
    
    // Save HTML report
    const reportHtml = runnerResult.report;
    fs.writeFileSync('lighthouse-report.html', reportHtml);
    console.log('📄 Report saved as lighthouse-report.html');

    // Extract scores
    const { categories } = runnerResult.lhr;
    const scores = {
      performance: Math.round(categories.performance.score * 100),
      accessibility: Math.round(categories.accessibility.score * 100),
      bestPractices: Math.round(categories['best-practices'].score * 100),
      seo: Math.round(categories.seo.score * 100)
    };

    // Display results
    console.log('\n📊 LIGHTHOUSE AUDIT RESULTS');
    console.log('='.repeat(40));
    console.log(`🚀 Performance:    ${getScoreIcon(scores.performance)} ${scores.performance}/100`);
    console.log(`♿ Accessibility:  ${getScoreIcon(scores.accessibility)} ${scores.accessibility}/100`);
    console.log(`✅ Best Practices: ${getScoreIcon(scores.bestPractices)} ${scores.bestPractices}/100`);
    console.log(`🔍 SEO:            ${getScoreIcon(scores.seo)} ${scores.seo}/100`);

    // Check for critical issues
    const audits = runnerResult.lhr.audits;
    const criticalIssues = [];
    
    Object.keys(audits).forEach(key => {
      const audit = audits[key];
      if (audit.score !== null && audit.score < 0.5 && audit.scoreDisplayMode === 'binary') {
        criticalIssues.push(`❌ ${audit.title}: ${audit.description}`);
      }
    });

    if (criticalIssues.length > 0) {
      console.log('\n⚠️  CRITICAL ISSUES:');
      criticalIssues.slice(0, 5).forEach(issue => console.log(issue));
    } else {
      console.log('\n✅ No critical issues found!');
    }

    // Overall grade
    const avgScore = Math.round((scores.performance + scores.accessibility + scores.bestPractices + scores.seo) / 4);
    console.log(`\n🎯 Overall Score: ${getScoreIcon(avgScore)} ${avgScore}/100`);
    console.log(`📈 Site Status: ${avgScore >= 90 ? '🟢 EXCELLENT' : avgScore >= 70 ? '🟡 GOOD' : '🔴 NEEDS IMPROVEMENT'}`);

  } catch (error) {
    console.error('❌ Audit failed:', error.message);
  } finally {
    await chrome.kill();
  }
}

function getScoreIcon(score) {
  if (score >= 90) return '🟢';
  if (score >= 50) return '🟡';
  return '🔴';
}

runAudit().catch(console.error);