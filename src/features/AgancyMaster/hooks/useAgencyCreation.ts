"use client"

import { useState } from "react"
import { AgencyFormData } from "../types"

const initialFormData: AgencyFormData = {
  name: "",
  phone: "",
  email: "",
  storage: 20000,
  token_count: 300000,
  website_count: 30,
  image_count: 500,
  notes: "",
}

export function useAgencyCreation() {
  const [formData, setFormData] = useState<AgencyFormData>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Agency name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    }

    if (formData.storage < 1000) {
      newErrors.storage = "Storage must be at least 1000 MB"
    }

    if (formData.token_count < 10000) {
      newErrors.token_count = "Token count must be at least 10,000"
    }

    if (formData.website_count < 1) {
      newErrors.website_count = "Website count must be at least 1"
    }

    if (formData.image_count < 10) {
      newErrors.image_count = "Image count must be at least 10"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const resetForm = () => {
    setFormData(initialFormData)
    setErrors({})
  }

  return {
    formData,
    errors,
    handleInputChange,
    validateForm,
    resetForm,
  }
}
