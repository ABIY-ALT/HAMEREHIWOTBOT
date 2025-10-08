import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { RegisterForm } from "@/components/register-form"
import { CalendarCheck } from "lucide-react"

export default function RegisterPage() {
  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader className="items-center text-center">
        <div className="flex items-center gap-2 mb-2">
          <CalendarCheck className="size-8 text-primary" />
          <h1 className="text-3xl font-bold font-headline">AttendEase</h1>
        </div>
        <CardTitle className="text-2xl">Register</CardTitle>
        <CardDescription>
          Enter your information to get started.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
    </Card>
  )
}
