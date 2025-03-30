"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { MapPin, Bed, Bath, Square, Calendar, User, ArrowLeft, Share2, Heart, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWeb3 } from "@/components/web3-provider"
import { useToast } from "@/hooks/use-toast"

// Mock property data
const mockProperties = {
  "1": {
    id: "1",
    title: "Modern Apartment in Downtown",
    description:
      "This beautiful modern apartment is located in the heart of downtown. It features high ceilings, large windows with plenty of natural light, and premium finishes throughout. The open concept living area is perfect for entertaining, and the kitchen is equipped with high-end stainless steel appliances. The building offers amenities including a fitness center, rooftop terrace, and 24-hour concierge service.",
    location: "New York, NY",
    price: 0.5,
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    bedrooms: 2,
    bathrooms: 2,
    area: 85,
    isAvailable: true,
    owner: "0x1234...5678",
    amenities: ["Air Conditioning", "Heating", "Washer/Dryer", "Dishwasher", "Gym", "Parking", "Elevator", "Balcony"],
    availableFrom: "2023-12-01",
    minRentalPeriod: 3, // months
  },
  "2": {
    id: "2",
    title: "Cozy Studio near Central Park",
    description:
      "Charming studio apartment just steps away from Central Park. This cozy space has been recently renovated with modern fixtures and appliances. The efficient layout maximizes the living area, and the large windows provide excellent natural light. The building includes laundry facilities and a shared courtyard. Perfect for a single professional or couple looking to enjoy all that the city has to offer.",
    location: "New York, NY",
    price: 0.3,
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    isAvailable: true,
    owner: "0x9876...4321",
    amenities: ["Air Conditioning", "Heating", "Laundry in Building", "Dishwasher", "Hardwood Floors"],
    availableFrom: "2023-11-15",
    minRentalPeriod: 6, // months
  },
  // Add more properties as needed
}

export default function PropertyDetails() {
  const { id } = useParams()
  const { isConnected, connectWallet, isLoading } = useWeb3()
  const { toast } = useToast()
  const [activeImage, setActiveImage] = useState(0)
  const [isRenting, setIsRenting] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  // Get property data based on ID
  const property = mockProperties[id as keyof typeof mockProperties]

  if (!property) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
        <p className="mb-8">The property you're looking for doesn't exist or has been removed.</p>
        <Link href="/">
          <Button className="web3-button">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    )
  }

  const handleRentNow = async () => {
    if (!isConnected) {
      await connectWallet()
      return
    }

    setIsRenting(true)

    // Simulate blockchain transaction
    setTimeout(() => {
      setIsRenting(false)
      toast({
        title: "Property Rented Successfully!",
        description: `Transaction hash: 0x123...456`,
        variant: "success",
      })
    }, 2000)
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to listings
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Property Images */}
        <div className="space-y-4">
          <div className="relative aspect-video overflow-hidden rounded-lg border">
            <Image
              src={property.images[activeImage] || "/placeholder.svg"}
              alt={property.title}
              fill
              className="object-cover"
            />
            <Badge variant={property.isAvailable ? "default" : "secondary"} className="absolute top-4 right-4">
              {property.isAvailable ? "Available" : "Rented"}
            </Badge>
          </div>

          <div className="flex space-x-2 overflow-x-auto pb-2">
            {property.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border ${
                  activeImage === index ? "ring-2 ring-primary" : ""
                }`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${property.title} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Property Details */}
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold gradient-text">{property.title}</h1>
              <div className="flex items-center text-muted-foreground mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{property.location}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsFavorite(!isFavorite)}
                className="hover:border-accent hover:text-accent"
                aria-label="Add to favorites"
              >
                <Heart className={`h-4 w-4 ${isFavorite ? "fill-accent text-accent" : ""}`} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="hover:border-accent hover:text-accent"
                aria-label="Share"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1 text-primary" />
              <span>
                {property.bedrooms} {property.bedrooms === 1 ? "Bedroom" : "Bedrooms"}
              </span>
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1 text-primary" />
              <span>
                {property.bathrooms} {property.bathrooms === 1 ? "Bathroom" : "Bathrooms"}
              </span>
            </div>
            <div className="flex items-center">
              <Square className="h-4 w-4 mr-1 text-primary" />
              <span>{property.area} m²</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-primary" />
              <span>Available from {property.availableFrom}</span>
            </div>
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1 text-primary" />
              <span>Owner: {property.owner}</span>
            </div>
          </div>

          <Card className="bg-card border">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="text-2xl font-bold text-primary">{property.price} ETH</div>
                  <div className="text-sm text-muted-foreground">per month</div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Min. rental period: {property.minRentalPeriod} months
                </div>
              </div>

              <Button
                className="w-full web3-button"
                size="lg"
                disabled={!property.isAvailable || isRenting}
                onClick={handleRentNow}
              >
                {isRenting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Rent Now with MetaMask"
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-2">
                Security deposit: {property.price * 2} ETH (refundable)
              </p>
            </CardContent>
          </Card>

          <Tabs defaultValue="description">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger
                value="description"
                className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="amenities"
                className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
              >
                Amenities
              </TabsTrigger>
              <TabsTrigger value="terms" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                Terms
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4">
              <p className="text-muted-foreground">{property.description}</p>
            </TabsContent>
            <TabsContent value="amenities" className="mt-4">
              <ul className="grid grid-cols-2 gap-2">
                {property.amenities.map((amenity, index) => (
                  <li key={index} className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-primary mr-2" />
                    {amenity}
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="terms" className="mt-4">
              <ul className="space-y-2 text-muted-foreground">
                <li>• Minimum rental period: {property.minRentalPeriod} months</li>
                <li>• Security deposit: {property.price * 2} ETH (refundable)</li>
                <li>• Rent is paid monthly in advance</li>
                <li>• No pets allowed</li>
                <li>• No smoking inside the property</li>
              </ul>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

