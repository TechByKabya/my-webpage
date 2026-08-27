import React from 'react'
import './admin.css' // Import custom global styling

export const Logo: React.FC = () => {
  return (
    <div className="custom-admin-logo">
      <div className="logo-icon">✨</div>
      <span className="logo-text">Kabya CMS</span>
    </div>
  )
}
