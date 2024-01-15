import { toPng } from "html-to-image";

export async function captureScreenshot(func: () => Promise<void>) {
  try {
    func();
    const element = document.querySelector(".container") as HTMLElement;
    // 保存原始背景色并设置新的背景色
    const originalBackgroundColor = element.style.backgroundColor;
    element.style.backgroundColor = "#E6E6FA"; // 设置为白色背景

    const dataUrl = await toPng(element);

    // 恢复原始背景色
    element.style.backgroundColor = originalBackgroundColor;

    downloadImage(dataUrl, "screenshot.png");
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
