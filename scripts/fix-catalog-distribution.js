const fs = require('fs');
const path = require('path');

// Read the current catalog
const catalogPath = path.join(__dirname, '../lib/modules.catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

// Define plan and difficulty distributions
const planDistribution = {
  free: [1, 2, 3, 4, 5], // M01-M05
  creator: [6, 7, 8, 9, 10, 11, 12, 13, 14], // M06-M14
  pro: [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 48], // M15-M46, M48
  enterprise: [47, 49, 50] // M47, M49, M50
};

const difficultyDistribution = {
  1: [1, 2], // M01, M02
  2: [3, 4, 5, 6], // M03, M04, M05, M06
  3: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46], // M07-M46
  4: [47, 48], // M47, M48
  5: [49, 50] // M49, M50
};

// Update modules with proper plan and difficulty distribution
Object.keys(catalog.modules).forEach(moduleId => {
  const moduleNum = parseInt(moduleId.substring(1));
  
  // Set plan based on distribution
  if (planDistribution.free.includes(moduleNum)) {
    catalog.modules[moduleId].minPlan = 'free';
  } else if (planDistribution.creator.includes(moduleNum)) {
    catalog.modules[moduleId].minPlan = 'creator';
  } else if (planDistribution.pro.includes(moduleNum)) {
    catalog.modules[moduleId].minPlan = 'pro';
  } else if (planDistribution.enterprise.includes(moduleNum)) {
    catalog.modules[moduleId].minPlan = 'enterprise';
  }
  
  // Set difficulty based on distribution
  Object.keys(difficultyDistribution).forEach(difficulty => {
    if (difficultyDistribution[difficulty].includes(moduleNum)) {
      catalog.modules[moduleId].difficulty = parseInt(difficulty);
    }
  });
});

// Write updated catalog back to file
fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2));

console.log('Successfully updated catalog with proper plan and difficulty distribution');
console.log('Plan distribution:');
Object.keys(planDistribution).forEach(plan => {
  const count = Object.keys(catalog.modules).filter(id => 
    catalog.modules[id].minPlan === plan
  ).length;
  console.log(`  ${plan}: ${count} modules`);
});

console.log('Difficulty distribution:');
for (let i = 1; i <= 5; i++) {
  const count = Object.keys(catalog.modules).filter(id => 
    catalog.modules[id].difficulty === i
  ).length;
  console.log(`  ${i}: ${count} modules`);
}