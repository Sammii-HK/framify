// A deliberate test page for Saer's CI check on a real pull request: raw colours equal to this project's
// Tailwind tokens (framer-text, framer-border). Test branch only; never merged.
export default function SaerCiTestPage() {
  return (
    <main className="p-6">
      <p className="text-[#1a1a1a]">Saer CI test</p>
      <div style={{ borderColor: "#e5e5e5" }} className="border p-4" />
    </main>
  );
}
