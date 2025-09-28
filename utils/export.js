// Utility functions for exporting volunteer data

export const exportToCSV = (data, filename = 'volunteers.csv') => {
  if (!data || data.length === 0) {
    alert('No data to export')
    return
  }

  // Define the columns we want to export
  const columns = [
    { key: 'uid', header: 'UID' },
    { key: 'displayName', header: 'Display Name' },
    { key: 'email', header: 'Email' },
    { key: 'status', header: 'Status' },
    { key: 'createdAt', header: 'Application Date' },
    { key: 'formData.personal.firstName', header: 'First Name' },
    { key: 'formData.personal.lastName', header: 'Last Name' },
    { key: 'phone', header: 'Phone' },
    { key: 'formData.personal.dateOfBirth', header: 'Date of Birth' },
    { key: 'emergencyContact.name', header: 'Emergency Contact Name' },
    { key: 'emergencyContact.phone', header: 'Emergency Contact Phone' },
    { key: 'formData.volunteerExperience.experienceLevel', header: 'Experience Level' },
    { key: 'adminNotes', header: 'Admin Notes' }
  ]

  // Helper function to get nested object value
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : ''
    }, obj)
  }

  // Create CSV header
  const csvHeader = columns.map(col => col.header).join(',')

  // Create CSV rows
  const csvRows = data.map(item => {
    return columns.map(col => {
      let value = getNestedValue(item, col.key)
      
      // Format dates
      if (col.key === 'createdAt' && value && value.toDate) {
        value = value.toDate().toLocaleDateString()
      } else if (col.key === 'createdAt' && value) {
        value = new Date(value).toLocaleDateString()
      }
      
      // Escape commas and quotes in CSV
      if (typeof value === 'string') {
        value = value.replace(/"/g, '""')
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          value = `"${value}"`
        }
      }
      
      return value || ''
    }).join(',')
  })

  // Combine header and rows
  const csvContent = [csvHeader, ...csvRows].join('\n')

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const exportToJSON = (data, filename = 'volunteers.json') => {
  if (!data || data.length === 0) {
    alert('No data to export')
    return
  }

  // Clean up the data for export (remove functions and format dates)
  const cleanData = data.map(item => {
    const cleaned = { ...item }
    
    // Format dates
    if (cleaned.createdAt && cleaned.createdAt.toDate) {
      cleaned.createdAt = cleaned.createdAt.toDate().toISOString()
    }
    if (cleaned.updatedAt && cleaned.updatedAt.toDate) {
      cleaned.updatedAt = cleaned.updatedAt.toDate().toISOString()
    }
    if (cleaned.statusUpdatedAt && cleaned.statusUpdatedAt.toDate) {
      cleaned.statusUpdatedAt = cleaned.statusUpdatedAt.toDate().toISOString()
    }
    
    return cleaned
  })

  const jsonContent = JSON.stringify(cleanData, null, 2)
  
  // Create and trigger download
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}