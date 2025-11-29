/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    experimental: {
        // Optimisation des imports pour réduire la taille des bundles
        optimizePackageImports: [
            'lucide-react',
            '@radix-ui/react-dialog',
            '@radix-ui/react-select',
            '@radix-ui/react-label',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            'recharts',
        ],
    },

    // Optimisation des images
    images: {
        formats: ['image/avif', 'image/webp'],
    },

    // Compression activée
    compress: true,
};

module.exports = nextConfig;
