import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import AboutUsHeroSettingsForm from "./_components/about-us-hero-settings-form";
import ContactSettingsForm from "./_components/contact-settings-form";
import HeroSettingsForm from "./_components/hero-settings-form";
import LandingPageSettingsForm from "./_components/landing-page-settings-form";
import PopupSettingsForm from "./_components/popup-settings-form";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">การตั้งค่า</h1>
        <p className="text-muted-foreground">
          จัดการการตั้งค่าทั้งหมดของเว็บไซต์
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>รูปภาพหลัก</CardTitle>
          <CardDescription>จัดการรูปภาพหลักของหน้าแรก</CardDescription>
        </CardHeader>
        <CardContent>
          <HeroSettingsForm />
        </CardContent>
      </Card>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>รูปภาพหน้าว่าด้วยเรา</CardTitle>
          <CardDescription>จัดการรูปภาพหลักของหน้าว่าด้วยเรา</CardDescription>
        </CardHeader>
        <CardContent>
          <AboutUsHeroSettingsForm />
        </CardContent>
      </Card>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>แท็กหน้าแรก</CardTitle>
          <CardDescription>
            จัดการแท็กสำหรับการแสดงเนื้อหาในหน้าแรก
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LandingPageSettingsForm />
        </CardContent>
      </Card>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>ป๊อปอัพ</CardTitle>
          <CardDescription>จัดการการตั้งค่าป๊อปอัพของเว็บไซต์</CardDescription>
        </CardHeader>
        <CardContent>
          <PopupSettingsForm />
        </CardContent>
      </Card>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>ติดต่อ</CardTitle>
          <CardDescription>จัดการข้อมูลติดต่อของเว็บไซต์</CardDescription>
        </CardHeader>
        <CardContent>
          <ContactSettingsForm />
        </CardContent>
      </Card>
    </div>
  );
}
