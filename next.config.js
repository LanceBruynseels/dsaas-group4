// /** @type {import('next').NextConfig} */
// const nextConfig = {};
//
// module.exports = nextConfig;
// import { i18n } from './next-i18next.config';

const nextConfig = {
    // i18n,
    images: {
        domains: ['cdn.builder.io', 'legfcpyiwzvfhacgnpkw.supabase.co'],
        formats: ['image/avif', 'image/webp'],
    },
}

module.exports = nextConfig
