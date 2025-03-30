"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWeb3 } from "@/components/web3-provider";

const amenitiesOptions = [
  "Swimming Pool",
  "Gym",
  "Parking",
  "Balcony",
  "Internet",
  "Laundry",
  "Dishwasher",
  "Air Conditioning",
  "Heating",
  "Furnished",
  "Pet Friendly",
  "Wheelchair Accessible",
  "Elevator",
  "Security",
  // Add more amenities as needed
];
export default function ListProperty() {
  const router = useRouter();
  const { isConnected, connectWallet } = useWeb3();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    availableFrom: "",
    minRentalPeriod: "3",
    amenities: [],
  });
  const [amenities, setAmenities] = useState<string[]>([]);
  const handleAmenitiesChange = (amenity: string) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter((a) => a !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file)
      );
      setUploadedImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      await connectWallet();
      return;
    }

    setIsSubmitting(true);

    // Simulate blockchain transaction
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Property listed successfully! Transaction hash: 0x123...456");
      router.push("/");
    }, 2000);
  };

  return (
    <div className="container py-8 md:py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 gradient-text">
          List Your Property
        </h1>

        <Card className="bg-card border">
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
            <CardDescription>
              Fill in the details about your property to list it on the
              marketplace.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-secondary">
                  Basic Information
                </h3>

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Property Title</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="e.g. Modern Apartment in Downtown"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="border"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe your property..."
                      rows={4}
                      value={formData.description}
                      onChange={handleChange}
                      required
                      className="border"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="e.g. New York, NY"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className="border"
                    />
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-secondary">
                  Property Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="price">Monthly Rent (ETH)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="e.g. 0.5"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      className="border"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="area">Area (m²)</Label>
                    <Input
                      id="area"
                      name="area"
                      type="number"
                      min="1"
                      placeholder="e.g. 85"
                      value={formData.area}
                      onChange={handleChange}
                      required
                      className="border"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Select
                      value={formData.bedrooms}
                      onValueChange={(value) =>
                        handleSelectChange("bedrooms", value)
                      }
                    >
                      <SelectTrigger id="bedrooms" className="border">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5+">5+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Select
                      value={formData.bathrooms}
                      onValueChange={(value) =>
                        handleSelectChange("bathrooms", value)
                      }
                    >
                      <SelectTrigger id="bathrooms" className="border">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5+">5+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="availableFrom">Available From</Label>
                    <Input
                      id="availableFrom"
                      name="availableFrom"
                      type="date"
                      value={formData.availableFrom}
                      onChange={handleChange}
                      required
                      className="border"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="minRentalPeriod">
                      Minimum Rental Period (months)
                    </Label>
                    <Select
                      value={formData.minRentalPeriod}
                      onValueChange={(value) =>
                        handleSelectChange("minRentalPeriod", value)
                      }
                    >
                      <SelectTrigger id="minRentalPeriod" className="border">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 month</SelectItem>
                        <SelectItem value="3">3 months</SelectItem>
                        <SelectItem value="6">6 months</SelectItem>
                        <SelectItem value="12">12 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Property Images */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-secondary">
                  Property Images
                </h3>

                <div className="grid gap-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {uploadedImages.map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-md overflow-hidden border"
                      >
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Property image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-background/80 p-1 rounded-full"
                          aria-label="Remove image"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}

                    {uploadedImages.length < 8 && (
                      <label className="flex flex-col items-center justify-center aspect-square rounded-md border border-dashed cursor-pointer hover:bg-muted/50">
                        <div className="flex flex-col items-center justify-center p-4">
                          <Plus className="h-8 w-8 mb-2 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground text-center">
                            Upload Image
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Upload up to 8 images of your property. The first image will
                    be used as the cover image.
                  </p>
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-secondary">
                  Amenities
                </h3>
                <div className="gap-2 w-[50%] flex flex-wrap">
                  {" "}
                  {/* Changed to flex container */}
                  {amenities.map((selectedAmenity) => (
                    <div
                      key={selectedAmenity}
                      className="flex items-center bg-gray-100 px-2 py-1 rounded-md border border-gray-200"
                    >
                      <span>{selectedAmenity}</span>
                      <button
                        className="ml-2 text-red-500 hover:text-red-700"
                        onClick={() => handleAmenitiesChange(selectedAmenity)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <Select
                    onValueChange={handleAmenitiesChange}
                    value=""
                    name="amenities"
                  >
                    <SelectTrigger
                      className="py-2 px-3 rounded-md border border-gray-300"
                      autoCapitalize="words"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {amenitiesOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.push("/")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="web3-button"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Listing Property...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    List Property
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
