"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, SlidersHorizontal } from "lucide-react"
import PropertyCard from "@/components/property-card"

// Mock data for properties
const mockProperties = [
  {
    id: "1",
    title: "Modern Apartment in Downtown",
    location: "New York, NY",
    price: 0.5,
    image: "/placeholder.svg?height=225&width=400",
    bedrooms: 2,
    bathrooms: 2,
    area: 85,
    isAvailable: true,
  },
  {
    id: "2",
    title: "Cozy Studio near Central Park",
    location: "New York, NY",
    price: 0.3,
    image: "/placeholder.svg?height=225&width=400",
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    isAvailable: true,
  },
  {
    id: "3",
    title: "Luxury Penthouse with City View",
    location: "Los Angeles, CA",
    price: 1.2,
    image: "/placeholder.svg?height=225&width=400",
    bedrooms: 3,
    bathrooms: 3,
    area: 150,
    isAvailable: false,
  },
  {
    id: "4",
    title: "Charming Cottage with Garden",
    location: "San Francisco, CA",
    price: 0.7,
    image: "/placeholder.svg?height=225&width=400",
    bedrooms: 2,
    bathrooms: 1,
    area: 90,
    isAvailable: true,
  },
  {
    id: "5",
    title: "Spacious Family Home",
    location: "Chicago, IL",
    price: 0.8,
    image: "/placeholder.svg?height=225&width=400",
    bedrooms: 4,
    bathrooms: 2,
    area: 180,
    isAvailable: true,
  },
  {
    id: "6",
    title: "Beachfront Condo",
    location: "Miami, FL",
    price: 0.9,
    image: "/placeholder.svg?height=225&width=400",
    bedrooms: 2,
    bathrooms: 2,
    area: 95,
    isAvailable: true,
  },
]

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredProperties = mockProperties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "available") return matchesSearch && property.isAvailable
    if (activeTab === "rented") return matchesSearch && !property.isAvailable

    return matchesSearch
  })

  return (
    <div className="container py-8 md:py-12">
      {/* Hero Section */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 gradient-text">Find Your Perfect Rental</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Discover and rent properties with the security and transparency of blockchain technology
        </p>

        <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by location or property name"
              className="pl-9 border"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="sm:w-auto hover:border-accent hover:text-white">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </section>

      {/* Property Listings */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-secondary">Property Listings</h2>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="available">Available</TabsTrigger>
              <TabsTrigger value="rented">Rented</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No properties found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </section>
    </div>
  )
}