import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaCapture, MediaFile, CaptureVideoOptions } from '@awesome-cordova-plugins/media-capture/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';

@Component({
  selector: 'app-video',
  standalone: true,
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css'],
  imports: [CommonModule],
})
export class VideoComponent {
  videoPath: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private mediaCapture: MediaCapture,
    private androidPermissions: AndroidPermissions
  ) { }

  async ensurePermissions(): Promise<boolean> {
    const permissions = [
      this.androidPermissions.PERMISSION.CAMERA,
      this.androidPermissions.PERMISSION.RECORD_AUDIO,
      this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
      this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE
    ];

    try {
      for (const permission of permissions) {
        const check = await this.androidPermissions.checkPermission(permission);
        console.log(`🔍 Estado permiso ${permission}:`, check.hasPermission);

        if (!check.hasPermission) {
          const result = await this.androidPermissions.requestPermission(permission);
          console.log(`📝 Resultado solicitud ${permission}:`, result.hasPermission);

          if (!result.hasPermission) {
            this.errorMessage = `⛔ Permiso denegado: ${permission}`;
            return false;
          }
        }
      }

      console.log('✅ Todos los permisos fueron otorgados');
      this.errorMessage = null;
      return true;

    } catch (err) {
      console.error('🛑 Error al verificar permisos:', err);
      this.errorMessage = 'Ocurrió un error al verificar los permisos.';
      return false;
    }
  }

  async startVideoCapture(): Promise<void> {
    this.errorMessage = null;

    const granted = await this.ensurePermissions();
    if (!granted) {
      this.errorMessage = 'Debes otorgar permisos de cámara, micrófono y almacenamiento.';
      return;
    }

    const options: CaptureVideoOptions = {
      limit: 1,
      duration: 60
    };

    try {
      const result = await this.mediaCapture.captureVideo(options);
      if (Array.isArray(result) && result.length > 0) {
        this.videoPath = result[0].fullPath;
        console.log('📹 Ruta del video:', this.videoPath);
      } else {
        this.errorMessage = 'No se recibió ningún video.';
      }
    } catch (err: any) {
      console.error('🎥 Error al capturar video:', err);
      this.errorMessage = 'No se pudo grabar el video. Código: ' + (err.code ?? 'desconocido');
    }
  }
}
