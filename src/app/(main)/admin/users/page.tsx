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
import { mockAdminUserList } from "@/lib/mock-data"
import { Download } from "lucide-react"
import { useI18n } from "@/hooks/use-i18n";
import { Badge } from "@/components/ui/badge";

export default function AdminUsersPage() {
  const { t } = useI18n();
  const users = mockAdminUserList;

  return (
    <Card>
      <CardHeader className="sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <CardTitle>{t('admin.users.title')}</CardTitle>
            <CardDescription>
              {t('admin.users.description')}
            </CardDescription>
          </div>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            {t('admin.users.export')}
          </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('admin.users.table.name')}</TableHead>
                <TableHead>{t('admin.users.table.department')}</TableHead>
                <TableHead>{t('admin.users.table.location')}</TableHead>
                <TableHead className="text-right">{t('admin.users.table.phone')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.name}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{user.department}</Badge>
                  </TableCell>
                  <TableCell>{user.location}</TableCell>
                  <TableCell className="text-right font-mono">{user.phone}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
