
export const validateEmail = (email) => {
    if (!email || !email.trim()) {
        return 'Email is required'
    }

    // Basic email regex - can be enhanced for stricter validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        return 'Please enter a valid email address'
    }

    return null
}

export const validatePassword = (password, options = {}) => {
    const {
        minLength = 8,
        requireUppercase = false,
        requireNumber = false,
        requireSpecial = false
    } = options

    if (!password) {
        return 'Password is required'
    }

    if (password.length < minLength) {
        return `Password must be at least ${minLength} characters`
    }

    if (requireUppercase && !/[A-Z]/.test(password)) {
        return 'Password must contain at least one uppercase letter'
    }

    if (requireNumber && !/[0-9]/.test(password)) {
        return 'Password must contain at least one number'
    }

    if (requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return 'Password must contain at least one special character'
    }

    return null
}

export const validateName = (name) => {
    if (!name || !name.trim()) {
        return 'Name is required'
    }

    if (name.trim().length < 2) {
        return 'Name must be at least 2 characters'
    }

    if (name.trim().length > 50) {
        return 'Name must be less than 50 characters'
    }

    return null
}

export const validatePasswordMatch = (password, confirmPassword) => {
    if (!confirmPassword) {
        return 'Please confirm your password'
    }

    if (password !== confirmPassword) {
        return 'Passwords do not match'
    }

    return null
}

export const validateTermsAgreement = (agreed) => {
    if (!agreed) {
        return 'You must agree to the Terms & Privacy Policy'
    }
    return null
}

export const validateLoginForm = (formData) => {
    const errors = {}

    errors.email = validateEmail(formData.email)
    errors.password = validatePassword(formData.password)

    return errors
}

export const validateRegisterForm = (formData, options = {}) => {
    const errors = {}

    if (formData.firstName !== undefined || formData.lastName !== undefined) {
        errors.firstName = validateName(formData.firstName)
        errors.lastName = validateName(formData.lastName)
    } else {
        errors.name = validateName(formData.name)
    }
    errors.email = validateEmail(formData.email)
    errors.password = validatePassword(formData.password, options)
    errors.confirmPassword = validatePasswordMatch(formData.password, formData.confirmPassword)
    errors.agreeTerms = validateTermsAgreement(formData.agreeTerms)

    return errors
}

export const hasErrors = (errors) => {
    return Object.values(errors).some(error => error !== null && error !== undefined)
}

export const getFirstError = (errors) => {
    const firstError = Object.values(errors).find(error => error)
    return firstError || null
}

export const clearError = (errors, field) => {
    return { ...errors, [field]: null }
}

export const clearAllErrors = () => {
    return {}
}