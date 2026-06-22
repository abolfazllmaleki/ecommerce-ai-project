import { BadRequestException, Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('mock-gateway')
export class MockGatewayController {
  @Get('pay')
  async pay(
    @Query('authority') authority: string,
    @Query('callback') callback: string,
    @Res() res: Response,
  ) {
    if (!authority) {
      throw new BadRequestException('Authority is required');
    }

    if (!callback) {
      throw new BadRequestException('Callback URL is required');
    }

    let successUrl: URL;
    let failUrl: URL;

    try {
      successUrl = new URL(callback);
      successUrl.searchParams.set('Authority', authority);
      successUrl.searchParams.set('Status', 'OK');

      failUrl = new URL(callback);
      failUrl.searchParams.set('Authority', authority);
      failUrl.searchParams.set('Status', 'NOK');
    } catch {
      throw new BadRequestException('Callback URL is invalid');
    }

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Mock Payment Gateway</title>
        <style>
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            min-height: 100vh;
            font-family: Arial, sans-serif;
            background: #f4f6f8;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .card {
            width: 100%;
            max-width: 460px;
            background: white;
            border-radius: 16px;
            padding: 32px;
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
            text-align: center;
          }

          h1 {
            margin: 0 0 12px;
            font-size: 24px;
            color: #111827;
          }

          p {
            margin: 8px 0;
            color: #4b5563;
            font-size: 14px;
          }

          .authority {
            margin: 20px 0;
            padding: 12px;
            background: #f3f4f6;
            border-radius: 10px;
            font-family: monospace;
            color: #111827;
            word-break: break-all;
          }

          .actions {
            display: flex;
            gap: 12px;
            margin-top: 24px;
          }

          button {
            flex: 1;
            border: none;
            border-radius: 10px;
            padding: 14px 16px;
            font-size: 15px;
            cursor: pointer;
            color: white;
          }

          .success {
            background: #16a34a;
          }

          .success:hover {
            background: #15803d;
          }

          .fail {
            background: #dc2626;
          }

          .fail:hover {
            background: #b91c1c;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Mock Payment Gateway</h1>
          <p>This is a test payment page.</p>
          <p>Select payment result:</p>

          <div class="authority">
            Authority: ${authority}
          </div>

          <div class="actions">
            <button class="success" onclick="window.location.href='${successUrl.toString()}'">
              Successful Payment
            </button>

            <button class="fail" onclick="window.location.href='${failUrl.toString()}'">
              Failed Payment
            </button>
          </div>
        </div>
      </body>
      </html>
    `;

    res.type('html').send(html);
  }
}
