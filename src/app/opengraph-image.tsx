import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'MG Arts — Interior Design & Execution'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '60px 80px',
          background: '#000000',
          color: '#ffffff',
        }}
      >
        {/* Accent top bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: 'linear-gradient(90deg, #c0392b, #e05b2b)',
          }}
        />

        {/* Brand mark */}
        <p
          style={{
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#c0392b',
            marginBottom: 24,
            lineHeight: 1,
          }}
        >
          MG ARTS
        </p>

        {/* Headline */}
        <h1
          style={{
            fontSize: 72,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            marginBottom: 20,
            maxWidth: 800,
          }}
        >
          Interior Design &amp; Execution
        </h1>

        {/* Descriptor */}
        <p style={{ fontSize: 22, color: '#555555', lineHeight: 1.4 }}>
          Turnkey execution · Transparent pricing · Pan-India delivery
        </p>
      </div>
    ),
    size,
  )
}
