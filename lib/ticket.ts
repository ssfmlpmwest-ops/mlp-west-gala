import { toPng } from "html-to-image";
import download from "downloadjs";
import { RefObject } from "react";

export async function downloadCanvas(
  posterRef: RefObject<HTMLDivElement>,
  fileName: string,
  ret:boolean=false
): Promise<string|void> {
  if (!posterRef.current) return;

  // Wait until images have finished decoding
  await Promise.all(
    Array.from(posterRef.current.querySelectorAll('img')).map((img) =>
      img.decode().catch(() => {})
    ),
  );

  const dataUrl = await toPng(posterRef.current, {
    width: 1064,
    height: 1890,
    cacheBust: true,                 // forces a fresh GET so CORS headers are seen
    fetchRequestInit: {              // html‑to‑image passes this to every fetch()
      mode: 'cors',
      credentials: 'omit',
    },
    style: {
      transform: 'scale(1)',
      transformOrigin: 'top left',
      width: '1064px',
      height: '1890px',
    },
  });
  if(ret) return dataUrl;

  download(dataUrl, `${fileName}.png`, 'image/png');
}
