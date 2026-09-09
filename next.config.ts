import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The MongoDB driver pulls in optional native add-ons (kerberos, snappy, and
  // friends). Bundling it stalls the build, so it is required at runtime instead.
  serverExternalPackages: ["mongodb"],
  // The contact API (Resend) and the admin panel both need a server, so this is
  // no longer a static export. Deploy as a Node app rather than a static folder.
  images: {
    formats: ["image/avif", "image/webp"],
  },
  trailingSlash: false,
  poweredByHeader: false,
};

export default nextConfig;
