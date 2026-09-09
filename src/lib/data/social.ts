/**
 * Social platforms offered in the admin settings form. Plain data with no server
 * dependency, so the client form, the server layer, and the tests can all use it.
 */
export const SOCIAL_KEYS = [
  {
    key: "social_facebook",
    label: "Facebook",
    placeholder: "https://www.facebook.com/yourpage",
  },
  {
    key: "social_linkedin",
    label: "LinkedIn",
    placeholder: "https://www.linkedin.com/company/...",
  },
  { key: "social_x", label: "X (Twitter)", placeholder: "https://x.com/yourhandle" },
  { key: "social_instagram", label: "Instagram", placeholder: "https://www.instagram.com/..." },
  { key: "social_youtube", label: "YouTube", placeholder: "https://www.youtube.com/@..." },
] as const;

/** A link is only rendered when it is a full absolute URL, never a bare domain. */
export function isPublishableUrl(url: string): boolean {
  return /^https?:\/\/.+\..+/.test(url.trim());
}
