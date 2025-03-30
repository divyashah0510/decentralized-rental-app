"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Building2, Plus, Loader2, ArrowUpDown, MoreHorizontal, Edit, Trash, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

// Mock data for owned properties
const mockOwnedProperties = [
  {
    id: "1",
    title: "Modern Apartment in Downtown",
    location: "New York, NY",
    price: 0.5,
    isAvailable: false,
    renter: "0xabcd...1234",
    rentCollected: 1.5,
    rentDue: "2023-12-01",
  },
  {
    id: "2",
    title: "Cozy Studio near Central Park",
    location: "New York, NY",
    price: 0.3,
    isAvailable: true,
    renter: null,
    rentCollected: 0,
    rentDue: null,
  },
  {
    id: "3",
    title: "Luxury Penthouse with City View",
    location: "Los Angeles, CA",
    price: 1.2,
    isAvailable: false,
    renter: "0xefgh...5678",
    rentCollected: 2.4,
    rentDue: "2023-11-15",
  },
]

export default function MyProperties() {
  const { isConnected, connectWallet } = useWeb3()
  const [properties, setProperties] = useState(mockOwnedProperties)
  const [isLoading, setIsLoading] = useState(true)
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleWithdrawRent = async (propertyId: string) => {
    if (!isConnected) {
      await connectWallet()
      return
    }

    setSelectedProperty(propertyId)
    setIsWithdrawing(true)

    // Simulate blockchain transaction
    setTimeout(() => {
      setIsWithdrawing(false)
      setSelectedProperty(null)
      alert("Rent withdrawn successfully! Transaction hash: 0x123...456")
    }, 2000)
  }

  const handleDeleteProperty = (propertyId: string) => {
    setProperties((prev) => prev.filter((property) => property.id !== propertyId))
  }

  if (!isConnected) {
    return (
      <div className="container py-12 text-center">
        <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
        <p className="text-muted-foreground mb-8">Please connect your wallet to view your properties.</p>
        <Button onClick={connectWallet}>Connect Wallet</Button>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold gradient-text">My Properties</h1>
        <Link href="/list-property">
          <Button className="web3-button">
            <Plus className="mr-2 h-4 w-4" />
            List New Property
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : properties.length > 0 ? (
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
                <TableHead>Price (ETH)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Rent Collected</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="font-medium">
                    <Link href={`/property/${property.id}`} className="hover:underline">
                      {property.title}
                    </Link>
                  </TableCell>
                  <TableCell>{property.location}</TableCell>
                  <TableCell>{property.price} ETH/month</TableCell>
                  <TableCell>
                    <Badge variant={property.isAvailable ? "outline" : "secondary"}>
                      {property.isAvailable ? "Available" : "Rented"}
                    </Badge>
                  </TableCell>
                  <TableCell>{property.rentCollected} ETH</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {!property.isAvailable && property.rentCollected > 0 && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="web3-button">
                              <DollarSign className="h-4 w-4 mr-1" />
                              Withdraw
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Withdraw Rent</DialogTitle>
                              <DialogDescription>
                                You are about to withdraw {property.rentCollected} ETH of collected rent for{" "}
                                {property.title}.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                              <p className="text-sm text-muted-foreground">
                                This action will transfer the funds to your connected wallet address.
                              </p>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => {}}>
                                Cancel
                              </Button>
                              <Button
                                onClick={() => handleWithdrawRent(property.id)}
                                disabled={isWithdrawing && selectedProperty === property.id}
                              >
                                {isWithdrawing && selectedProperty === property.id ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                  </>
                                ) : (
                                  "Withdraw Rent"
                                )}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Property
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteProperty(property.id)}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Remove Listing
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <Building2 className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h2 className="text-xl font-semibold mb-2">No Properties Listed</h2>
          <p className="text-muted-foreground mb-6">
            You haven't listed any properties yet. Start earning by listing your property now.
          </p>
          <Link href="/list-property">
            <Button className="web3-button">
              <Plus className="mr-2 h-4 w-4" />
              List Your First Property
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}

