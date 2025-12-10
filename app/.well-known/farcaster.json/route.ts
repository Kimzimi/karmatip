import { NextResponse } from 'next/server';

const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://karma-tipper.vercel.app';

export async function GET() {
  const manifest = {
    accountAssociation: {
      header: "eyJmaWQiOjczMTM5NCwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweGJhYUZDNDg5RTc5YjgzQjNiMzg2Y2EzNDM1ZmNBMDQ1NkUwMGNBRWQifQ",
      payload: "eyJkb21haW4iOiJrYXJtYS10aXBwZXIudmVyY2VsLmFwcCJ9",
      signature: "pDRJhgkCNzlSGo/b0uroixniT10/ncYAKv8DAND+zj8AFYfqtKIk6phGsIHiCAjpQtJBGrjg85HSYmpPpYqdgBs="
    },
    frame: {
      version: "next",
      name: "Karma Tipper",
      iconUrl: `${baseUrl}/icon.png`,
      homeUrl: `${baseUrl}/`,
      imageUrl: `${baseUrl}/api/og`,
      buttonTitle: "Open Karma Tipper",
      splashImageUrl: `${baseUrl}/splash.png`,
      splashBackgroundColor: "#9333ea",
      webhookUrl: `${baseUrl}/api/webhook`
    }
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
