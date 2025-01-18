'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowUpDown, Download } from 'lucide-react'
import { createCSVofData, getPageData } from '@/lib/dataHandler'

export function StatTable() {
    const [data, setData] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [sortField, setSortField] = useState('Yds')
    const [sortDirection, setSortDirection] = useState('desc')
    const [searchTerm, setSearchTerm] = useState('')
    const itemsPerPage = 10

    // get new data whenever page, sort, sort direction or search changes
    useEffect(() => {
        fetchData()
    }, [currentPage, sortField, sortDirection, searchTerm])

    const fetchData = () => {
        const result = getPageData(currentPage, itemsPerPage, sortField, sortDirection, searchTerm)
        setData(result.data)
        setTotalPages(Math.ceil(result.total / itemsPerPage))
    }

    const handleSort = (field) => {
        if (field === sortField) {
            // if the field is already selected, reverse the order
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(field)
            setSortDirection('desc')
        }
        // set the page back to first page
        setCurrentPage(1)
    }

    const handleSearch = (event) => {
        setSearchTerm(event.target.value)
        setCurrentPage(1)
    }

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1))
    }

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
    }

    const handleExportCSV = () => {
        const csv = createCSVofData(sortField, sortDirection, searchTerm)
        // create a Blob containing CSV data
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })

        // create download link for CSV file
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.target = '_blank'
        link.download = "rushing.csv"

        // trigger the download
        link.click()
    }

    return (
    <div>
        <div className="mb-4 flex justify-between items-center">
            <Input
                type="text"
                placeholder="Search player name"
                value={searchTerm}
                onChange={handleSearch}
                className="max-w-sm"
            />
            <Button
                onClick={handleExportCSV}
                className="ml-auto group bg-white text-black hover:bg-green-600"
            >
                <Download className="mr-2 h-4 w-4" />
                Export CSV
            </Button>
        </div>
        <Table>
            <TableHeader>
                <TableRow>
                    {/* Map the keys to the Table header (Make them clickable buttons) */}
                    {data.length > 0 && Object.keys(data[0]).map((key) => (
                        <TableHead key={key}>
                            <Button
                                variant="ghost"
                                onClick={() => handleSort(key)}
                                className="flex items-center"
                            >
                                {key}
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {/* Map the data to the Table rows, under their key */}
                {data.map((item, index) => (
                    <TableRow key={index}>
                        {Object.entries(item).map(([key, value]) => (
                            <TableCell key={key}>
                                {value}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        <div className="flex justify-between items-center mt-4">
            <Button onClick={handlePrevPage} disabled={currentPage === 1}>
                Previous
            </Button>
            <span>Page {currentPage} of {totalPages === 0 ? "1" : totalPages}</span>
            <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
                Next
            </Button>
        </div>
    </div>
    )
}