// 支持的图片格式
const supportedImageFormats = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];

// 动态获取图片文件列表
async function getImageFiles() {
  try {
    // 首先尝试从配置文件加载图片列表
    const response = await fetch('images.json');
    if (response.ok) {
      const data = await response.json();
      console.log('从配置文件加载图片列表');
      return data.images || [];
    }
  } catch (error) {
    console.log('无法加载配置文件，尝试其他方法');
  }
  
  try {
    // 尝试通过目录浏览获取文件列表
    const response = await fetch('images/');
    if (response.ok) {
      const html = await response.text();
      // 解析HTML获取文件列表（如果服务器支持目录浏览）
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const links = doc.querySelectorAll('a[href]');
      const imageFiles = [];
      
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && isImageFile(href)) {
          imageFiles.push({
            src: `images/${href}`,
            title: getImageTitle(href),
            alt: getImageAlt(href)
          });
        }
      });
      
      if (imageFiles.length > 0) {
        console.log('通过目录浏览获取图片列表');
        return imageFiles;
      }
    }
  } catch (error) {
    console.log('无法通过目录浏览获取图片列表');
  }
  
  // 如果以上方法都失败，返回预定义的图片列表
  console.log('使用预定义图片列表');
  return getPredefinedImages();
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

// 预定义的图片列表（作为备用）
function getPredefinedImages() {
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
      "title": "截图 2025-09-13 copy",
      "alt": "屏幕截图副本"
    },
    {
      "src": "images/68747470733a2f2f73322e6c6f6c692e6e65742f323032352f30382f30322f456a495a3158364d534871556c54442e706e67.png",
      "title": "截图 2025-09-13 copy",
      "alt": "屏幕截图副本"
    }
  ];
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

// 加载并显示图片
async function loadImages() {
  const gallery = document.getElementById('image-gallery');
  
  // 显示加载状态
  gallery.innerHTML = '<p style="text-align: center; color: #666; font-size: 18px;">正在加载图片...</p>';
  
  try {
    const imageData = await getImageFiles();
    
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
