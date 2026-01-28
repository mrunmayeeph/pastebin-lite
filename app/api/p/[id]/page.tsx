import { headers } from 'next/headers';
import { getPasteWithoutIncrement } from '@/lib/db';
import { getCurrentTimeMs } from '@/lib/time';
import { notFound } from 'next/navigation';

interface PageProps {
  params: { id: string };
}

export default async function PastePage({ params }: PageProps) {
  const { id } = params;
  
  // Create a mock request object for getCurrentTimeMs
  const headersList = headers();
  const testNowHeader = headersList.get('x-test-now-ms');
  
  const mockRequest = {
    headers: {
      get: (name: string) => {
        if (name === 'x-test-now-ms') {
          return testNowHeader;
        }
        return null;
      }
    }
  } as unknown as Request;
  
  const currentTimeMs = getCurrentTimeMs(mockRequest);
  
  // Fetch paste without incrementing view count (HTML view doesn't count as a view)
  const paste = await getPasteWithoutIncrement(id, currentTimeMs);
  
  if (!paste) {
    notFound();
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Paste - {id}</title>
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f5f5;
            padding: 20px;
            line-height: 1.6;
          }
          .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          .header {
            background: #2563eb;
            color: white;
            padding: 20px 24px;
          }
          .header h1 {
            font-size: 24px;
            font-weight: 600;
          }
          .content {
            padding: 24px;
          }
          .paste-content {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            padding: 16px;
            white-space: pre-wrap;
            word-wrap: break-word;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            line-height: 1.5;
            min-height: 100px;
            max-height: 600px;
            overflow-y: auto;
          }
          .footer {
            padding: 16px 24px;
            border-top: 1px solid #e5e7eb;
            background: #f9fafb;
            font-size: 14px;
            color: #6b7280;
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="header">
            <h1>Paste</h1>
          </div>
          <div className="content">
            <div className="paste-content">{paste.content}</div>
          </div>
          <div className="footer">
            Paste ID: {id}
          </div>
        </div>
      </body>
    </html>
  );
}