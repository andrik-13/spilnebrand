function getSupabaseRemotePatterns() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!url) {
    return [];
  }

  try {
    const parsed = new URL(url);

    return [
      {
        protocol: parsed.protocol.replace(':', ''),
        hostname: parsed.hostname,
        pathname: '/storage/v1/object/public/**',
      },
    ];
  } catch {
    return [];
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: getSupabaseRemotePatterns(),
  },
  async redirects() {
    return [
      {
        source: '/favicon.ico',
        destination: '/icon.svg',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
