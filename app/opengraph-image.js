import { ImageResponse } from 'next/og';

export const alt = 'جمعية قدوة - جيلٌ يبني، أثرٌ يبقى';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'linear-gradient(135deg, #1268b1 0%, #0ea9dd 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '40px',
          fontFamily: 'Tajawal, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 'bold',
            marginBottom: '20px',
            fontFamily: 'Noto Nastaliq Urdu, serif',
          }}
        >
          قُدوَة
        </div>
        <div
          style={{
            fontSize: 32,
            opacity: 0.9,
            textAlign: 'center',
          }}
        >
          جيلٌ يبني... أثرٌ يبقى
        </div>
        <div
          style={{
            fontSize: 24,
            opacity: 0.7,
            marginTop: '30px',
          }}
        >
          جمعية تربوية غير ربحية
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
