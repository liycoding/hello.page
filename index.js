// 图片数据数组 - 可以在这里添加更多图片
const imageData = [
  {
    src: 'images/iShot_2025-09-13_16.47.17.png',
    title: '截图 2025-09-13',
    alt: '屏幕截图'
  }
  // 可以在这里添加更多图片对象
];

// 创建图片元素的函数
function createImageElement(imageInfo) {
  const container = document.createElement('div');
  container.className = 'image-container';
  
  const img = document.createElement('img');
  img.src = imageInfo.src;
  img.alt = imageInfo.alt;
  img.title = imageInfo.title;
  
  const title = document.createElement('div');
  title.className = 'image-title';
  title.textContent = imageInfo.title;
  
  container.appendChild(img);
  container.appendChild(title);
  
  return container;
}

// 加载并显示图片
function loadImages() {
  const gallery = document.getElementById('image-gallery');
  
  if (imageData.length === 0) {
    gallery.innerHTML = '<p style="text-align: center; color: #666; font-size: 18px;">暂无图片</p>';
    return;
  }
  
  imageData.forEach(imageInfo => {
    const imageElement = createImageElement(imageInfo);
    gallery.appendChild(imageElement);
  });
}

// 页面加载完成后执行
window.onload = function() {
  // 移除原来的简单文本显示
  // document.getElementById('main-content').innerHTML = 'Hello, github pages :)'
  
  // 加载图片
  loadImages();
}
