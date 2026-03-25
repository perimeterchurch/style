import { PreviewMessageListener } from "@/components/editor/preview-message-listener";

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-6">
      <PreviewMessageListener />
      {children}
    </div>
  );
}
