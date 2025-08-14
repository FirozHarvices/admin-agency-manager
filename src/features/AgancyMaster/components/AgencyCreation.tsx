"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/Card"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Textarea } from "../../../components/ui/textarea"
import { Badge } from "../../../components/ui/badge"
import { Separator } from "../../../components/ui/separator"
import { Building2, Mail, Phone, Database, Cpu, Globe, ImageIcon } from "lucide-react"
import { useAgencyCreation } from "../hooks/useAgencyCreation"
import toast from "react-hot-toast"

interface AgencyCreationProps {
  onAgencyCreated: (agency: any) => void
}

export function AgencyCreation({ onAgencyCreated }: AgencyCreationProps) {
  const { formData, errors, handleInputChange, validateForm, resetForm } = useAgencyCreation()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const newAgency = {
      ...formData,
      user_role: "Agency",
      storage_used: 0,
      token_used: 0,
      website_used: 0,
      image_used: 0,
      created_at: new Date().toISOString().split("T")[0],
      status: "active",
    }

    onAgencyCreated(newAgency)


    // toast.suscess(`${formData.name} has been added to the system.`);

    resetForm()
  }

  return (
    <Card className="max-w-4xl mx-auto border-[#E2E8F0]">
      <CardHeader className="bg-[#F3F2FF] border-b border-[#E2E8F0]">
        <CardTitle className="flex items-center gap-2 text-[#1A202C]">
          <Building2 className="w-5 h-5 text-[#5D50FE]" />
          Create New Agency
        </CardTitle>
        <CardDescription className="text-[#718096]">
          Set up a new agency with custom resource limits and billing configuration
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" className="bg-[#F3F2FF] text-[#5D50FE] border-[#5D50FE]">
                Basic Information
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#1A202C] font-medium">
                  Agency Name *
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-[#718096]" />
                  <Input
                    id="name"
                    placeholder="e.g., Pixel Perfect Inc."
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`pl-10 border-[#E2E8F0] focus:border-[#5D50FE] ${errors.name ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#1A202C] font-medium">
                  Email Address *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-[#718096]" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="contact@agency.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`pl-10 border-[#E2E8F0] focus:border-[#5D50FE] ${errors.email ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[#1A202C] font-medium">
                  Phone Number *
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-[#718096]" />
                  <Input
                    id="phone"
                    placeholder="+1 202-555-0175"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={`pl-10 border-[#E2E8F0] focus:border-[#5D50FE] ${errors.phone ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
              </div>
            </div>
          </div>

          <Separator className="bg-[#E2E8F0]" />

          {/* Resource Limits */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" className="bg-[#F3F2FF] text-[#5D50FE] border-[#5D50FE]">
                Resource Limits
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="storage" className="text-[#1A202C] font-medium">
                  Storage Limit (MB)
                </Label>
                <div className="relative">
                  <Database className="absolute left-3 top-3 h-4 w-4 text-[#718096]" />
                  <Input
                    id="storage"
                    type="number"
                    min="1000"
                    step="1000"
                    value={formData.storage}
                    onChange={(e) => handleInputChange("storage", Number.parseInt(e.target.value) || 0)}
                    className={`pl-10 border-[#E2E8F0] focus:border-[#5D50FE] ${errors.storage ? "border-red-500" : ""}`}
                  />
                </div>
                <p className="text-sm text-[#718096]">{(formData.storage / 1000).toFixed(1)} GB storage allocation</p>
                {errors.storage && <p className="text-sm text-red-500">{errors.storage}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="token_count" className="text-[#1A202C] font-medium">
                  AI Token Limit
                </Label>
                <div className="relative">
                  <Cpu className="absolute left-3 top-3 h-4 w-4 text-[#718096]" />
                  <Input
                    id="token_count"
                    type="number"
                    min="10000"
                    step="10000"
                    value={formData.token_count}
                    onChange={(e) => handleInputChange("token_count", Number.parseInt(e.target.value) || 0)}
                    className={`pl-10 border-[#E2E8F0] focus:border-[#5D50FE] ${errors.token_count ? "border-red-500" : ""}`}
                  />
                </div>
                <p className="text-sm text-[#718096]">
                  {(formData.token_count / 1000).toFixed(0)}K tokens for AI operations
                </p>
                {errors.token_count && <p className="text-sm text-red-500">{errors.token_count}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="website_count" className="text-[#1A202C] font-medium">
                  Website Limit
                </Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-4 w-4 text-[#718096]" />
                  <Input
                    id="website_count"
                    type="number"
                    min="1"
                    value={formData.website_count}
                    onChange={(e) => handleInputChange("website_count", Number.parseInt(e.target.value) || 0)}
                    className={`pl-10 border-[#E2E8F0] focus:border-[#5D50FE] ${errors.website_count ? "border-red-500" : ""}`}
                  />
                </div>
                <p className="text-sm text-[#718096]">Maximum websites they can create</p>
                {errors.website_count && <p className="text-sm text-red-500">{errors.website_count}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_count" className="text-[#1A202C] font-medium">
                  Image Generation Credits
                </Label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-3 h-4 w-4 text-[#718096]" />
                  <Input
                    id="image_count"
                    type="number"
                    min="1"
                    step="1"
                    value={formData.image_count}
                    onChange={(e) => handleInputChange("image_count", Number.parseInt(e.target.value) || 0)}
                    className={`pl-10 border-[#E2E8F0] focus:border-[#5D50FE] ${errors.image_count ? "border-red-500" : ""}`}
                  />
                </div>
                <p className="text-sm text-[#718096]">AI image generation credits</p>
                {errors.image_count && <p className="text-sm text-red-500">{errors.image_count}</p>}
              </div>
            </div>
          </div>

          <Separator className="bg-[#E2E8F0]" />

          {/* Additional Notes */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" className="bg-[#F3F2FF] text-[#5D50FE] border-[#5D50FE]">
                Additional Information
              </Badge>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-[#1A202C] font-medium">
                Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                placeholder="Any additional notes about this agency..."
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                className="border-[#E2E8F0] focus:border-[#5D50FE] min-h-[100px]"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6">
            <Button type="submit" className="bg-[#5D50FE] hover:bg-[#4A3FE7] text-white px-8 py-2">
              <Building2 className="w-4 h-4 mr-2" />
              Create Agency
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
