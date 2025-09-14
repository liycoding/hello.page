#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 支持的图片格式
const supportedFormats = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];

// 检查文件是否为图片
function isImageFile(filename) {
  const ext = path.extname(filename).toLowerCase();
  return supportedFormats.includes(ext);
}

// 从文件名生成标题
function generateTitle(filename) {
  const nameWithoutExt = path.parse(filename).name;
  return nameWithoutExt.replace(/[_-]/g, ' ');
}

// 从文件名生成alt文本
function generateAlt(filename) {
  return `图片: ${generateTitle(filename)}`;
}

// 扫描images文件夹
function scanImagesFolder() {
  const imagesDir = path.join(__dirname, 'images');
  const images = [];
  
  try {
    const files = fs.readdirSync(imagesDir);
    
    files.forEach(file => {
      if (isImageFile(file)) {
        images.push({
          src: `images/${file}`,
          title: generateTitle(file),
          alt: generateAlt(file)
        });
      }
    });
    
    // 按文件名排序
    images.sort((a, b) => a.src.localeCompare(b.src));
    
  } catch (error) {
    console.error('扫描images文件夹时出错:', error.message);
    return [];
  }
  
  return images;
}

// 更新images.json文件
function updateImagesJson() {
  const images = scanImagesFolder();
  
  const data = {
    images: images,
    lastUpdated: new Date().toISOString()
  };
  
  const jsonPath = path.join(__dirname, 'images.json');
  
  try {
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✅ 成功更新 images.json`);
    console.log(`📸 找到 ${images.length} 张图片:`);
    images.forEach(img => {
      console.log(`   - ${img.src} (${img.title})`);
    });
  } catch (error) {
    console.error('❌ 更新 images.json 时出错:', error.message);
  }
}

// 运行更新
if (require.main === module) {
  console.log('🔄 正在扫描 images 文件夹...');
  updateImagesJson();
}
