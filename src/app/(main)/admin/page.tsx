"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { mockAdminAttendanceList } from "@/lib/mock-data"
import Link from "next/link"
import { Download, MapPin, Users, Building } from "lucide-react"
import { useI18n } from "@/hooks/use-i18n";

export default function AdminPage() {
  const { t } = useI18n();
  const records = mockAdminAttendanceList;
  const todayRecords = records.filter(r => new Date(r.timestamp).toDateString() === new Date().toDateString());
  const departmentsToday = [...new Set(todayRecords.map(r => r.department))];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">{t('admin.title')}</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.attendeesToday')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayRecords.length}</div>
            <p className="text-xs text-muted-foreground">{t('admin.totalEmployeesPresent')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.departmentsPresent')}</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departmentsToday.length}</div>
            <p className="text-xs text-muted-foreground">{t('admin.uniqueDepartments')}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <CardTitle>{t('admin.allRecords')}</CardTitle>
              <CardDescription>
                {t('admin.allRecordsDescription')}
              </CardDescription>
            </div>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              {t('admin.exportReport')}
            </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('admin.table.employee')}</TableHead>
                  <TableHead>{t('admin.table.department')}</TableHead>
                  <TableHead>{t('admin.table.date')}</TableHead>
                  <TableHead>{t('admin.table.time')}</TableHead>
                  <TableHead className="text-right">{t('admin.table.location')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.slice(0, 10).map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.userName}</TableCell>
                    <TableCell>{record.department}</TableCell>
                    <TableCell>{new Date(record.timestamp).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link 
                          href={`https://www.google.com/maps?q=${record.location.latitude},${record.location.longitude}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          aria-label={`View location for ${record.userName} on ${new Date(record.timestamp).toLocaleDateString()}`}
                        >
                          <MapPin className="mr-2 h-4 w-4" />
                          {t('admin.table.viewMap')}
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">{t('admin.showingFirstRecords')}</p>
        </CardContent>
      </Card>
    </div>
  )
}
