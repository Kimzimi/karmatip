import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        }}
      >
        <div style={{ fontSize: 180, marginBottom: 30 }}>✨</div>
        <div
          style={{
            fontSize: 90,
            fontWeight: 'bold',
            color: 'white',
            marginBottom: 30,
            textAlign: 'center',
          }}
        >
          Karma Tipper
        </div>
        <div
          style={{
            fontSize: 45,
            color: 'white',
            opacity: 0.95,
            textAlign: 'center',
            marginBottom: 40,
          }}
        >
          Support creators with crypto tips
        </div>
        <div
          style={{
            fontSize: 38,
            color: 'white',
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            padding: '25px 50px',
            borderRadius: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          💜 Tip with $DEGEN on Base
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 800,
    }
  );
}
