import { useCallback, useEffect, useRef, useState } from 'react';
import type ReactPlayer from 'react-player';
import { useToasts } from '@/hooks/use-toasts';

// 不是所有浏览器都支持 captureStream
type IHTMLVideoElement = HTMLVideoElement & { captureStream(): MediaStream };

export const useRecorder = (reactPlayer: ReactPlayer | null, deviceSerial: string) => {
  const { setToast } = useToasts();

  const [recording, setRecording] = useState(false);
  const recordChunksRef = useRef<Blob[]>([]);
  const recorderRef = useRef<MediaRecorder>();

  const download = (name: string, url: string) => {
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', name);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  useEffect(() => {
    if (reactPlayer && !recorderRef.current && reactPlayer.getInternalPlayer()) {
      const videoInstance = reactPlayer.getInternalPlayer() as IHTMLVideoElement;
      const stream = videoInstance.captureStream();
      recorderRef.current = new MediaRecorder(stream);
    }

    if (recorderRef.current) {
      recorderRef.current.onstop = () => {
        const blob = new Blob(recordChunksRef.current);
        const url = URL.createObjectURL(blob);
        download(`${deviceSerial}.mp4`, url);

        URL.revokeObjectURL(url);
        recordChunksRef.current = [];
        recorderRef.current = undefined;
      };

      recorderRef.current.onerror = () => {
        setToast({
          text: '录像不可用，请联系管理员',
          type: 'error',
          delay: 4000
        });

        recordChunksRef.current = [];
        recorderRef.current = undefined;
      };
    }
  }, [deviceSerial, reactPlayer, recorderRef, setToast]);

  const handleRecord = useCallback(async () => {
    if (!reactPlayer || !recorderRef.current) {
      setToast({
        type: 'error',
        text: '录像不可用，请联系管理员',
        delay: 4000
      });

      return;
    }

    const videoInstance = reactPlayer.getInternalPlayer() as IHTMLVideoElement;

    if (recording) {
      setRecording(false);

      videoInstance.captureStream().getTracks().forEach(track => track.stop());
      recorderRef.current.stop();
      videoInstance.pause();

      setToast({
        text: '录制完成，请点击下载按钮',
        type: 'success',
        delay: 3000
      });
      return;
    }

    try {
      if (!videoInstance.paused) {
        setToast({
          type: 'error',
          text: '请先暂停视频',
          delay: 3000
        });
        return;
      }

      setRecording(true);
      setToast({
        text: '开始录制',
        type: 'success',
        delay: 3000
      });

      recorderRef.current.ondataavailable = (e) => {
        recordChunksRef.current.push(e.data);
      };

      await videoInstance.play();
      recorderRef.current.start();
    } catch (e) {
      setRecording(false);
      setToast({
        type: 'error',
        text: '录制失败 请联系管理员',
        delay: 3000
      });
    }
  }, [reactPlayer, recording, setToast, recorderRef]);

  return {
    recording,
    handleRecord
  };
};
