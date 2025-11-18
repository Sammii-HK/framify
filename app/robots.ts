import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://lunar.app";

	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: [
					"/api/",
					"/admin/",
					"/dashboard/",
					"/login/",
					"/_next/",
					"/create/",
				],
			},
			{
				userAgent: "Googlebot",
				allow: "/",
				disallow: [
					"/api/",
					"/admin/",
					"/dashboard/",
					"/login/",
					"/_next/",
					"/create/",
				],
			},
		],
		sitemap: `${baseUrl}/sitemap.xml`,
	};
}
