// 支持的图片格式
const supportedImageFormats = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];

// 获取所有图片列表
function getAllImages() {
  return [
    {
      "src": "images/iShot_2025-09-13_16.47.17.png",
      "title": "截图 2025-09-13",
      "alt": "屏幕截图"
    },
    {
      "src": "images/iShot_2025-09-13_16.47.17 copy.png",
      "title": "截图 2025-09-13 copy",
      "alt": "屏幕截图副本"
    },
    {
      "src": "images/68747470733a2f2f6d656469612e77696b692d706f7765722e636f6d2f696d672f6d6f636b7570322e706e67.png",
      "title": "图片 1",
      "alt": "图片 1"
    }
  ];
}


// 检查文件是否为图片
function isImageFile(filename) {
  const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  return supportedImageFormats.includes(ext);
}

// 从文件名生成标题
function getImageTitle(filename) {
  // 移除文件扩展名
  const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.'));
  // 替换下划线和连字符为空格
  return nameWithoutExt.replace(/[_-]/g, ' ');
}

// 从文件名生成alt文本
function getImageAlt(filename) {
  return `图片: ${getImageTitle(filename)}`;
}


// 创建图片元素的函数
function createImageElement(imageInfo) {
  const container = document.createElement('div');
  container.className = 'image-container';
  
  const img = document.createElement('img');
  img.src = imageInfo.src;
  img.alt = imageInfo.alt;
  img.title = imageInfo.title;
  
  // 添加错误处理
  img.onerror = function() {
    console.log(`无法加载图片: ${imageInfo.src}`);
    container.style.display = 'none';
  };
  
  const title = document.createElement('div');
  title.className = 'image-title';
  title.textContent = imageInfo.title;
  
  container.appendChild(img);
  container.appendChild(title);
  
  return container;
}

// 环境检测函数
function isLocalDevelopment() {
  // 检测是否为本地开发环境
  return window.location.protocol === 'file:' || 
         window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1' ||
         window.location.hostname.includes('localhost');
}

// 加载并显示图片
async function loadImages() {
  const gallery = document.getElementById('image-gallery');
  
  // 显示加载状态
  gallery.innerHTML = '<p style="text-align: center; color: #666; font-size: 18px;">正在加载图片...</p>';
  
  try {
    let imageData = [];
    
    // 根据环境选择加载方式
    if (isLocalDevelopment()) {
      // 本地开发：使用内嵌数据
      console.log('本地开发环境：使用内嵌图片数据');
      imageData = getAllImages();
    } else {
      // 线上部署：优先使用 images.json
      console.log('线上环境：尝试从 images.json 加载图片...');
      try {
        const response = await fetch('images.json');
        if (response.ok) {
          const data = await response.json();
          imageData = data.images || [];
          console.log('从 images.json 加载成功，图片数量:', imageData.length);
        } else {
          console.log('images.json 响应失败:', response.status);
        }
      } catch (error) {
        console.log('无法加载 images.json:', error.message);
      }
      
      // 如果 images.json 加载失败，回退到内嵌数据
      if (imageData.length === 0) {
        console.log('回退到内嵌图片数据');
        imageData = getAllImages();
      }
    }
    
    if (imageData.length === 0) {
      gallery.innerHTML = '<p style="text-align: center; color: #666; font-size: 18px;">暂无图片</p>';
      return;
    }
    
    // 清空加载状态
    gallery.innerHTML = '';
    
    // 显示所有图片
    imageData.forEach(imageInfo => {
      const imageElement = createImageElement(imageInfo);
      gallery.appendChild(imageElement);
    });
    
    console.log(`成功加载 ${imageData.length} 张图片`);
  } catch (error) {
    console.error('加载图片时出错:', error);
    gallery.innerHTML = '<p style="text-align: center; color: #ff6b6b; font-size: 18px;">加载图片失败</p>';
  }
}

// 页面加载完成后执行
window.onload = function() {
  // 移除原来的简单文本显示
  // document.getElementById('main-content').innerHTML = 'Hello, github pages :)'
  
  // 加载图片
  loadImages();
}
