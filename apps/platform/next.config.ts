import path from 'path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  basePath: process.env.NEXT_BASE_PATH ?? '',
  turbopack: {
    root: path.resolve(__dirname, '../..'),
  },
}

export default nextConfig
