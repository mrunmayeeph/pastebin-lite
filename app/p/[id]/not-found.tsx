export default function NotFound() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Paste Not Found</title>
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Roboto, sans-serif;
            background: #121212;
            padding: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
          }
          .container {
            max-width: 500px;
            width: 100%;
            text-align: center;
          }
          .error-card {
            background: linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%);
            border: 1px solid #2a2a2a;
            border-radius: 16px;
            padding: 48px 32px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
          }
          .icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 24px;
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .icon svg {
            width: 40px;
            height: 40px;
            color: white;
          }
          h1 {
            font-size: 56px;
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: 800;
            margin-bottom: 16px;
            letter-spacing: -0.02em;
          }
          p {
            font-size: 18px;
            color: #9ca3af;
            margin-bottom: 32px;
            line-height: 1.6;
          }
          a {
            display: inline-block;
            padding: 14px 32px;
            background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
            color: white;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 600;
            font-size: 16px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
          }
          a:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
          }
          .subtitle {
            font-size: 14px;
            color: #6b7280;
            margin-top: 24px;
          }
          @media (max-width: 640px) {
            .error-card {
              padding: 32px 24px;
            }
            h1 {
              font-size: 48px;
            }
            p {
              font-size: 16px;
            }
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="error-card">
            <div className="icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1>404</h1>
            <p>This paste was not found or is no longer available.</p>
            <a href="/">Create New Paste</a>
            <p className="subtitle">The paste may have expired or reached its view limit.</p>
          </div>
        </div>
      </body>
    </html>
  );
}