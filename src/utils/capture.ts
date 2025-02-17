import html2canvas from "html2canvas";

export async function captureScreenshot(func: () => Promise<void>) {
  try {
    func();
    const element = document.querySelector(".container") as HTMLElement;

    // 保存原始背景色并设置新的背景色
    const originalBackgroundColor = element.style.backgroundColor;
    element.style.backgroundColor = "#E6E6FA"; // 设置为白色背景

    // 使用 html2canvas 创建截图
    html2canvas(element, {
      useCORS: true, // 解决外部图片的跨域问题
      backgroundColor: null, // 保留透明背景
      scale: 2, // 更高质量的输出
    })
      .then((canvas) => {
        const dataUrl = canvas.toDataURL("image/jpeg", 0.95); // 高质量 JPEG
        downloadImage(dataUrl, "screenshot.jpg"); // 保存为 JPEG 格式
      })
      .catch((error) => {
        console.error("截图出错：", error);
      })
      .finally(() => {
        // 恢复原始背景色
        element.style.backgroundColor = originalBackgroundColor;
      });
  } catch (error) {
    console.error("截图出错：", error);
  } finally {
    func();
  }
}

function downloadImage(dataUrl: string, filename: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
