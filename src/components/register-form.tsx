"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { LoaderCircle } from "lucide-react"
import { useI18n } from "@/hooks/use-i18n"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  phone: z.string().min(10, "Please enter a valid phone number."),
  department: z.string().min(2, "Department is required."),
  location: z.string().min(3, "Location is required."),
})

export function RegisterForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useI18n()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      department: "",
      location: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    console.log(values)
    toast({
      title: t('toast.registrationSuccess.title'),
      description: t('toast.registrationSuccess.description', { name: values.name }),
    })
    
    // Slight delay before redirecting to allow user to see toast
    setTimeout(() => {
      router.push("/home")
    }, 1500)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('register.form.name.label')}</FormLabel>
              <FormControl>
                <Input placeholder={t('register.form.name.placeholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('register.form.phone.label')}</FormLabel>
              <FormControl>
                <Input type="tel" placeholder={t('register.form.phone.placeholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('register.form.department.label')}</FormLabel>
              <FormControl>
                <Input placeholder={t('register.form.department.placeholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('register.form.location.label')}</FormLabel>
              <FormControl>
                <Input placeholder={t('register.form.location.placeholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? t('register.form.submit.loading') : t('register.form.submit.default')}
        </Button>
      </form>
    </Form>
  )
}
