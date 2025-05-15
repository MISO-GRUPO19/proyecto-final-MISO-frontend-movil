import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaCapture, MediaFile, CaptureVideoOptions } from '@awesome-cordova-plugins/media-capture/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { File as FilePlugin } from '@awesome-cordova-plugins/file/ngx';
import { VisitsManager } from '../services/visits.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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
    private androidPermissions: AndroidPermissions,
    private file: FilePlugin,
    private visitsManager: VisitsManager,
    private router: Router
  ) { }

  async ensurePermissions(): Promise<boolean> {
    const permissions = [
      this.androidPermissions.PERMISSION.CAMERA,
      this.androidPermissions.PERMISSION.RECORD_AUDIO,
      this.androidPermissions.PERMISSION.READ_MEDIA_AUDIO,
      this.androidPermissions.PERMISSION.READ_MEDIA_VIDEO,
      this.androidPermissions.PERMISSION.INTERNET
    ];

    try {
      for (const permission of permissions) {
        const check = await this.androidPermissions.checkPermission(permission);
        console.log(`Estado permiso ${permission}:`, check.hasPermission);

        if (!check.hasPermission) {
          const result = await this.androidPermissions.requestPermission(permission);
          console.log(`Resultado solicitud ${permission}:`, result.hasPermission);

          if (!result.hasPermission) {
            this.errorMessage = `Permiso denegado: ${permission}`;
            return false;
          }
        }
      }

      console.log('Todos los permisos fueron otorgados');
      this.errorMessage = null;
      return true;

    } catch (err: any) {
      console.error('Error al verificar permisos:', err.error);
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
        console.log('Ruta del video:', this.videoPath);
      } else {
        this.errorMessage = 'No se recibió ningún video.';
      }
    } catch (err: any) {
      console.error('Error al capturar video:', err);
      this.errorMessage = 'No se pudo grabar el video. Código: ' + (err.code ?? 'desconocido');
    }
  }
  async uploadCapturedVideo(fullPath: string, visitId: string) {
    try {
      const fileName = fullPath.substring(fullPath.lastIndexOf('/') + 1);
      const filePath = fullPath.substring(0, fullPath.lastIndexOf('/') + 1);

      this.file.resolveLocalFilesystemUrl(fullPath).then((fileEntry: any) => {
        fileEntry.file((file: File) => {
          const formData = new FormData();
          formData.append('video', file, fileName);
          formData.append('visitId', visitId); // Aquí se incluye el visitId

          this.visitsManager.uploadVisitVideo(visitId, file).subscribe({
            next: () => {
              console.log('Video subido exitosamente');
              alert('Video subido exitosamente');
              this.router.url.startsWith('/home/visits');
            },

            error: (err) => {
              console.error(' Error al subir el video:', err);
              this.errorMessage = 'No se pudo subir el video.';
            }
          });
        }, (err: any) => {
          console.error('No se pudo leer el archivo de video:', err);
          this.errorMessage = 'No se pudo leer el archivo de video.';
        });
      }).catch((err) => {
        console.error('Error al resolver la ruta del archivo:', err);
        this.errorMessage = 'No se pudo acceder al archivo.';
      });

    } catch (err: any) {
      console.error('Error general al subir video:', err);
      this.errorMessage = 'Error inesperado al subir el video.';
    }
  }

}
