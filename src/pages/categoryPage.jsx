import React from 'react'
import Header from '../components/Header'
import Category from '../components/Category'
import Footer from '../components/Footer'

const categoryPage = () => {
  return (
    <div>
      <Header />

       <div style={{ marginTop: "60px", marginBottom: "150px" }}>
        <Category />
      </div>

      <Footer />
    </div>
  )
}

export default categoryPage
