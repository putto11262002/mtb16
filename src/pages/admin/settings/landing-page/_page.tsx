import LandingPageForm from "@/components/client/config/LandingPageForm";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">หน้าแรก</h1>
        <p className="text-muted-foreground">จัดการการตั้งค่าหน้าแรก</p>
      </div>
      <div className="max-w-2xl">
        <LandingPageForm />
      </div>
    </div>
  );
}
