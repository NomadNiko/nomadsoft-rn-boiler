import { useState, useCallback } from 'react';
import { FormErrors, ProfileFormData } from '../types';

export const useFormValidation = (initialData: ProfileFormData) => {
  const [formData, setFormData] = useState<ProfileFormData>(initialData);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    // Validate username (optional but if provided, must meet criteria)
    if (formData.username.trim()) {
      if (formData.username.trim().length < 3) {
        newErrors.username = 'Username must be at least 3 characters long';
      } else if (formData.username.trim().length > 20) {
        newErrors.username = 'Username must be no more than 20 characters long';
      } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username.trim())) {
        newErrors.username = 'Username can only contain letters, numbers, underscores, and hyphens';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback((field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const resetForm = useCallback((newData: ProfileFormData) => {
    setFormData(newData);
    setErrors({});
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    formData,
    errors,
    validateForm,
    handleInputChange,
    resetForm,
    clearErrors,
    setFormData,
  };
};