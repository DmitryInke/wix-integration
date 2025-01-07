import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { handleApiCall } from '../common/utils/api-error-handler';

@Injectable()
export class WixApiService {
  private readonly apiKey: string;
  private readonly wixSiteId: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.apiKey = this.configService.getOrThrow<string>('WIX_API_KEY');
    this.wixSiteId = this.configService.getOrThrow<string>('WIX_SITE_ID');
  }

  async post<T>(url: string, data: any, errorMessage: string): Promise<T> {
    const response: AxiosResponse<T> = await handleApiCall(
      firstValueFrom(
        this.httpService.post<T>(url, data, {
          headers: this.getHeaders(),
        }),
      ),
      errorMessage,
    );
    return response.data;
  }

  async patch<T>(url: string, data: any, errorMessage: string): Promise<T> {
    const response: AxiosResponse<T> = await handleApiCall(
      firstValueFrom(
        this.httpService.patch<T>(url, data, {
          headers: this.getHeaders(),
        }),
      ),
      errorMessage,
    );
    return response.data;
  }

  async delete<T>(url: string, errorMessage: string): Promise<T> {
    const response: AxiosResponse<T> = await handleApiCall(
      firstValueFrom(
        this.httpService.delete<T>(url, {
          headers: this.getHeaders(),
        }),
      ),
      errorMessage,
    );
    return response.data;
  }

  private getHeaders() {
    return {
      Authorization: this.apiKey,
      'Content-Type': 'application/json',
      'wix-site-id': this.wixSiteId,
    };
  }
}
