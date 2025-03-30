"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Key, Loader2, ArrowUpDown, Calendar, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useWeb3 } from "@/components/web3-provider"

// Mock data for rented properties
const mockRentedProperties = [
  {
    id: "1",
    title: "Modern Apartment in Downtown",
    location: "New York, NY",
    price: 0.5,
    owner: "0x1234...5678",
    rentedFrom: "2023-09-01",
    rentedUntil: "2023-12-01",
    deposit: 1.0,
    nextPayment: "2023-11-01",
  },
  {
    id: "3",
    title: "Luxury Penthouse with City View",
    location: "Los Angeles, CA",
    price: 1.2,
    owner: "0x9876...4321",
    rentedFrom: "2023-08-15",
    rentedUntil: "2024-02-15",
    deposit: 2.4,
    nextPayment: "2023-11-15",
  },
]

export default function MyRentals() {
  const { isConnected, connectWallet } = useWeb3()
  const [rentals, setRentals] = useState(mockRentedProperties)
  const [isLoading, setIsLoading] = useState(true)
  const [isReleasing, setIsReleasing] = useState(false)
  const [selectedRental, setSelectedRental] = useState<string | null>(null)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleReleaseDeposit = async (rentalId: string) => {
    if (!isConnected) {
      await connectWallet()
      return
    }

    setSelectedRental(rentalId)
    setIsReleasing(true)

    // Simulate blockchain transaction
    setTimeout(() => {
      setIsReleasing(false)
      setSelectedRental(null)
      setRentals((prev) => prev.filter((rental) => rental.id !== rentalId))
      alert("Deposit released successfully! Transaction hash: 0x123...456")
    }, 2000)
  }

  if (!isConnected) {
    return (
      <div className="container py-12 text-center">
        <Key className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
        <p className="text-muted-foreground mb-8">Please connect your wallet to view your rentals.</p>
        <Button onClick={connectWallet}>Connect Wallet</Button>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text">My Rentals</h1>
        <p className="text-muted-foreground mt-2">Manage your rented properties and security deposits</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : rentals.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">
                  <Button variant="ghost" className="p-0 hover:bg-transparent">
                    <span>Property</span>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Monthly Rent</TableHead>
                <TableHead>Rental Period</TableHead>
                <TableHead>Next Payment</TableHead>
                <TableHead>Security Deposit</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rentals.map((rental) => (
                <TableRow key={rental.id}>
                  <TableCell className="font-medium">
                    <Link href={`/property/${rental.id}`} className="hover:underline">
                      {rental.title}
                    </Link>
                  </TableCell>
                  <TableCell>{rental.location}</TableCell>
                  <TableCell>{rental.price} ETH</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>
                        {rental.rentedFrom} to {rental.rentedUntil}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{rental.nextPayment}</Badge>
                  </TableCell>
                  <TableCell>{rental.deposit} ETH</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="web3-button">
                          <ShieldCheck className="h-4 w-4 mr-1" />
                          Release Deposit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Release Security Deposit</DialogTitle>
                          <DialogDescription>
                            You are about to release your security deposit of {rental.deposit} ETH for {rental.title}.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <p className="text-sm text-muted-foreground">
                            This action will end your rental agreement and return your deposit to your wallet. Make sure
                            you have moved out of the property and returned all keys.
                          </p>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => {}}>
                            Cancel
                          </Button>
                          <Button
                            onClick={() => handleReleaseDeposit(rental.id)}
                            disabled={isReleasing && selectedRental === rental.id}
                          >
                            {isReleasing && selectedRental === rental.id ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              "Release Deposit"
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <Key className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h2 className="text-xl font-semibold mb-2">No Active Rentals</h2>
          <p className="text-muted-foreground mb-6">
            You don't have any active rental agreements. Browse available properties to find your next home.
          </p>
          <Link href="/">
            <Button className="web3-button">Browse Properties</Button>
          </Link>
        </div>
      )}
    </div>
  )
}

