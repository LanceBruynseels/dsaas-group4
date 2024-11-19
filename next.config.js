// /** @type {import('next').NextConfig} */
// const nextConfig = {};
//
// module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['cdn.builder.io'],
        formats: ['image/avif', 'image/webp'],
    },
}

module.exports = nextConfig
