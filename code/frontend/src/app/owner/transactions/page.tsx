'use client';

import { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { transactionService } from "@/lib/api";
import { Transaction } from '@/types';

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        transactionService.getAll().then(data => {
            if (Array.isArray(data)) setTransactions(data);
        }).catch(console.error);
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Rekap Transaksi</h1>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>No Tiket</TableHead>
                            <TableHead>Waktu Masuk</TableHead>
                            <TableHead>Waktu Keluar</TableHead>
                            <TableHead>Plat Nomor</TableHead>
                            <TableHead className="text-right">Jumlah</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((tr) => (
                            <TableRow key={tr.id}>
                                <TableCell className="font-mono text-xs">{tr.ticket_number}</TableCell>
                                <TableCell>{new Date(tr.check_in_time).toLocaleString()}</TableCell>
                                <TableCell>{tr.check_out_time ? new Date(tr.check_out_time).toLocaleString() : '-'}</TableCell>
                                <TableCell>{tr.vehicle?.license_plate}</TableCell>
                                <TableCell className="text-right font-medium">
                                    {tr.total_cost ? `Rp {Number(tr.total_cost).toLocaleString()}` : 'active'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
