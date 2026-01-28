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
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f5f5;
            padding: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
          }
          .container {
            max-width: 500px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            padding: 40px;
            text-align: center;
          }
          h1 {
            font-size: 48px;
            color: #dc2626;
            margin-bottom: 16px;
          }
          p {
            font-size: 18px;
            color: #6b7280;
            margin-bottom: 24px;
          }
          a {
            display: inline-block;
            padding: 12px 24px;
            background: #2563eb;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
          }
          a:hover {
            background: #1d4ed8;
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          <h1>404</h1>
          <p>This paste was not found or is no longer available.</p>
          <a href="/">Go Home</a>
        </div>
      </body>
    </html>
  );
}