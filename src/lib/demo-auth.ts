export const demoCredentials = {
  email:
    process.env.NEXT_PUBLIC_DEMO_LOGIN_EMAIL ?? "demo@example.com",
  password:
    process.env.NEXT_PUBLIC_DEMO_LOGIN_PASSWORD ?? "TomsHostingSuite2026!",
};

export function isDemoEmail(email: string | null | undefined) {
  return email?.toLowerCase() === demoCredentials.email.toLowerCase();
}
