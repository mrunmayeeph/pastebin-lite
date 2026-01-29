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
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Roboto, sans-serif;
            background: #121212;
            padding: 24px;
            line-height: 1.6;
            min-height: 100vh;
          }
          .container {
            max-width: 1000px;
            margin: 0 auto;
          }
          .header {
            margin-bottom: 24px;
          }
          .header h1 {
            font-size: 32px;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 8px;
            letter-spacing: -0.02em;
          }
          .header p {
            color: #9ca3af;
            font-size: 14px;
          }
          .paste-card {
            background: linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%);
            border: 1px solid #2a2a2a;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
          }
          .paste-header {
            padding: 20px 24px;
            border-bottom: 1px solid #2a2a2a;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .paste-id {
            font-size: 14px;
            color: #9ca3af;
            font-family: 'Courier New', monospace;
          }
          .paste-badge {
            display: inline-block;
            padding: 6px 12px;
            background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
            color: white;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 600;
          }
          .paste-content {
            padding: 24px;
          }
          .content-box {
            background: #121212;
            border: 1px solid #3a3a3a;
            border-radius: 12px;
            padding: 20px;
            color: #e5e7eb;
            white-space: pre-wrap;
            word-wrap: break-word;
            font-family: 'Courier New', 'Monaco', monospace;
            font-size: 14px;
            line-height: 1.6;
            min-height: 120px;
            max-height: 600px;
            overflow-y: auto;
          }
          .content-box::-webkit-scrollbar {
            width: 8px;
          }
          .content-box::-webkit-scrollbar-track {
            background: #1e1e1e;
            border-radius: 4px;
          }
          .content-box::-webkit-scrollbar-thumb {
            background: #4a4a4a;
            border-radius: 4px;
          }
          .content-box::-webkit-scrollbar-thumb:hover {
            background: #5a5a5a;
          }
          .footer {
            padding: 16px 24px;
            border-top: 1px solid #2a2a2a;
            text-align: center;
          }
          .footer a {
            color: #8b5cf6;
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            transition: color 0.2s;
          }
          .footer a:hover {
            color: #a78bfa;
          }
          @media (max-width: 640px) {
            body {
              padding: 16px;
            }
            .header h1 {
              font-size: 24px;
            }
            .paste-content {
              padding: 16px;
            }
            .content-box {
              padding: 16px;
              font-size: 13px;
            }
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="header">
            <h1>Pastebin Lite</h1>
            <p>Viewing paste</p>
          </div>
          
          <div className="paste-card">
            <div className="paste-header">
              <span className="paste-id">ID: {id}</span>
              <span className="paste-badge">Active</span>
            </div>
            
            <div className="paste-content">
              <div className="content-box">{paste.content}</div>
            </div>
            
            <div className="footer">
              <a href="/">Create your own paste →</a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}