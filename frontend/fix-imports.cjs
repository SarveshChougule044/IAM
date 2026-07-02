const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src'));

let fixedCount = 0;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // Match `import React from "react";` or `import React, { ... } from "react";`
  // But wait, if it's `import React, { useState } from 'react';`, we should remove `React, `
  let original = content;
  content = content.replace(/import React from ['"]react['"];?\r?\n?/g, '');
  content = content.replace(/import React,\s*\{/g, 'import {');
  
  if (original !== content) {
    fs.writeFileSync(file, content, 'utf8');
    fixedCount++;
  }
});
console.log(`Fixed ${fixedCount} files`);
