/** @type {import('next').NextConfig} */
const nextConfig = {
    redirects: async () => {
        return [
            {
                source: '/',
                destination: '/',
                permanent: true,
            },
        ];
    }
};

module.exports = nextConfig;
