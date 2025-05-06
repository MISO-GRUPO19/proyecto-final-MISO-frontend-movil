import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {

  ngOnInit(): void {
  }

  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  stream: MediaStream | null = null;
  recorder!: MediaRecorder;
  chunks: Blob[] = [];
  recording = false;

  startCamera(): void {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      this.stream = stream;
      const video = this.videoPlayer.nativeElement;
      video.srcObject = stream;
      video.play();
    }).catch(err => {
      console.error('Error accediendo a la cámara:', err);
      alert('No se pudo acceder a la cámara.');
    });
  }

  startRecording(): void {
    if (!this.stream) return;

    this.chunks = [];
    this.recorder = new MediaRecorder(this.stream);
    this.recorder.ondataavailable = e => this.chunks.push(e.data);
    this.recorder.onstop = () => this.downloadVideo();
    this.recorder.start();
    this.recording = true;
  }

  stopRecording(): void {
    if (this.recorder && this.recording) {
      this.recorder.stop();
      this.recording = false;
    }
  }

  downloadVideo(): void {
    const blob = new Blob(this.chunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grabacion.webm';
    a.click();
    URL.revokeObjectURL(url);
  }
}